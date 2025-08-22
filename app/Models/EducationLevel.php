<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EducationLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'city_feature_id',
        'period_id',
        'no_school',
        'sd',
        'smp',
        'sma'
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
