<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CityFeature extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'kind',
        'province',
        'country',
        'geometry',
    ];

    protected $casts = [
        'geometry' => 'array',
    ];

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function educationLevels(): HasMany
    {
        return $this->hasMany(EducationLevel::class);
    }

    public function ageClassifications(): HasMany
    {
        return $this->hasMany(AgeClassification::class);
    }

    public function reasons(): HasMany
    {
        return $this->hasMany(Reason::class);
    }
    public function childBrides(): HasMany
    {
        return $this->hasMany(ChildBride::class);
    }
}
