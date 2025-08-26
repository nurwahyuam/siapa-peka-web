<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ForumChild extends Model
{
    protected $fillable = [
        'period_id',
        'question',
        'answer',
    ];

    protected $casts = [
        'answer' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }
}
