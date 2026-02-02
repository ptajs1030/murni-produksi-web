<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogProduksi extends Model
{

    protected $table = 'log_produksi';

    // Enable auto-incrementing for 'id' primary key
    public $incrementing = true;

    // Set the primary key to 'id'
    protected $primaryKey = 'id';

    protected $guarded = [];

    protected $casts = [
        'quantity' => 'integer',
        'description' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(CoreProduct::class, 'product_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
