<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reason extends Model
{
    use HasFactory;

    protected $fillable = [
        'city_feature_id',
        'period_id',
        'pregnant',
        'promiscuity',
        'economy',
        'avoiding_adultery',
        'traditional_culture'
    ];

    public function cityFeature(): BelongsTo
    {
        return $this->belongsTo(CityFeature::class);
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }
}
