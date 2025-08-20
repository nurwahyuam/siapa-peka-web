<?php

namespace App\Models;

use App\Models\Period;
use App\Models\CityFeature;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApplicationForDispensation extends Model
{
    use HasFactory;

    protected $table = 'application_for_dispensation';
    protected $fillable = [
        'id_city_features',
        'id_periods',
        'submitted',
        'accepted',
    ];

    public function cityFeature()
    {
        return $this->belongsTo(CityFeature::class, 'id_city_features');
    }

    public function period()
    {
        return $this->belongsTo(Period::class, 'id_periods');
    }
}
