<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MWarehouse extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $guarded = [];

    public function level()
    {
        return $this->belongsTo(MWarehouseLevel::class, 'warehouse_level_id');
    }

    public function users()
    {
        return $this->belongsToMany(\App\Models\User::class, 'user_warehouse', 'warehouse_id', 'user_id')
            ->withPivot('assigned_at', 'assigned_by')
            ->withTimestamps();
    }

    public function assignedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'assigned_by');
    }
}
