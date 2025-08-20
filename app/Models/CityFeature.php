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

class CityFeature extends Model
{
    use HasFactory;

    protected $table = 'city_features';
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

    public function ChildBride(){
        return $this->hasMany(ChildBride::class, 'id_city_features');
    }

    public function Dropout()
    {
        return $this->hasMany(Dropout::class, 'id_city_features');
    }

    public function LevelOfEducation()
    {
        return $this->hasMany(LevelOfEducation::class, 'id_city_features');
    }

    public function AgeClassification()
    {
        return $this->hasMany(AgeClassification::class, 'id_city_features');
    }

    public function ReasonsForDispensation()
    {
        return $this->hasMany(ReasonsForDispensation::class, 'id_city_features');
    }

    public function ChildrenForum()
    {
        return $this->hasMany(ChildrenForum::class, 'id_city_features');
    }
}
