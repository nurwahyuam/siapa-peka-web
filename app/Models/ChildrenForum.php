<?php

namespace App\Models;

use App\Models\Period;
use App\Models\CityFeature;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChildrenForum extends Model
{
    use HasFactory;
    protected $table = 'children_forum';
    protected $fillable = [
        'id_city_features',
        'id_periods',
        'question',
        'answer',
        'number_of_respondents',
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
