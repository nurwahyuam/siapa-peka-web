<?php

namespace App\Models;

use App\Models\Period;
use App\Models\CityFeature;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LevelOfEducation extends Model
{
    use HasFactory;

    protected $table = 'level_of_education';
    protected $fillable = [
        'id_city_features',
        'id_periods',
        'no_school',
        'sd',
        'smp',
        'sma',
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
