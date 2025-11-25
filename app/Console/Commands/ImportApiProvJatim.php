<?php

namespace App\Console\Commands;

use App\Models\Application;
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
        $this->info("🗃️  Fetching daftar periode dari metadata...");

        $baseUrl = "https://opendata.jatimprov.go.id/api/cleaned-bigdata/dinas_pemberdayaan_perempuan_perlindungan_anak_dan_kependuduk/jumlah_anak_yang_menikah_di_bawah_19_tahun_berdasarkan_jk";

        // 1. Fetch metadata
        $metaResponse = Http::timeout(60)
            ->withoutVerifying()
            ->withHeaders([
                'accept' => 'application/json',
            ])
            ->get($baseUrl);

        if (! $metaResponse->successful()) {
            $this->error("❌ Gagal fetch metadata API");
            return;
        }

        $metaJson = $metaResponse->json();
        $filters  = $metaJson['metadata_filter'] ?? [];

        // Cari filter periode_update
        $periodeFilter = collect($filters)->firstWhere('key', 'periode_update');
        $periodes = $periodeFilter['value'] ?? [];

        if (empty($periodes)) {
            $this->warn("⚠️ Tidak ada periode di metadata_filter");
            return;
        }

        $this->line("📅 Ditemukan periode: " . implode(', ', $periodes));

        $map = ['Q1' => 'Triwulan I', 'Q2' => 'Triwulan II', 'Q3' => 'Triwulan III', 'Q4' => 'Triwulan IV'];

        // Loop semua periode
        foreach ($periodes as $periode) {
            $this->line("➡️ Import periode_update={$periode}");

            $response = Http::timeout(60)
                ->withoutVerifying()
                ->withHeaders([
                    'accept' => 'application/json',
                ])
                ->get($baseUrl, [
                    'where' => json_encode([
                        'periode_update' => $periode,
                    ]),
                ]);

            if (! $response->successful()) {
                $this->error("❌ Gagal fetch data untuk {$periode}");
                continue;
            }

            $json  = $response->json();
            $data  = $json['data'] ?? [];

            if (empty($data)) {
                $this->warn("⚠️ Data kosong untuk {$periode}");
                continue;
            }

            $this->info("✅ Berhasil fetch periode_update={$periode}, jumlah data: " . count($data));

            [$year, $q] = explode('-', $periode); // ex: 2025-Q1
            $periodeName = $map[$q] ?? 'Setahun';

            // Simpan periode di DB
            $period = Period::firstOrCreate(
                [
                    'name' => $periodeName,
                    'year' => $year,
                ]
            );

            // ---- Grouping per city + period
            $grouped = [];

            foreach ($data as $item) {
                // Normalisasi nama kota
                $normalizedCity = $this->normalizeCityName($item['nama_kabupaten_kota']);
                $city = CityFeature::whereRaw('LOWER(name) = ?', [strtolower($normalizedCity)])->first();
                if (! $city) {
                    $this->warn("⚠️ Kota tidak ditemukan: {$item['nama_kabupaten_kota']} → hasil normalize: {$normalizedCity}");
                    continue;
                }

                $key = $city->id . '-' . $period->id;

                if (!isset($grouped[$key])) {
                    $grouped[$key] = [
                        'city_feature_id' => $city->id,
                        'period_id'       => $period->id,
                        'number_of_men_under_19'   => 0,
                        'number_of_women_under_19' => 0,
                        'total'                    => 0,
                        'sources'                  => $item['sumber'] ?? null,
                    ];
                }

                switch (strtoupper(trim($item['kategori']))) {
                    case "JUMLAH PENGANTIN LAKI LAKI DI BAWAH 19 TAHUN":
                        $grouped[$key]['number_of_men_under_19'] = $item['jumlah'] ?? 0;
                        break;

                    case "JUMLAH PENGANTIN PEREMPUAN DI BAWAH 19 TAHUN":
                        $grouped[$key]['number_of_women_under_19'] = $item['jumlah'] ?? 0;
                        break;

                    case "TOTAL JUMLAH PENGANTIN DI BAWAH 19 TAHUN":
                        $grouped[$key]['total'] = $item['jumlah'] ?? 0;
                        break;
                }
            }

            $this->output->progressStart(count($grouped));

            // Setelah looping, simpan ke DB
            foreach ($grouped as $values) {
                ChildBride::updateOrCreate(
                    [
                        'city_feature_id' => $values['city_feature_id'],
                        'period_id'       => $values['period_id'],
                    ],
                    [
                        'number_of_men_under_19'   => $values['number_of_men_under_19'],
                        'number_of_women_under_19' => $values['number_of_women_under_19'],
                        'total'                    => $values['total'],
                    ]
                );

                // Simpan sources
                $sources = $values['sources'] ?? null;
                $sources = $sources
                    ? collect(explode(',', $sources))->map(fn($s) => ['name' => trim($s)])->toArray()
                    : [['name' => 'Provinsi Jawa Timur']];

                Application::updateOrCreate(
                    [
                        'city_feature_id' => $values['city_feature_id'],
                        'period_id'       => $values['period_id'],
                    ],
                    [
                        'sources' => $sources,
                    ]
                );

                $this->output->progressAdvance();
            }

            $this->output->progressFinish();
        }

        $this->info("✅ Import selesai pada " . now());
    }

    private function normalizeCityName($name)
    {
        $name = strtoupper(trim($name));

        if (str_starts_with($name, 'KOTA ')) {
            $clean = ucwords(strtolower(str_replace('KOTA ', '', $name)));
            return "Kota " . $clean;
        }

        if (str_starts_with($name, 'KABUPATEN ')) {
            $clean = ucwords(strtolower(str_replace('KABUPATEN ', '', $name)));
            return "Kabupaten " . $clean;
        }

        $clean = ucwords(strtolower($name));
        return "Kabupaten " . $clean;
    }
}
