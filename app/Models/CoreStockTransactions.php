<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoreStockTransactions extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'core_stock_transactions';

    protected $fillable = [
        'product_id',
        'transaction_type_id',
        'quantity',
        'transaction_date',
        'notes',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /**
     * Get the product that owns the transaction.
     */
    public function product()
    {
        return $this->belongsTo(CoreProduct::class, 'product_id');
    }

    /**
     * Get the transaction type that owns the transaction.
     */
    public function transactionType()
    {
        return $this->belongsTo(MTransactionType::class, 'transaction_type_id');
    }

    /**
     * Get the user who created the transaction.
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
