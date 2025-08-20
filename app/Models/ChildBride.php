<?php

namespace App\Models;

use App\Models\Period;
use App\Models\CityFeature;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChildBride extends Model
{
    use HasFactory;

    protected $table = 'child_brides';
    protected $fillable = [
        'id_city_features',
        'id_periods',
        'number_of_men_under_19',
        'number_of_women_under_19',
        'total',
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
