<?php

namespace App\Models;

use App\Models\Period;
use App\Models\CityFeature;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Dropout extends Model
{
    use HasFactory;
    protected $table = 'dropouts';
    protected $fillable = [
        'id_city_features',
        'id_periods',
        'level',
        'number_of_men',
        'number_of_women',
    ];

    public function CityFeature()
    {
        return $this->belongsTo(CityFeature::class, 'id_city_features');
    }

    public function Period()
    {
        return $this->belongsTo(Period::class, 'id_periods');
    }
}
