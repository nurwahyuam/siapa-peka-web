<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Period;
use App\Models\Reason;
use App\Models\ChildBride;
use App\Models\Application;
use App\Models\CityFeature;
use Illuminate\Http\Request;
use App\Models\EducationLevel;
use App\Models\AgeClassification;
use App\Imports\ExcelDataImportV1;
use App\Imports\ExcelDataImportV2;
use App\Imports\ExcelDataImportV3;
use App\Imports\ExcelDataImportV4;
use Illuminate\Support\Facades\DB;
use App\Exports\ApplicationsExport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\HeadingRowImport;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Imports\HeadingRowFormatter;

class ManageController extends Controller
{
    public function index()
    {
        $cities = CityFeature::with(['applications.period', 'educationLevels', 'ageClassifications', 'reasons'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Manage/Index', [
            'cities' => $cities
        ]);
    }

    public function create()
    {
        $cities = CityFeature::all();
        $periods = Period::all();

        $applications = Application::with('period')
            ->select('city_feature_id', 'period_id')
            ->get()
            ->map(function ($item) {
                return [
                    'city_feature_id' => $item->city_feature_id,
                    'year' => $item->period->year,
                    'period_name' => $item->period->name,
                    'type' => 'application',
                ];
            });

        $reasons = Reason::with('period')
            ->select('city_feature_id', 'period_id')
            ->get()
            ->map(function ($item) {
                return [
                    'city_feature_id' => $item->city_feature_id,
                    'year' => $item->period->year,
                    'period_name' => $item->period->name,
                    'type' => 'reason',
                ];
            });

        $ageclassifications = AgeClassification::with('period')
            ->select('city_feature_id', 'period_id')
            ->get()
            ->map(function ($item) {
                return [
                    'city_feature_id' => $item->city_feature_id,
                    'year' => $item->period->year,
                    'period_name' => $item->period->name,
                    'type' => 'age_classification',
                ];
            });

        $childBriges = ChildBride::with('period')
            ->select('city_feature_id', 'period_id')
            ->get()
            ->map(function ($item) {
                return [
                    'city_feature_id' => $item->city_feature_id,
                    'year' => $item->period->year,
                    'period_name' => $item->period->name,
                    'type' => 'child_bride',
                ];
            });

        $educationLevels = EducationLevel::with('period')
            ->select('city_feature_id', 'period_id')
            ->get()
            ->map(function ($item) {
                return [
                    'city_feature_id' => $item->city_feature_id,
                    'year' => $item->period->year,
                    'period_name' => $item->period->name,
                    'type' => 'education_level',
                ];
            });

        // 🔹 Ambil daftar sumber unik dari Applications
        // Ambil semua sources dari DB
        $sources = Application::whereNotNull('sources')
            ->pluck('sources')
            ->flatten(1) // kalau datanya JSON array
            ->filter()   // buang null/empty
            ->map(fn($s) => is_array($s) ? $s['name'] : $s) // pastikan ambil name
            ->filter()   // buang null/empty lagi
            ->unique(fn($s) => strtolower($s)) // unique case insensitive
            ->values()
            ->map(fn($s) => ['name' => $s]) // ubah ke format { name: "..." }
            ->toArray();

        // 🔹 Gabung semua model (tetap Collection)
        $merged = collect()
            ->merge($applications)
            ->merge($reasons)
            ->merge($educationLevels)
            ->merge($ageclassifications)
            ->merge($childBriges);

        // 🔹 Baru ubah ke array di akhir
        $existingData = $merged->values()->toArray();

        return Inertia::render('Admin/Manage/Create', [
            'cities' => $cities,
            'periods' => $periods,
            'sources' => $sources,
            'existingData' => $existingData,
        ]);
    }

