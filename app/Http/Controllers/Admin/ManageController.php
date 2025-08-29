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
use App\Exports\ApplicationsExport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\HeadingRowImport;
use Illuminate\Support\Facades\Validator;

class ManageController extends Controller
{
    public function index()
    {
        $cities = CityFeature::with(['applications.period', 'educationLevels', 'ageClassifications', 'reasons'])
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Admin/Manage/Index', [
            'cities' => $cities
        ]);
    }

    public function create()
    {
        $cities = CityFeature::all();
        $periods = Period::all();

        return Inertia::render('Admin/Manage/Create', [
            'cities' => $cities,
            'periods' => $periods,
        ]);
    }

    public function storeCreate(Request $request)
    {
        // Ambil data & konversi angka null ke 0
        $data = [
            'city_feature_id' => $request->city_feature_id,
            'selected_year' => (int) $request->selected_year,
            'manual_period_name' => $request->manual_period_name,
            'period_id' => $request->period_id,

            // Applications
            'submitted' => (int) ($request->submitted ?? 0),
            'accepted' => (int) ($request->accepted ?? 0),
            'source' => $request->source ?? 'Kementerian Agama',

            // Education
            'no_school' => (int) ($request->no_school ?? 0),
            'sd' => (int) ($request->sd ?? 0),
            'smp' => (int) ($request->smp ?? 0),
            'sma' => (int) ($request->sma ?? 0),

            // Age
            'less_than_15' => (int) ($request->less_than_15 ?? 0),
            'between_15_19' => (int) ($request->between_15_19 ?? 0),

            // Child brides
            'number_of_men_under_19' => (int) ($request->number_of_men_under_19 ?? 0),
            'number_of_women_under_19' => (int) ($request->number_of_women_under_19 ?? 0),

            // Reasons
            'pregnant' => (int) ($request->pregnant ?? 0),
            'promiscuity' => (int) ($request->promiscuity ?? 0),
            'economy' => (int) ($request->economy ?? 0),
            'traditional_culture' => (int) ($request->traditional_culture ?? 0),
            'avoiding_adultery' => (int) ($request->avoiding_adultery ?? 0),
        ];

        // Validasi
        $validator = Validator::make($data, [
            'city_feature_id' => 'required|exists:city_features,id',
            'selected_year' => 'required|integer|min:2000|max:2100',
            'period_id' => 'required_without:manual_period_name|exists:periods,id',
            'manual_period_name' => 'required_without:period_id|in:Triwulan I,Triwulan II,Triwulan III,Triwulan IV,Setahun',
            'submitted' => 'nullable|integer|min:0',
            'accepted' => 'nullable|integer|min:0|lte:submitted',
            'source' => 'required|in:Kementerian Agama,Provinsi Jawa Timur',
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

        // Tentukan period_id
        if (!empty($data['manual_period_name'])) {
            $existingPeriod = Period::where('year', $data['selected_year'])
                ->where('name', $data['manual_period_name'])
                ->first();

            if ($existingPeriod) {
                return redirect()->back()
                    ->withErrors(['manual_period_name' => 'Periode dengan nama dan tahun yang sama sudah ada'])
                    ->withInput();
            }

            $period = Period::create([
                'year' => $data['selected_year'],
                'name' => $data['manual_period_name'],
            ]);

            $periodId = $period->id;
        } else {
            $periodId = $data['period_id'];
            $period = Period::find($periodId);
            if (!$period || $period->year != $data['selected_year']) {
                return redirect()->back()
                    ->withErrors(['period_id' => 'Periode yang dipilih tidak sesuai dengan tahun data'])
                    ->withInput();
            }
        }

        // Cek apakah data sudah ada
        $existingApplication = Application::where('city_feature_id', $data['city_feature_id'])
            ->where('period_id', $periodId)
            ->first();

        if ($existingApplication) {
            return redirect()->back()
                ->withErrors(['city_feature_id' => 'Data untuk kabupaten/kota dan periode ini sudah ada'])
                ->withInput();
        }

        // Simpan ke DB dengan try-catch biar aman
        try {
            Application::create([
                'city_feature_id' => $data['city_feature_id'],
                'period_id' => $periodId,
                'submitted' => $data['submitted'],
                'accepted' => $data['accepted'],
                'source' => $data['source'],
            ]);

            EducationLevel::create([
                'city_feature_id' => $data['city_feature_id'],
                'period_id' => $periodId,
                'no_school' => $data['no_school'],
                'sd' => $data['sd'],
                'smp' => $data['smp'],
                'sma' => $data['sma'],
            ]);

            AgeClassification::create([
                'city_feature_id' => $data['city_feature_id'],
                'period_id' => $periodId,
                'less_than_15' => $data['less_than_15'],
                'between_15_19' => $data['between_15_19'],
            ]);

            $menUnder19 = $data['number_of_men_under_19'];
            $womenUnder19 = $data['number_of_women_under_19'];

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
                'pregnant' => $data['pregnant'],
                'promiscuity' => $data['promiscuity'],
                'economy' => $data['economy'],
                'traditional_culture' => $data['traditional_culture'],
                'avoiding_adultery' => $data['avoiding_adultery'],
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['db' => 'Gagal menyimpan data: ' . $e->getMessage()])->withInput();
        }

        return redirect()->route('manage.index')->with('success', 'Data berhasil ditambahkan!');
    }


    public function import()
    {
        return Inertia::render('Admin/Manage/Import');
    }

    public function storeImport(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx|max:2048',
        ]);

        try {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('excel-imports', $fileName);

            // Baca header
            $headings = (new HeadingRowImport)->toArray($filePath)[0][0];

            if (in_array('diterima', $headings)) {
                Excel::import(new ExcelDataImportV1, $filePath);
            } elseif (in_array('jumlah_pengantin_laki_laki_di_bawah_19_tahun', $headings)) {
                Excel::import(new ExcelDataImportV2, $filePath);
            } elseif (in_array('jumlah_dispensasi_kawin_diterima', $headings)) {
                Excel::import(new ExcelDataImportV3, $filePath);
            } else {
                return back()->with('error', 'Format file tidak dikenali');
            }

            return redirect()->route('manage.index')->with('success', 'Data berhasil diimpor!');
        } catch (\Exception $e) {
            return back()->with('error', 'Error importing file: ' . $e->getMessage());
        }
    }

    public function export()
    {
        return Excel::download(new ApplicationsExport, 'export-siapapeka-data.xlsx');
    }

    public function edit($citySlug, $year = null)
    {
        // Cari kota berdasarkan slug
        $city = CityFeature::where('slug', $citySlug)->firstOrFail();

        // Jika tahun tidak disediakan, gunakan tahun saat ini
        $selectedYear = $year ?? date('Y');

        // Ambil semua periode yang tersedia
        $periods = Period::all();

        // Cari periode berdasarkan tahun yang dipilih
        $period = Period::where('year', $selectedYear)->first();

        // Jika periode ditemukan, cari data aplikasi
        $application = null;
        if ($period) {
            $application = Application::with(['period', 'cityFeature'])
                ->where('city_feature_id', $city->id)
                ->where('period_id', $period->id)
                ->first();
        }

        // Jika tidak ada data, buat instance kosong
        if (!$application) {
            return Inertia::render('Admin/Manage/Edit', [
                'city' => $city,
                'periods' => $periods,
                'selectedYear' => $selectedYear,
                'existingData' => null,
                'availableYears' => Period::whereHas('applications', function ($query) use ($city) {
                    $query->where('city_feature_id', $city->id);
                })
                    ->distinct()
                    ->pluck('year')
                    ->toArray(),
            ]);
        }

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

        // Gabungkan semua data menjadi satu array
        $existingData = array_merge(
            $application->toArray(),
            $education ? $education->toArray() : [],
            $age ? $age->toArray() : [],
            $childBride ? $childBride->toArray() : [],
            $reason ? $reason->toArray() : []
        );

        // Tambahkan tahun dan nama periode ke existingData
        $existingData['year'] = $period->year;
        $existingData['period_name'] = $period->name;

        return Inertia::render('Admin/Manage/Edit', [
            'city' => $city,
            'periods' => $periods,
            'selectedYear' => $selectedYear,
            'existingData' => $existingData,
            'availableYears' => Period::whereHas('applications', function ($query) use ($city) {
                $query->where('city_feature_id', $city->id);
            })
                ->distinct()
                ->pluck('year')
                ->toArray(),
        ]);
    }

    public function store(Request $request, $citySlug, $year)
    {
        // Validasi data
        $validated = $request->validate([
            'city_feature_id' => 'required|exists:city_features,id',
            'selected_year' => 'required|integer',
            'period_id' => 'nullable|exists:periods,id',
            'manual_period_name' => 'nullable|string|max:255',

            // Applications
            'submitted' => 'nullable|integer|min:0',
            'accepted' => 'nullable|integer|min:0',
            'source' => 'nullable|string|max:255',

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
        ]);

        // Cari atau buat periode
        $periodId = $validated['period_id'];
        if (!$periodId && !empty($validated['manual_period_name'])) {
            $period = Period::firstOrCreate([
                'name' => $validated['manual_period_name'],
                'year' => $validated['selected_year']
            ]);
            $periodId = $period->id;
        }

        // Pastikan periodId ada sebelum melanjutkan
        if (!$periodId) {
            return back()->withErrors(['period_id' => 'Periode harus dipilih atau dibuat']);
        }

        // Cari atau buat data aplikasi
        $application = Application::updateOrCreate(
            [
                'city_feature_id' => $validated['city_feature_id'],
                'period_id' => $periodId
            ],
            [
                'submitted' => $validated['submitted'] ?? 0,
                'accepted' => $validated['accepted'] ?? 0,
                'source' => $validated['source'] ?? '',
            ]
        );

        // Cari atau buat data pendidikan
        EducationLevel::updateOrCreate(
            [
                'city_feature_id' => $validated['city_feature_id'],
                'period_id' => $periodId
            ],
            [
                'no_school' => $validated['no_school'] ?? 0,
                'sd' => $validated['sd'] ?? 0,
                'smp' => $validated['smp'] ?? 0,
                'sma' => $validated['sma'] ?? 0,
            ]
        );

        // Cari atau buat data usia
        AgeClassification::updateOrCreate(
            [
                'city_feature_id' => $validated['city_feature_id'],
                'period_id' => $periodId
            ],
            [
                'less_than_15' => $validated['less_than_15'] ?? 0,
                'between_15_19' => $validated['between_15_19'] ?? 0,
            ]
        );

        // Cari atau buat data pengantin anak
        ChildBride::updateOrCreate(
            [
                'city_feature_id' => $validated['city_feature_id'],
                'period_id' => $periodId
            ],
            [
                'number_of_men_under_19' => $validated['number_of_men_under_19'] ?? 0,
                'number_of_women_under_19' => $validated['number_of_women_under_19'] ?? 0,
            ]
        );

        // Cari atau buat data alasan
        Reason::updateOrCreate(
            [
                'city_feature_id' => $validated['city_feature_id'],
                'period_id' => $periodId
            ],
            [
                'pregnant' => $validated['pregnant'] ?? 0,
                'promiscuity' => $validated['promiscuity'] ?? 0,
                'economy' => $validated['economy'] ?? 0,
                'traditional_culture' => $validated['traditional_culture'] ?? 0,
                'avoiding_adultery' => $validated['avoiding_adultery'] ?? 0,
            ]
        );

        return redirect()->route('manage.edit', [
            'city' => $citySlug,
            'year' => $validated['selected_year']
        ])->with('success', 'Data berhasil disimpan!');
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

    public function destroy($citySlug, $year)
    {
        // Cari kota berdasarkan slug
        $city = CityFeature::where('slug', $citySlug)->firstOrFail();

        // Cari periode berdasarkan tahun
        $period = Period::where('year', $year)->first();

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
