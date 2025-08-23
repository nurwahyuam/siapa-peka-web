<?php

namespace App\Console\Commands;

use App\Models\Period;
use App\Models\ChildBride;
use App\Models\CityFeature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ImportApiProvJatim extends Command
{
    protected $signature = 'import:api-prov-jatim';
    protected $description = 'Import data jumlah pernikahan anak di bawah 19 tahun dari API Jatim';

    public function handle()
    {
        $this->info("Fetching data...");
        $response = Http::timeout(30)->get(
            "https://api.satudatadev.jatimprov.go.id/api/bigdata/dinas_pemberdayaan_perempuan_perlindungan_anak_dan_kependuduk/jumlah_anak_yang_menikah_di_bawah_19_tahun_berdasarkan_jk_di_ja"
        );

        if (! $response->successful()) {
            $this->error("❌ Gagal fetch data API");
            return;
        }

        $json = $response->json();
        $data = $json['data'] ?? [];

        foreach ($data as $item) {
            // Normalisasi nama kota
            $normalizedCity = $this->normalizeCityName($item['kabupaten_kota']);

            // Cari city_feature berdasarkan nama hasil normalisasi
            $city = CityFeature::whereRaw('LOWER(name) = ?', [strtolower($normalizedCity)])->first();

            if (! $city) {
                $this->warn("⚠️ Kota tidak ditemukan: {$item['kabupaten_kota']} → hasil normalize: {$normalizedCity}");
                continue;
            }

            // Mapping periode: romawi → enum di DB
            $periodeRaw = strtoupper($item['periode_update']); // contoh: "TRIWULAN I 2025"
            $map = [
                'I'   => 'Triwulan I',
                'II'  => 'Triwulan II',
                'III' => 'Triwulan III',
                'IV'  => 'Triwulan IV',
            ];

            preg_match('/TRIWULAN\s+([IVX]+)/', $periodeRaw, $matches);
            $periodeName = $map[$matches[1] ?? ''] ?? 'Setahun';

            // Ambil tahun dari string "TRIWULAN I 2025"
            preg_match('/(\d{4})$/', $periodeRaw, $yearMatch);
            $year = $yearMatch[1] ?? null;

            if (!$year) {
                $this->warn("⚠️ Tahun tidak ditemukan dari periode_update: {$periodeRaw}");
                continue;
            }

            $period = Period::firstOrCreate(
                ['name' => $periodeName, 'year' => $year]
            );

            // Insert/update child_brides
            ChildBride::updateOrCreate(
                [
                    'city_feature_id' => $city->id,
                    'period_id'       => $period->id,
                ],
                [
                    'number_of_men_under_19'   => $item['jumlah_pengantin_laki_laki_di_bawah_19_tahun'],
                    'number_of_women_under_19' => $item['jumlah_pengantin_perempuan_di_bawah_19_tahun'],
                    'total'                    => $item['total_jumlah_pengantin_di_bawah_19_tahun'],
                ]
            );
        }

        $this->info("✅ Import selesai!");
    }

    private function normalizeCityName($name)
    {
        $name = strtoupper(trim($name));

        // case: ada prefix "KOTA"
        if (str_starts_with($name, 'KOTA ')) {
            $clean = ucwords(strtolower(str_replace('KOTA ', '', $name)));
            return "Kota " . $clean;
        }

        // case: ada prefix "KABUPATEN"
        if (str_starts_with($name, 'KABUPATEN ')) {
            $clean = ucwords(strtolower(str_replace('KABUPATEN ', '', $name)));
            return "Kabupaten " . $clean;
        }

        // case: tidak ada prefix → default ke Kabupaten
        $clean = ucwords(strtolower($name));
        return "Kabupaten " . $clean;
    }
}
