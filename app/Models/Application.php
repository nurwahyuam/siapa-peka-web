<?php

namespace App\Models;

use App\Models\Reason;
use App\Models\ChildBride;
use App\Models\EducationLevel;
use App\Models\AgeClassification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Application extends Model
{
    use HasFactory;

    protected $casts = [
        'sources' => 'array',
    ];

    protected $fillable = [
        'city_feature_id',
        'period_id',
        'submitted',
        'accepted',
        'sources',
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
