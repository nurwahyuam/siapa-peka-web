<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CityFeature extends Model
{
    protected $fillable = [
        'code',
        'name',
        'kind',
        'province',
        'country',
        'geometry',
        'kategori'
    ];

    protected $casts = [
        'geometry' => 'array',
    ];
}
