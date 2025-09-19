<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CityFeatureFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->city;
        return [
            'code'     => strtoupper(Str::random(6)),
            'name'     => $name,
            'slug'     => Str::slug($name),
            'kind'     => 'Kota',
            'province' => 'Jawa Timur',
            'country'  => 'Indonesia',
            'geometry' => [
                "type" => "Point",
                "coordinates" => [$this->faker->longitude, $this->faker->latitude],
            ],
        ];
    }
}
