<?php

namespace App\Imports;

use App\Models\Period;
use App\Models\Reason;
use App\Models\Application;
use App\Models\CityFeature;
use App\Models\EducationLevel;
use App\Models\AgeClassification;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsErrors;

class ExcelDataImportV1 implements ToModel
{
    use SkipsErrors;

    public function startRow(): int
    {
        return 2;
    }


    public function model(array $row)
    {
        // 1. Cari atau buat periode
        $year = $row[16] ?? null;

        $yearValue = is_numeric($year) ? (int) $year : (int) preg_replace('/[^0-9]/', '', $year);

        if ($yearValue == 0) return null;

        $period = Period::firstOrCreate(
            ['year' => $yearValue],
            ['name' => "Setahun"] // Default name, can be customized later
        );

        // 2. Cari atau buat city feature berdasarkan kode
        $cityCode = $row[15] ?? null; // Kolom O: kode_kemendagri

        if (!$cityCode) {
            return null;
        }

        $cityFeature = CityFeature::where('code', $cityCode)->first();

        if (!$cityFeature) {
            return null; // skip baris ini
        }

        // 3. Simpan data Application
        Application::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id' => $period->id
            ],
            [
                'submitted' => $row[2] ?? 0, // C: diterima
                'accepted' => $row[3] ?? 0,  // D: dikabulkan
                'source' => 'Kementerian Agama', // Sumber data
            ]
        );

        AgeClassification::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id' => $period->id
            ],
            [
                'less_than_15' => $row[4] ?? 0,   // E
                'between_15_19' => $row[5] ?? 0,  // F
            ]
        );

        EducationLevel::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id' => $period->id
            ],
            [
                'no_school' => $row[6] ?? 0, // G
                'sd' => $row[7] ?? 0,        // H
                'smp' => $row[8] ?? 0,       // I
                'sma' => $row[9] ?? 0,       // J
            ]
        );

        Reason::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id' => $period->id
            ],
            [
                'pregnant' => $row[10] ?? 0,             // K
                'promiscuity' => $row[11] ?? 0,         // L
                'economy' => $row[12] ?? 0,             // M
                'traditional_culture' => $row[13] ?? 0, // N
                'avoiding_adultery' => $row[14] ?? 0,   // O
            ]
        );

        return null;
    }
}
