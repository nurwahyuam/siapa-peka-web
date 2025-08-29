<?php

namespace App\Console\Commands;

use App\Models\CityFeature;
use Illuminate\Support\Str;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ImportCityFeatures extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:city-features';



    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import city/regency geo data from external API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $allData = [];

        for ($page = 1; $page <= 8; $page++) {
            $this->info("Fetching page {$page}...");
            $response = Http::timeout(30)->get("https://whatsproject.my.id/geo/v1/city/prov", [
                'prov_id' => 35,
                'page' => $page,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                foreach ($data as $item) {
                    if (isset($item['cityFeature']['features'])) {
                        foreach ($item['cityFeature']['features'] as $feature) {
                            $properties = $feature['properties'];
                            $geometry   = $feature['geometry'];

                            CityFeature::updateOrCreate(
                                ['code' => $properties['Code']],
                                [
                                    'name'     => ((int)$properties['Code'] >= 3501 && (int)$properties['Code'] <= 3529)
                                        ? 'Kabupaten ' . ucwords(strtolower($properties['Name']))
                                        : 'Kota ' . ucwords(strtolower($properties['Name'])),
                                    'slug'     => Str::slug(
                                        ((int)$properties['Code'] >= 3501 && (int)$properties['Code'] <= 3529)
                                            ? 'Kabupaten ' . ucwords(strtolower($properties['Name']))
                                            : 'Kota ' . ucwords(strtolower($properties['Name']))
                                    ),
                                    'kind'     => ((int)$properties['Code'] >= 3501 && (int)$properties['Code'] <= 3529)
                                        ? 'Regency'
                                        : 'City',
                                    'province' => ucwords(strtolower($properties['Province'])),
                                    'country'  => ucwords(strtolower($properties['Country'] ?? 'Indonesia')),
                                    'geometry' => $geometry,
                                ]
                            );
                        }
                    }
                }
            } else {
                $this->error("Failed to fetch page {$page}");
            }
        }

        $this->info("✅ Import selesai!");
    }
}
