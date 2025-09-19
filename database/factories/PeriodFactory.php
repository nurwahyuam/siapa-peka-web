<?php

namespace Database\Factories;

use App\Models\Period;
use Illuminate\Database\Eloquent\Factories\Factory;

class PeriodFactory extends Factory
{
    protected $model = Period::class;

    public function definition(): array
    {
        return [
            'year' => $this->faker->year, // misal 2025, bisa random juga
            'name' => 'Triwulan I',       // isi sesuai struktur tabel period
        ];
    }
}
