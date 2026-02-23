<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Production extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'productions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'incoming_product_id',
        'incoming_quantity',
        'outgoing_product_id',
        'outgoing_quantity',
        'notes',
        'user_id',
    ];

    /**
     * Get the user who performed the production.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the resulting product.
     */
    public function incomingProduct(): BelongsTo
    {
        return $this->belongsTo(CoreProduct::class, 'incoming_product_id');
    }

    /**
     * Get the ingredient product used.
     */
    public function outgoingProduct(): BelongsTo
    {
        return $this->belongsTo(CoreProduct::class, 'outgoing_product_id');
    }
}
