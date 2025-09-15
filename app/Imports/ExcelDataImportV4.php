<?php

namespace App\Imports;

use App\Models\Period;
use App\Models\Reason;
use App\Models\Application;
use App\Models\CityFeature;
use App\Models\EducationLevel;
use App\Models\AgeClassification;
use App\Models\ChildBride;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\HeadingRowImport;
use Illuminate\Support\Collection;

class ExcelDataImportV4 implements ToCollection, WithStartRow
{
    public $errors = [];     // Simpan error list
    public $validRows = [];  // Simpan baris valid

    public function startRow(): int
    {
        return 2; // data mulai dari baris ke-2
    }

    /**
     * Validasi header di baris pertama
     */
    public function validateHeaders($file)
    {
        $expectedHeaders = [
            "Kode Kota/Kabupaten",
            "Nama Kota/Kabupaten",
            "Tahun",
            "Periode",
            "Diajukan",
            "Dikabulkan",
            "Sumber",
            "Tidak Sekolah",
            "SD",
            "SMP",
            "SMA",
            "Usia < 15",
            "Usia 15-19",
            "Pria < 19",
            "Wanita < 19",
            "Total Pengantin Anak",
            "Hamil",
            "Pergaulan Bebas",
            "Ekonomi",
            "Budaya Tradisional",
            "Menghindari Zina",
        ];

        // ambil header dari file excel
        $headings = (new HeadingRowImport)->toArray($file)[0][0];

        foreach ($expectedHeaders as $i => $colName) {
            $found = $headings[$i] ?? null;
            if ($found !== $colName) {
                $this->errors[] = "Header tidak sesuai di kolom " . ($i + 1) .
                    " → seharusnya '{$colName}', ditemukan '" . ($found ?? '-') . "'";
            }
        }

        return empty($this->errors);
    }

    /**
     * Validasi isi data excel
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2; // +2 karena mulai dari baris kedua di excel

            $kodeKota = trim($row[0] ?? '');
            $namaKota = trim($row[1] ?? '');
            $tahun    = trim($row[2] ?? '');
            $periode  = trim($row[3] ?? '');

            // Validasi kolom dasar
            if ($kodeKota === '' || $namaKota === '' || $tahun === '' || $periode === '') {
                $this->errors[] = "Baris {$rowNumber}: Kode/Nama/Tahun/Periode wajib diisi.";
                continue;
            }
            if (!is_numeric($tahun)) {
                $this->errors[] = "Baris {$rowNumber}: Tahun harus berupa angka.";
                continue;
            }

            $cityFeature = CityFeature::where('code', $kodeKota)->first();
            if (!$cityFeature) {
                $this->errors[] = "Baris {$rowNumber}: Kode kota '{$kodeKota}' tidak ditemukan di database.";
                continue;
            }

            // Validasi kolom angka lainnya
            $numericFields = [
                4 => 'Submitted',
                5 => 'Accepted',
                7 => 'No School',
                8 => 'SD',
                9 => 'SMP',
                10 => 'SMA',
                11 => 'Usia < 15',
                12 => 'Usia 15-19',
                13 => 'Pria < 19',
                14 => 'Wanita < 19',
                15 => 'Total',
                16 => 'Hamil',
                17 => 'Pergaulan Bebas',
                18 => 'Ekonomi',
                19 => 'Budaya Tradisional',
                20 => 'Menghindari Zina',
            ];

            foreach ($numericFields as $colIndex => $label) {
                $value = trim($row[$colIndex] ?? '');
                if ($value === '') {
                    $this->errors[] = "Baris {$rowNumber}: Kolom {$label} wajib diisi.";
                    continue 2;
                }
                if (!is_numeric($value)) {
                    $this->errors[] = "Baris {$rowNumber}: Kolom {$label} harus berupa angka.";
                    continue 2;
                }
            }

            // Validasi aturan Setahun vs Triwulan
            $existingPeriods = Period::where('year', $tahun)->pluck('name')->toArray();

            if ($periode === "Setahun") {
                if (collect($existingPeriods)->contains(fn($p) => str_starts_with($p, "Triwulan"))) {
                    $this->errors[] = "Baris {$rowNumber}: Tidak boleh tambah 'Setahun' karena sudah ada data Triwulan di tahun {$tahun}.";
                    continue;
                }
            }

            if (str_starts_with($periode, "Triwulan")) {
                if (in_array("Setahun", $existingPeriods)) {
                    $this->errors[] = "Baris {$rowNumber}: Tidak boleh tambah {$periode} karena sudah ada 'Setahun' di tahun {$tahun}.";
                    continue;
                }
            }

            // Lolos validasi → simpan
            $this->validRows[] = $row;
        }
    }

    /**
     * Simpan baris valid ke database
     */
    public function saveRowToDatabase($row)
    {
        $tahun   = (int) $row[2];
        $periode = $row[3];

        $period = Period::firstOrCreate(
            ['year' => $tahun, 'name' => $periode]
        );

        $cityFeature = CityFeature::where('code', $row[0])->first();

        // Simpan Application
        Application::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id'       => $period->id,
            ],
            [
                'submitted' => (int) $row[4],
                'accepted'  => (int) $row[5],
                'sources' => $row[6]
                    ? collect(explode(',', $row[6]))
                    ->map(fn($item) => ['name' => trim($item)])
                    ->values()
                    ->toArray()
                    : [],
            ]
        );

        // Simpan EducationLevel
        EducationLevel::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id'       => $period->id,
            ],
            [
                'no_school' => (int) $row[7],
                'sd'        => (int) $row[8],
                'smp'       => (int) $row[9],
                'sma'       => (int) $row[10],
            ]
        );

        // Simpan AgeClassification
        AgeClassification::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id'       => $period->id,
            ],
            [
                'less_than_15'   => (int) $row[11],
                'between_15_19'  => (int) $row[12],
            ]
        );

        // Simpan ChildBride
        ChildBride::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id'       => $period->id,
            ],
            [
                'number_of_men_under_19'    => (int) $row[13],
                'number_of_women_under_19'  => (int) $row[14],
                'total'                     => (int) $row[15],
            ]
        );

        // Simpan Reason
        Reason::updateOrCreate(
            [
                'city_feature_id' => $cityFeature->id,
                'period_id'       => $period->id,
            ],
            [
                'pregnant'            => (int) $row[16],
                'promiscuity'         => (int) $row[17],
                'economy'             => (int) $row[18],
                'traditional_culture' => (int) $row[19],
                'avoiding_adultery'   => (int) $row[20],
            ]
        );
    }
}
