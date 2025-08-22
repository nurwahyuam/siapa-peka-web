<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\CityFeature;
use Illuminate\Http\Request;
use App\Imports\ExcelDataImportV1;
use App\Imports\ExcelDataImportV2;
use App\Imports\ExcelDataImportV3;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\HeadingRowImport;

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
        return Inertia::render('Admin/Manage/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048'
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

    public function show(CityFeature $cityFeature)
    {
        $cityFeature->load([
            'applications.period',
            'educationLevels.period',
            'ageClassifications.period',
            'reasons.period'
        ]);

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
        \App\Models\Application::truncate();
        \App\Models\EducationLevel::truncate();
        \App\Models\AgeClassification::truncate();
        \App\Models\Reason::truncate();
        \App\Models\Period::truncate();

        return redirect()->route('manage.index')
            ->with('success', 'Semua data berhasil dihapus!');
    }
}
