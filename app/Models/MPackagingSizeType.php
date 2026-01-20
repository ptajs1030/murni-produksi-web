<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MPackagingSizeType extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'm_packaging_size_types';

    protected $guarded = [];

    public function packagingSizes()
    {
        return $this->hasMany(MPackagingSize::class, 'packaging_size_type_id');
    }
}
