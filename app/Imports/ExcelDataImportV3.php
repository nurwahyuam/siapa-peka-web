<?php

namespace App\Imports;

use App\Models\Application;
use App\Models\Period;
use App\Models\CityFeature;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Illuminate\Support\Str;

class ExcelDataImportV3 implements ToModel
{
    use SkipsErrors;
    public function startRow(): int
    {
        return 2;
    }

    public function model(array $row)
    {
        $year = $row[10] ?? null;
        $yearName = ucwords(strtolower($row[9])) ?? null;

        $yearValue = is_numeric($year) ? (int) $year : (int) preg_replace('/[^0-9]/', '', $year);

        if ($yearValue == 0) return null;

        $period = Period::firstOrCreate(
            ['year' => $yearValue],
            ['name' => $yearName]
        );

        $cityCode = $row[10] ?? null;

        if (!$cityCode) {
            return null;
        }

        $cityFeature = CityFeature::where('code', $cityCode)->first();

        if (!$cityFeature) {
            return null;
        }

        Application::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id' => $period->id
            ],
            [
                'submitted' => $row[4] ?? 0,   // E
                'accepted' => $row[5] ?? 0,    // F
                'source' => 'Provinsi Jawa Timur', // G
            ]
        );

        return null;
    }

    /**
     * Format nama tahun dengan kapitalisasi yang benar
     * Contoh: "TAHUN 2024" menjadi "Tahun 2024"
     */
    protected function formatYearName($yearName)
    {
        if (empty($yearName)) {
            return $yearName;
        }

        // Ubah ke lowercase terlebih dahulu
        $lowercase = Str::lower($yearName);

        // Ubah huruf pertama setiap kata menjadi kapital
        return Str::title($lowercase);
    }
}
