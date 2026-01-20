<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MSupplier extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $guarded = [];

    public function getCodeNameAttribute()
    {
        return $this->suppliers_code.'-'.$this->suppliers_name;
    }

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }
}
