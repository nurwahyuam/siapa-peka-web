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

    public function edit($id)
    {
        $application = Application::with(['period', 'cityFeature'])
            ->findOrFail($id);

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

        return Inertia::render('Admin/Manage/Edit', [
            'cities' => CityFeature::all(),
            'periods' => Period::all(),
            'application' => $application,
            'education' => $education,
            'age' => $age,
            'childBride' => $childBride,
            'reason' => $reason,
        ]);
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

    public function destroy(CityFeature $cityFeature)
    {
        // Hapus semua data terkait
        $cityFeature->applications()->delete();
        $cityFeature->educationLevels()->delete();
        $cityFeature->ageClassifications()->delete();
        $cityFeature->reasons()->delete();
        $cityFeature->delete();

        return redirect()->route('Manage.index')
            ->with('success', 'Data berhasil dihapus!');
    }

    public function destroyAll()
    {
        // Hapus semua data dari semua tabel
        Application::truncate();
        EducationLevel::truncate();
        AgeClassification::truncate();
        Reason::truncate();

        return redirect()->route('manage.index')
            ->with('success', 'Semua data berhasil dihapus!');
    }
}
