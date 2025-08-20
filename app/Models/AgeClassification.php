<?php

namespace App\Models;

use App\Models\Period;
use App\Models\CityFeature;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AgeClassification extends Model
{
    use HasFactory;

    protected $table = 'age_classifications';
    protected $fillable = [
        'id_city_features',
        'id_periods',
        'less_than_15',
        'between_15_and_19',
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
