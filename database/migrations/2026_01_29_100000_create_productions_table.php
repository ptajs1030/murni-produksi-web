<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tabel untuk mencatat transaksi produksi
        Schema::create('productions', function (Blueprint $table) {
            $table->id();

            // Produk hasil produksi (misal: Kopi Bubuk 250g)
            $table->foreignId('incoming_product_id')->constrained('core_products');
            $table->decimal('incoming_quantity', 15, 4);

            // Bahan baku yang digunakan (misal: Biji Kopi Robusta)
            $table->foreignId('outgoing_product_id')->constrained('core_products');
            $table->decimal('outgoing_quantity', 15, 4);
            
            $table->text('notes')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productions');
    }
};
