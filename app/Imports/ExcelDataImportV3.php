<?php

namespace App\Imports;

use App\Models\Period;
use App\Models\Application;
use App\Models\CityFeature;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\WithStartRow;

class ExcelDataImportV3 implements ToModel, WithStartRow
{
    use SkipsErrors;

    public function startRow(): int
    {
        return 2;
    }

    public function model(array $row)
    {
        $year = $row[9] ?? null;
        $yearName = $row[8] ?? null;

        if ($yearName) {
            $parts = explode(' ', strtolower($yearName));
            $parts = array_map(fn($p) => strtoupper($p), $parts); // semua ke uppercase
            $parts[0] = ucfirst(strtolower($parts[0])); // kata pertama rapikan

            $yearName = implode(' ', $parts);
        }

        $yearValue = is_numeric($year) ? (int) $year : (int) preg_replace('/[^0-9]/', '', $year);

        if ($yearValue == 0) {
            Log::warning('Lewatkan baris karena year kosong/0', ['row' => $row]);
            return null;
        }

        $period = Period::updateOrCreate(
            [
                'year' => $yearValue,
                'name' => $yearName,
            ],
            []
        );

        $cityCode = $row[10] ?? null;
        if (!$cityCode) {
            Log::warning('Lewatkan baris karena year kosong/0', ['row' => $row]);
            return null;
        }

        $cityFeature = CityFeature::where('code', $cityCode)->first();
        if (!$cityFeature) {
            Log::warning('Lewatkan baris karena year kosong/0', ['row' => $row]);
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
}
