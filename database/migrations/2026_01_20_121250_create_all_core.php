<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('m_category_id')->constrained('m_categories');
            $table->foreignId('m_supplier_id')->constrained('m_suppliers');
            $table->date('target_selling_date')->nullable()->comment('untuk mengetahui apakah barang sudah terjual atau tidak');
            $table->boolean('product_is_pre_order')->default(false);
            $table->integer('product_processing_days')->default(0);
            $table->string('product_name');
            $table->string('brand_name')->nullable();
            $table->text('description')->nullable();
            $table->string('product_type')->comment('Produk bahan baku, produk jadi')->default('Produk Bahan Baku');
            $table->foreignId('m_property_item_id')->constrained('m_property_items');
            $table->foreignId('m_packaging_size_id')->constrained('m_packaging_sizes');
            $table->foreignId('m_packaging_type_id')->constrained('m_packaging_types');
            $table->foreignId('m_repack_status_id')->constrained('m_repack_status');
            $table->bigInteger('packaging_size_input');
            $table->string('product_unit_sku')->unique();
            $table->decimal('product_unit_qty', 10, 2);
            $table->decimal('product_unit_price', 15, 2)->nullable();
            $table->date('expired_date')->nullable();

            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('core_product_image', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('core_products')->onDelete('cascade');
            $table->string('image_path');
            $table->string('image_name');
            $table->string('image_alt_text')->nullable();
            $table->integer('image_order')->nullable()->default(0); // Default value
            $table->boolean('image_is_primary')->default(false);

            // Saran tambahan:
            $table->string('image_size', 20)->nullable(); // e.g., 'thumbnail', 'medium', 'large'
            $table->unsignedInteger('file_size')->nullable(); // dalam bytes
            $table->string('mime_type', 50)->nullable(); // e.g., 'image/jpeg'

            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteSetNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteSetNull();
            $table->timestamps();
            $table->softDeletes();

            // Indexes untuk performance
            $table->index(['product_id', 'image_order']);
            $table->index(['product_id', 'image_is_primary']);
        });

        // Stock management per product per warehouse
        Schema::create('core_stoks', function (Blueprint $table) {
            $table->id()->comment('Primary key auto increment');

            // Foreign key relationships
            $table->foreignId('product_id')->constrained('core_products')->onDelete('cascade')->comment('FK ke table core_products, cascade delete');

            // Stock management columns
            $table->integer('in_stock')->default(0)->comment('Jumlah stok tersedia (integer, default 0)');
            $table->bigInteger('packaging_size_input');
            $table->boolean('track_stock')->default(true)->comment('Flag untuk tracking stok (boolean, default true)');
            $table->boolean('track_alert')->default(false)->comment('Flag untuk tracking alert (boolean, default false)');
            $table->boolean('stock_alert')->default(false)->comment('Flag untuk alert stok rendah (boolean, default false)');

            // Cost management columns
            $table->boolean('track_cost')->default(false)->comment('Flag untuk tracking cost (boolean, default false)');
            $table->decimal('cost_amount', 15, 2)->nullable()->comment('Harga cost per unit (decimal 15,2), nullable');

            // User tracking
            $table->foreignId('created_by')->constrained('users')->comment('FK ke table users (user yang membuat record)');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull()->comment('FK ke table users (user terakhir update), nullable');
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull()->comment('FK ke table users (user yang menghapus), nullable');

            // Laravel timestamps and soft deletes
            $table->timestamps();
            $table->softDeletes();

            // Unique constraint: one stock record per product
            $table->unique(['product_id'], 'core_stoks_product_unique');
        });

        Schema::create('core_notifikasi_expired', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('core_products')->onDelete('cascade');
            $table->boolean('expired_notification_sent')->default(false);
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
        });

        Schema::create('core_stock_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('core_products')->onDelete('cascade');
            $table->foreignId('transaction_type_id')->constrained('m_transaction_types')->comment('IN, OUT')->onDelete('cascade');
            $table->decimal('quantity', 10, 2);
            $table->timestamp('transaction_date');
            $table->string('notes', 255)->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
            $table->index('product_id');
            $table->index('transaction_date');
        });

        Schema::create('core_incoming_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('core_products')->cascadeOnDelete();
            $table->integer('stock');
            $table->decimal('packaging_size_input', 15, 2)->nullable();
            $table->bigInteger('price')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('core_outgoing_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('core_products')->cascadeOnDelete();
            $table->foreignId('out_type_id')->constrained('m_out_types')->cascadeOnDelete();
            $table->integer('stock');
            $table->decimal('packaging_size_input', 15, 2)->nullable();
            $table->bigInteger('price')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('core_stock_opname', function (Blueprint $table) {
            $table->id();
            $table->integer('total_request');
            $table->date('date_request');
            $table->foreignId('created_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });

         Schema::create('core_stock_opname_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId(column: 'stock_opname_id')->constrained('core_stock_opname')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('core_products')->cascadeOnDelete();
            $table->foreignId(column: 'stock_id')->constrained('core_stoks')->cascadeOnDelete();
            $table->enum('status', ['APPROVED', 'REJECTED', 'PENDING'])->default('PENDING');
            $table->integer('real_quantity');
            $table->integer('expired_quantity');
            $table->text('description')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->unique(['stock_opname_id', 'product_id']);
        });

        Schema::create('core_recipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('core_products')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });
        
        Schema::create('core_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained('core_recipes')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('core_products')->onDelete('cascade');
            $table->decimal('quantity', 10, 2);
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['recipe_id', 'product_id'], 'core_ingredients_unique_index');
        });

    }



    public function down(): void
    {
        Schema::dropIfExists('core_ingredients');
        Schema::dropIfExists('core_recipes');
        Schema::dropIfExists('core_stock_opname_products');
        Schema::dropIfExists('core_stock_opname');
        Schema::dropIfExists('core_outgoing_products');
        Schema::dropIfExists('core_incoming_products');
        Schema::dropIfExists('core_stock_transactions');
        Schema::dropIfExists('core_notifikasi_expired');
        Schema::dropIfExists('core_stoks');
        Schema::dropIfExists('core_product_image');
        Schema::dropIfExists('core_products');
    }
};
