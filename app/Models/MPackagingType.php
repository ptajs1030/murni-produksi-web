<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MPackagingType extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $guarded = [];

    public function packagingLevel()
    {
        return $this->belongsTo(MPackagingLevel::class, 'packaging_level_id');
    }
}