    public function storeCreate(Request $request)
    {
        $data = $request->validate([
            'city_feature_id' => 'required|exists:city_features,id',
            'selected_year' => 'required|integer|min:2000|max:2100',
            'manual_period_name' => 'required|in:Triwulan I,Triwulan II,Triwulan III,Triwulan IV,Setahun',
            'submitted' => 'nullable|integer|min:0',
            'accepted' => 'nullable|integer|min:0|lte:submitted',
            'sources' => 'required|array|min:1',
            'sources.*.name' => 'required|string|max:255',
            'no_school' => 'nullable|integer|min:0',
            'sd' => 'nullable|integer|min:0',
            'smp' => 'nullable|integer|min:0',
            'sma' => 'nullable|integer|min:0',
            'less_than_15' => 'nullable|integer|min:0',
            'between_15_19' => 'nullable|integer|min:0',
            'number_of_men_under_19' => 'nullable|integer|min:0',
            'number_of_women_under_19' => 'nullable|integer|min:0',
            'pregnant' => 'nullable|integer|min:0',
            'promiscuity' => 'nullable|integer|min:0',
            'economy' => 'nullable|integer|min:0',
            'traditional_culture' => 'nullable|integer|min:0',
            'avoiding_adultery' => 'nullable|integer|min:0',
        ]);

        // update or create period → tidak ada duplikat
        $period = Period::updateOrCreate(
            [
                'year' => $data['selected_year'],
                'name' => $data['manual_period_name'],
            ],
            []
        );

        $periodId = $period->id;

        // cek kalau aplikasi sudah ada
        $existingApplication = Application::where('city_feature_id', $data['city_feature_id'])
            ->where('period_id', $periodId)
            ->first();

        if ($existingApplication) {
            return back()
                ->withErrors(['city_feature_id' => 'Data untuk kabupaten/kota dan periode ini sudah ada'])
                ->withInput();
        }

        try {
            $app = Application::firstOrNew([
                'city_feature_id' => $data['city_feature_id'],
                'period_id'       => $periodId,
            ]);

            // Ambil sources lama (kalau ada)
            $sources = $app->sources ?? [];

            // Merge sources lama dengan request baru
            $sources = array_merge($sources, $data['sources']);

            // Simpan
            $app->sources = $sources;
            $app->submitted = $data['submitted'] ?? 0;
            $app->accepted = $data['accepted'] ?? 0;
            $app->save();


            EducationLevel::create([
                'city_feature_id' => $data['city_feature_id'],
                'period_id' => $periodId,
                'no_school' => $data['no_school'] ?? 0,
                'sd' => $data['sd'] ?? 0,
                'smp' => $data['smp'] ?? 0,
                'sma' => $data['sma'] ?? 0,
            ]);

            AgeClassification::create([
                'city_feature_id' => $data['city_feature_id'],
                'period_id' => $periodId,
                'less_than_15' => $data['less_than_15'] ?? 0,
                'between_15_19' => $data['between_15_19'] ?? 0,
            ]);

            $menUnder19 = $data['number_of_men_under_19'] ?? 0;
            $womenUnder19 = $data['number_of_women_under_19'] ?? 0;

            ChildBride::create([
                'city_feature_id' => $data['city_feature_id'],
                'period_id' => $periodId,
                'number_of_men_under_19' => $menUnder19,
                'number_of_women_under_19' => $womenUnder19,
                'total' => $menUnder19 + $womenUnder19,
            ]);

            Reason::create([
                'city_feature_id' => $data['city_feature_id'],
                'period_id' => $periodId,
                'pregnant' => $data['pregnant'] ?? 0,
                'promiscuity' => $data['promiscuity'] ?? 0,
                'economy' => $data['economy'] ?? 0,
                'traditional_culture' => $data['traditional_culture'] ?? 0,
                'avoiding_adultery' => $data['avoiding_adultery'] ?? 0,
            ]);
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }

        return redirect()->route('manage.index')->with('success', 'Data berhasil ditambahkan!');
    }

    public function import()
    {
        return Inertia::render('Admin/Manage/Import');
    }

    // public function storeImport(Request $request)
    // {
    //     $request->validate([
    //         'file' => 'required|mimes:xlsx|max:2048',
    //     ]);

    //     try {
    //         $file = $request->file('file');
    //         $fileName = time() . '_' . $file->getClientOriginalName();
    //         $filePath = $file->storeAs('excel-imports', $fileName);

    //         // Baca header
    //         $headings = (new HeadingRowImport)->toArray($filePath)[0][0];

