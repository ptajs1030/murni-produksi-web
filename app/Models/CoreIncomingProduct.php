<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoreIncomingProduct extends Model
{
    use HasFactory;

    protected $table = 'core_incoming_products';
    // Enable auto-incrementing for 'id' primary key
    public $incrementing = true;

    // Set the primary key to 'id'
    protected $primaryKey = 'id';

    protected $guarded = [];


    /**
     * Relasi ke Product
     */
    public function products()
    {
        return $this->belongsTo(CoreProduct::class, 'product_id');
    }

}
