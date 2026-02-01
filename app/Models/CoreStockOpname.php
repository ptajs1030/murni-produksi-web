<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CoreStockOpname extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'core_stock_opname';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'date_request' => 'date:Y-m-d', // Format eksplisit
            'total_request' => 'integer',
            'is_submitted' => 'boolean',
        ];
    }

    // Relationship dengan warehouse
    public function warehouse()
    {
        return $this->belongsTo(MWarehouse::class, 'warehouse_id');
    }

    // Relationship dengan user yang membuat
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relationship dengan user yang mengupdate
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Relationship dengan user yang menghapus
    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    // Relationship dengan products melalui pivot table
    public function products()
    {
        return $this->belongsToMany(CoreProduct::class, 'core_stock_opname_products', 'stock_opname_id', 'product_id')
            ->withPivot(['stock_id', 'status_id', 'real_quantity', 'expired_quantity'])
            ->withTimestamps();
    }

    public function stock()
    {
        // ambil kumpulan CoreStock melalui pivot core_stock_opname_products
        return $this->belongsToMany(
            CoreStock::class,
            'core_stock_opname_products',
            'stock_opname_id', // FK di pivot yang menunjuk ke core_stock_opname
            'stock_id'         // FK di pivot yang menunjuk ke core_stocks
        )->withPivot(['product_id', 'status_id', 'real_quantity', 'expired_quantity'])
         ->withTimestamps();
    }


    // Relationship dengan detail products
    public function stockOpnameProducts()
    {
        return $this->hasMany(CoreStockOpnameProduct::class, 'stock_opname_id');
    }
}
