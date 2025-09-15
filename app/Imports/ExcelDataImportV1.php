<?php

namespace App\Imports;

use App\Models\Period;
use App\Models\Reason;
use App\Models\Application;
use App\Models\CityFeature;
use App\Models\EducationLevel;
use App\Models\AgeClassification;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Validators\Failure;

class ExcelDataImportV1 implements ToModel, WithStartRow, WithValidation
{
    use SkipsErrors, SkipsFailures;

    private $rowIndex = 1;

    public function startRow(): int
    {
        // Mulai dari baris ke-2 (skip header)
        return 2;
    }

    public function model(array $row)
    {
        $this->rowIndex++;

        // 1. Cari / buat periode
        $year = $row[16] ?? null;
        $yearValue = is_numeric($year) ? (int) $year : (int) preg_replace('/[^0-9]/', '', $year);
        if ($yearValue == 0) return null;

        $period = Period::firstOrCreate(
            ['year' => $yearValue],
            ['name' => "Setahun"]
        );

        // 2. Cari / validasi city feature
        $cityCode = $row[15] ?? null;
        if (!$cityCode) return null;

        $cityFeature = CityFeature::where('code', $cityCode)->first();
        if (!$cityFeature) return null;

        // 3. Application
        Application::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id'       => $period->id,
            ],
            [
                'submitted' => (int) $row[2],
                'accepted'  => (int) $row[3],
                'sources'   => [
                    ['name' => 'Kementerian Agama'],
                ],
            ]
        );

        // 4. AgeClassification
        AgeClassification::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id'       => $period->id,
            ],
            [
                'less_than_15'   => (int) $row[4],
                'between_15_19'  => (int) $row[5],
            ]
        );

        // 5. EducationLevel
        EducationLevel::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id'       => $period->id,
            ],
            [
                'no_school' => (int) $row[6],
                'sd'        => (int) $row[7],
                'smp'       => (int) $row[8],
                'sma'       => (int) $row[9],
            ]
        );

        // 6. Reason
        Reason::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id'       => $period->id,
            ],
            [
                'pregnant'            => (int) $row[10],
                'promiscuity'         => (int) $row[11],
                'economy'             => (int) $row[12],
                'traditional_culture' => (int) $row[13],
                'avoiding_adultery'   => (int) $row[14],
            ]
        );

        return null;
    }

    /**
     * Aturan validasi tiap kolom
     */
    public function rules(): array
    {
        return [
            '2'  => 'nullable|numeric', // diterima
            '3'  => 'nullable|numeric', // dikabulkan
            '4'  => 'nullable|numeric', // <15
            '5'  => 'nullable|numeric', // 15-19
            '6'  => 'nullable|numeric', // tidak sekolah
            '7'  => 'nullable|numeric', // SD
            '8'  => 'nullable|numeric', // SMP
            '9'  => 'nullable|numeric', // SMA
            '10' => 'nullable|numeric', // Hamil
            '11' => 'nullable|numeric', // Pergaulan bebas
            '12' => 'nullable|numeric', // Ekonomi
            '13' => 'nullable|numeric', // Budaya tradisional
            '14' => 'nullable|numeric', // Menghindari zina
            '15' => 'required',         // Kode kota wajib ada
            '16' => 'required|numeric', // Tahun wajib angka
        ];
    }

    public function customValidationMessages()
    {
        return [
            'numeric'  => ':attribute harus berupa angka.',
            'required' => ':attribute wajib diisi.',
        ];
    }

    public function customValidationAttributes()
    {
        return [
            '2'  => 'Kolom Diterima',
            '3'  => 'Kolom Dikabulkan',
            '4'  => 'Kolom Usia < 15',
            '5'  => 'Kolom Usia 15–19',
            '6'  => 'Kolom Tidak sekolah',
            '7'  => 'Kolom SD',
            '8'  => 'Kolom SMP',
            '9'  => 'Kolom SMA',
            '10' => 'Kolom Hamil',
            '11' => 'Kolom Pergaulan bebas',
            '12' => 'Kolom Ekonomi',
            '13' => 'Kolom Budaya tradisional',
            '14' => 'Kolom Menghindari zina',
            '15' => 'Kolom Kode kota',
            '16' => 'Kolom Tahun',
        ];
    }

    /**
     * Tangani error validasi supaya keluar format "Baris X → Kolom Y ..."
     */
    public function onFailure(Failure ...$failures)
    {
        session()->flash('import_errors', collect($failures)->map(function ($f) {
            $attr = $f->attribute();
            $msg  = $f->errors()[0];
            return "Baris {$f->row()} → {$attr} {$msg}";
        })->toArray());
    }
}
