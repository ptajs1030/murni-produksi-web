<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;

class CoreStockOpnameProduct extends Model
{
    protected $table = 'core_stock_opname_products';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'real_quantity' => 'integer',
            'expired_quantity' => 'integer',
            'approved_at' => 'datetime',
        ];
    }

    // Relationship dengan stock opname
    public function stockOpname()
    {
        return $this->belongsTo(CoreStockOpname::class, 'stock_opname_id');
    }

    // Relationship dengan product
    public function product()
    {
        return $this->belongsTo(CoreProduct::class, 'product_id');
    }

    // Relationship dengan stock
    public function stock()
    {
        return $this->belongsTo(CoreStock::class, 'stock_id');
    }


    // Relationship dengan user yang approve
    public function approvedByUser()
    {
        return $this->belongsTo(User::class, 'approved_by_user_id');
    }
}
