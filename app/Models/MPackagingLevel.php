<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MPackagingLevel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_packaging_levels';

    protected $guarded = [];

    public function packagingSizes()
    {
        return $this->hasMany(MPackagingSize::class, 'packaging_level_id');
    }

    public function packagingTypes()
    {
        return $this->hasMany(MPackagingType::class, 'packaging_level_id');
    }
}
