<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('role_name')->unique();
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('m_packaging_size_types', function (Blueprint $table) {
            $table->id(); 
            $table->string('type_code')->unique();
            $table->string('type_description', 100)->nullable();
            $table->string('base_unit', );
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('m_packaging_levels', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('level_code')->unique();
            $table->string('level_description', 100)->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('m_warehouse_levels', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('level_code')->unique();
            $table->string('level_description', 100)->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('m_categories', function (Blueprint $table) {
            $table->id();
            $table->string('category_code', 5)->unique();
            $table->string('category_name', 50);
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('m_suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('supplier_code', 5)->unique();
            $table->string('supplier_name', 50);
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('m_property_items', function (Blueprint $table) {
            $table->id();
            $table->string('property_code', 1)->unique();
            $table->string('property_name', 20);
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('m_packaging_sizes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('packaging_size_type_id')->constrained('m_packaging_size_types');
            $table->foreignId('packaging_level_id')->constrained('m_packaging_levels');
            $table->string('packaging_size_code', 10)->unique();
            $table->string('packaging_size_name');
            $table->bigInteger('unit_conversion_value');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('m_packaging_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('packaging_level_id')->constrained('m_packaging_levels');
            $table->string('packaging_type_code', 5)->unique();
            $table->string('packaging_type_name', 20);
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('m_repack_status', function (Blueprint $table) {
            $table->id();
            $table->string('repack_code', 2)->unique();
            $table->string('repack_name', 50);
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('m_warehouses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_level_id')->constrained('m_warehouse_levels'); // parent
            $table->string('warehouse_name');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('m_out_types', function (Blueprint $table) {
            $table->id();
            $table->string('out_type_name', 50)->comment("['SEALING', 'RETUR', 'PECAHAN']");
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('m_transaction_types', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_type_name', 50)->comment("['IN', 'OUT']");
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
            $table->timestamps();
            $table->softDeletes();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('m_warehouses');   
        Schema::dropIfExists('m_repack_status');
        Schema::dropIfExists('m_packaging_sizes');
        Schema::dropIfExists('m_packaging_types');
        Schema::dropIfExists('m_property_items');
        Schema::dropIfExists('m_suppliers');
        Schema::dropIfExists('m_categories');
        Schema::dropIfExists('m_out_types');
        Schema::dropIfExists('m_transaction_types');
        Schema::dropIfExists('m_warehouse_levels');
        Schema::dropIfExists('m_packaging_levels');
        Schema::dropIfExists('m_packaging_size_types');
    }
};
