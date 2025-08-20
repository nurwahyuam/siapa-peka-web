<?php

namespace App\Models;

use App\Models\Dropout;
use App\Models\ChildBride;
use App\Models\ChildrenForum;
use App\Models\LevelOfEducation;
use App\Models\AgeClassification;
use App\Models\ReasonsForDispensation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Period extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'year'];
    public function ChildBride()
    {
        return $this->hasMany(ChildBride::class, 'id_periods');
    }

    public function Dropout()
    {
        return $this->hasMany(Dropout::class, 'id_periods');
    }

    public function LevelOfEducation()
    {
        return $this->hasMany(LevelOfEducation::class, 'id_periods');
    }

    public function AgeClassification()
    {
        return $this->hasMany(AgeClassification::class, 'id_periods');
    }

    public function ReasonsForDispensation()
    {
        return $this->hasMany(ReasonsForDispensation::class, 'id_periods');
    }

    public function ChildrenForum()
    {
        return $this->hasMany(ChildrenForum::class, 'id_periods');
    }
}
