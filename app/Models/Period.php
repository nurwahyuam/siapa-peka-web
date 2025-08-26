<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Period extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'name'
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
    public function forumChildren(): HasMany
    {
        return $this->hasMany(ForumChild::class);
    }
}
