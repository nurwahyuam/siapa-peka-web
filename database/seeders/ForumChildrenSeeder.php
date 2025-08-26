<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Period;
use App\Models\ForumChild;
use Illuminate\Support\Facades\DB;

class ForumChildrenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Hapus data existing jika ada
        DB::table('forum_children')->truncate();

        // Ambil semua periode yang ada
        $periods = Period::all();

        // Pertanyaan-pertanyaan
        $questions = [
            "Pernah menemui teman atau orang di sekitar yang masih usia anak tapi sudah menikah?",
            "Apakah ada temanmu atau anak-anak di lingkunganmu yang tidak sekolah?"
        ];

        foreach ($periods as $period) {
            foreach ($questions as $question) {
                // Generate data acak untuk setiap pertanyaan dalam setiap periode
                $yesCount = rand(5, 20); // Jumlah jawaban "Ya"
                $noCount = rand(3, 15);  // Jumlah jawaban "Tidak"
                $totalEntries = $yesCount + $noCount;

                // Buat entri untuk jawaban "Ya"
                for ($i = 0; $i < $yesCount; $i++) {
                    ForumChild::create([
                        'period_id' => $period->id,
                        'question' => $question,
                        'answer' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                // Buat entri untuk jawaban "Tidak"
                for ($i = 0; $i < $noCount; $i++) {
                    ForumChild::create([
                        'period_id' => $period->id,
                        'question' => $question,
                        'answer' => false,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        $this->command->info('Forum Children data seeded successfully!');
    }
}
