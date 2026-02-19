<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoreStockTransaction extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'core_stock_transactions';

    protected $guarded = [];

    protected $casts = [
        'transaction_date' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(CoreProduct::class, 'product_id');
    }

    public function transactionType()
    {
        return $this->belongsTo(MTransactionType::class, 'transaction_type_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
