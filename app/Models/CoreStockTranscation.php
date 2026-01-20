<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoreStockTransactions extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'core_stock_transactions';

    protected $guarded = [];
}