    //         if (in_array('diterima', $headings)) {
    //             Excel::import(new ExcelDataImportV1, $filePath);
    //         } elseif (in_array('jumlah_pengantin_laki_laki_di_bawah_19_tahun', $headings)) {
    //             Excel::import(new ExcelDataImportV2, $filePath);
    //         } elseif (in_array('jumlah_dispensasi_kawin_diterima', $headings)) {
    //             Excel::import(new ExcelDataImportV3, $filePath);
    //         } elseif (in_array('sumber', $headings)) {
    //             Excel::import(new ExcelDataImportV4,    $filePath);
    //         } else {
    //             return back()->with('error', 'Format file tidak dikenali, pastikan menggunakan template yang benar.');
    //         }

    //         if (session()->has('import_errors')) {
    //             return back()
    //                 ->with('warning', 'Beberapa data tidak valid')
    //                 ->with('import_errors', session('import_errors'));
    //         }


    //         return redirect()->route('manage.index')->with('success', 'Data berhasil diimpor!');
    //     } catch (\Exception $e) {
    //         return back()->with('error', 'Gagal mengimpor: ' . $e->getMessage());
    //     }
    // }


    public function storeImport(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx|max:10240',
        ]);

        try {
            HeadingRowFormatter::default('none'); // supaya header tidak diubah
            $file = $request->file('file');
            $filePath = $file->store('excel-imports');

            // Jalankan import tapi hanya untuk validasi
            $import = new ExcelDataImportV4;

            // validasi header dulu
            if (!$import->validateHeaders($file)) {
                return back()->with([
                    'error' => 'Format header tidak sesuai',
                    'import_errors' => $import->errors,
                ]);
            }

            Excel::import($import, $filePath);

            // Kalau ada error, balikin ke user
            if (count($import->errors) > 0) {
                return back()->with([
                    'error' => 'Terdapat kesalahan pada data Excel',
                    'import_errors' => $import->errors
                ]);
            }

            // Kalau tidak ada error → simpan data
            DB::transaction(function () use ($import) {
                foreach ($import->validRows as $row) {
                    $import->saveRowToDatabase($row);
                }
            });

            return redirect()->route('manage.index')->with('success', 'Data berhasil diimpor!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengimpor: ' . $e->getMessage());
        }
    }


    public function export()
    {
        return Excel::download(new ApplicationsExport, 'export-siapapeka-data.xlsx');
    }

    public function edit($citySlug, $year = null, $periodId = null)
    {
        // Cari kota berdasarkan slug
        $city = CityFeature::where('slug', $citySlug)->firstOrFail();

        // Jika tahun tidak disediakan, gunakan tahun saat ini
        $selectedYear = $year ?? date('Y');

        // Ambil semua periode untuk tahun yang dipilih
        $availablePeriods = Period::where('year', $selectedYear)
            ->whereHas('applications', function ($q) use ($city) {
                $q->where('city_feature_id', $city->id);
            })
            ->get();

        $selectedPeriod = null;
        $existingData = null;

        if ($periodId) {
            $selectedPeriod = Period::find($periodId);
        } else {
            // Coba dapatkan periode yang sudah ada datanya untuk kota ini
            $existingPeriod = Application::where('city_feature_id', $city->id)
                ->whereHas('period', function ($query) use ($selectedYear) {
                    $query->where('year', $selectedYear);
                })
                ->with('period')
                ->first();

            if ($existingPeriod) {
                $selectedPeriod = $existingPeriod->period;
            } else {
                // Fallback ke periode pertama untuk tahun tersebut
                $selectedPeriod = Period::where('year', $selectedYear)->first();
            }
        }

        if ($selectedPeriod) {
            // Ambil data aplikasi sesuai kota + periode
            $application = Application::with(['period', 'cityFeature'])
                ->where('city_feature_id', $city->id)
                ->where('period_id', $selectedPeriod->id)
                ->first();

            if ($application) {
                // Ambil data terkait lainnya
                $education = EducationLevel::where('city_feature_id', $application->city_feature_id)
                    ->where('period_id', $application->period_id)
                    ->first();

                $age = AgeClassification::where('city_feature_id', $application->city_feature_id)
                    ->where('period_id', $application->period_id)
                    ->first();

                $childBride = ChildBride::where('city_feature_id', $application->city_feature_id)
                    ->where('period_id', $application->period_id)
                    ->first();

                $reason = Reason::where('city_feature_id', $application->city_feature_id)
                    ->where('period_id', $application->period_id)
                    ->first();

                // Gabungkan semua data
                $existingData = array_merge(
                    $application->toArray(),
                    $education ? $education->toArray() : [],
                    $age ? $age->toArray() : [],
                    $childBride ? $childBride->toArray() : [],
                    $reason ? $reason->toArray() : []
                );

                // Tambahkan info periode
                $existingData['year'] = $selectedPeriod->year;
                $existingData['period_name'] = $selectedPeriod->name;
                $existingData['period_id'] = $selectedPeriod->id;

                if (isset($existingData['sources'])) {
                    if (is_array($existingData['sources'])) {
                        // Jika sudah berupa array JSON
                        $existingData['sources'] = array_map(function ($item) {
                            return is_array($item) ? $item : ['name' => $item];
                        }, $existingData['sources']);
                    } else {
                        // Jika string, parse jadi array objek
                        $sourceString = $existingData['sources'];
                        if (!empty($sourceString)) {
                            $sourceNames = array_map('trim', explode(',', $sourceString));
                            $existingData['sources'] = array_map(function ($name) {
                                return ['name' => $name];
                            }, $sourceNames);
                        } else {
                            $existingData['sources'] = [];
                        }
                    }
                } else {
                    $existingData['sources'] = [];
                }
            }
        }

        $availableSources = Application::whereNotNull('sources')
            ->whereRaw("jsonb_array_length(sources) > 0")
            ->distinct()
            ->pluck('sources')
            ->flatMap(function ($source) {
                if (is_array($source)) {
                    return $source;
                }
                $decoded = json_decode($source, true);
                return $decoded ?: [];
            })
            ->unique(function ($item) {
                return is_array($item) ? $item['name'] ?? null : $item;
            })
            ->values()
            ->toArray();

        // Dapatkan tahun-tahun yang tersedia berdasarkan data yang ada
        $availableYears = Period::whereHas('applications', function ($query) use ($city) {
            $query->where('city_feature_id', $city->id);
        })
            ->distinct()
            ->pluck('year')
            ->toArray();

        // Tambahkan tahun saat ini jika belum ada
        if (!in_array(date('Y'), $availableYears)) {
            $availableYears[] = date('Y');
        }

        sort($availableYears);

        return Inertia::render('Admin/Manage/Edit', [
            'city' => $city,
            'periods' => $availablePeriods,
            'selectedYear' => $selectedYear,
            'existingData' => $existingData ?? [],
            'availableYears' => $availableYears,
            'available_sources' => $availableSources,
        ]);
    }

    public function update(Request $request, $citySlug, $year, $period = null)
    {
        try {
            // Validasi data
            $validated = $request->validate([
                'city_feature_id' => 'required|exists:city_features,id',
                'period_id' => 'required|exists:periods,id',

                // Applications
                'submitted' => 'nullable|integer|min:0',
                'accepted' => 'nullable|integer|min:0|lte:submitted',
                'sources' => 'nullable|array',
                'sources.*.name' => 'required|string|max:255',

                // Education Levels
                'no_school' => 'nullable|integer|min:0',
                'sd' => 'nullable|integer|min:0',
                'smp' => 'nullable|integer|min:0',
                'sma' => 'nullable|integer|min:0',

                // Age Classifications
                'less_than_15' => 'nullable|integer|min:0',
                'between_15_19' => 'nullable|integer|min:0',

                // Child Brides
                'number_of_men_under_19' => 'nullable|integer|min:0',
                'number_of_women_under_19' => 'nullable|integer|min:0',

                // Reasons
                'pregnant' => 'nullable|integer|min:0',
                'promiscuity' => 'nullable|integer|min:0',
                'economy' => 'nullable|integer|min:0',
                'traditional_culture' => 'nullable|integer|min:0',
                'avoiding_adultery' => 'nullable|integer|min:0',
            ], [
                'accepted.lte' => 'Jumlah dikabulkan tidak boleh lebih dari jumlah diajukan',
                '*.required' => 'Field :attribute harus diisi',
                '*.integer' => 'Field :attribute harus berupa angka',
                '*.min' => 'Field :attribute tidak boleh negatif',
            ]);

            DB::beginTransaction();

            // Hapus sources lama, lalu simpan yang baru (replace)
            $application = Application::where('city_feature_id', $validated['city_feature_id'])
                ->where('period_id', $validated['period_id'])
                ->first();

            if ($application) {
                $application->sources = []; // hapus semua sources lama
                $application->save();
            }

            // Simpan aplikasi (replace sources)
            Application::updateOrCreate(
                [
                    'city_feature_id' => $validated['city_feature_id'],
                    'period_id' => $validated['period_id']
                ],
                [
                    'submitted' => $validated['submitted'] ?? 0,
                    'accepted' => $validated['accepted'] ?? 0,
                    'sources' => $validated['sources'] ?? [],
                ]
            );

            // Simpan education
            EducationLevel::updateOrCreate(
                [
                    'city_feature_id' => $validated['city_feature_id'],
                    'period_id' => $validated['period_id']
                ],
                [
                    'no_school' => $validated['no_school'] ?? 0,
                    'sd' => $validated['sd'] ?? 0,
                    'smp' => $validated['smp'] ?? 0,
                    'sma' => $validated['sma'] ?? 0,
                ]
            );

            // Simpan age
            AgeClassification::updateOrCreate(
                [
                    'city_feature_id' => $validated['city_feature_id'],
                    'period_id' => $validated['period_id']
                ],
                [
                    'less_than_15' => $validated['less_than_15'] ?? 0,
                    'between_15_19' => $validated['between_15_19'] ?? 0,
                ]
            );

            // Simpan child bride
            ChildBride::updateOrCreate(
                [
                    'city_feature_id' => $validated['city_feature_id'],
                    'period_id' => $validated['period_id']
                ],
                [
                    'number_of_men_under_19' => $validated['number_of_men_under_19'] ?? 0,
                    'number_of_women_under_19' => $validated['number_of_women_under_19'] ?? 0,
                ]
            );

            // Simpan reason
            Reason::updateOrCreate(
                [
                    'city_feature_id' => $validated['city_feature_id'],
                    'period_id' => $validated['period_id']
                ],
                [
                    'pregnant' => $validated['pregnant'] ?? 0,
                    'promiscuity' => $validated['promiscuity'] ?? 0,
                    'economy' => $validated['economy'] ?? 0,
                    'traditional_culture' => $validated['traditional_culture'] ?? 0,
                    'avoiding_adultery' => $validated['avoiding_adultery'] ?? 0,
                ]
            );

            DB::commit();

            return redirect()->route('manage.index')->with('success', 'Data berhasil diperbarui!');
        } catch (ValidationException $e) {
            DB::rollBack();
            // Kirim error validasi ke FE (Inertia akan otomatis mengirim ke props errors)
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with([
                'error' => 'Terjadi kesalahan saat memperbarui data: ' . $e->getMessage()
            ], 500);
        }
    }


    public function show($slug)
    {

        $cityFeature = CityFeature::with([
            'applications.period',
            'educationLevels.period',
            'ageClassifications.period',
            'reasons.period',
            'childBrides.period'
        ])->where('slug', $slug)->first();

        if (!$cityFeature) {
            abort(404, 'Data tidak ditemukan');
        }

        return Inertia::render('Admin/Manage/Show', [
            'city' => $cityFeature
        ]);
    }

    public function destroy($citySlug, $periodId)
    {
        // Cari kota berdasarkan slug
        $city = CityFeature::where('slug', $citySlug)->firstOrFail();

        // Cari periode berdasarkan tahun
        $period = Period::where('id', $periodId)->first();

        if (!$period) {
            return redirect()->back()->with('error', 'Periode tidak ditemukan.');
        }

        // Hapus semua data terkait
        Application::where('city_feature_id', $city->id)
            ->where('period_id', $period->id)
            ->delete();

        EducationLevel::where('city_feature_id', $city->id)
            ->where('period_id', $period->id)
            ->delete();

        AgeClassification::where('city_feature_id', $city->id)
            ->where('period_id', $period->id)
            ->delete();

        ChildBride::where('city_feature_id', $city->id)
            ->where('period_id', $period->id)
            ->delete();

        Reason::where('city_feature_id', $city->id)
            ->where('period_id', $period->id)
            ->delete();

        return redirect()->route('manage.index')
            ->with('success', 'Data berhasil dihapus.');
    }
}
