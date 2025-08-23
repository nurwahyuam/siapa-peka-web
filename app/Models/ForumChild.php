<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ForumChild extends Model
{
    protected $fillable = [
        'question',
        'answer',
        'response_count',
    ];
}
