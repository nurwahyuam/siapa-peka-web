<?php

namespace App\Imports;

use App\Models\Period;
use App\Models\ChildBride;
use App\Models\CityFeature;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsErrors;

class ExcelDataImportV2 implements ToModel
{
    use SkipsErrors;
    
    public function startRow(): int
    {
        return 2;
    }
    public function model(array $row)
    {
        $year = $row[10] ?? null;
        $yearName = $row[8] ?? null;

        if ($yearName) {
            $parts = explode(' ', strtolower($yearName));
            $parts = array_map(fn($p) => strtoupper($p), $parts); // semua ke uppercase
            $parts[0] = ucfirst(strtolower($parts[0])); // kata pertama rapikan

            $yearName = implode(' ', $parts);
        }

        $yearValue = is_numeric($year) ? (int) $year : (int) preg_replace('/[^0-9]/', '', $year);

        if ($yearValue == 0) return null;

        $period = Period::updateOrCreate(
            [
                'year' => $yearValue,
                'name' => $yearName,
            ],
            []
        );

        $cityCode = $row[11] ?? null;
        if (!$cityCode) {
            return null;
        }

        $cityFeature = CityFeature::where('code', $cityCode)->first();
        if (!$cityFeature) {
            return null;
        }

        return ChildBride::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id' => $period->id
            ],
            [
                'number_of_men_under_19' => $row[4] ?? 0,
                'number_of_women_under_19' => $row[5] ?? 0,
                'total' => $row[6] ?? 0,
            ]
        );
    }
}
