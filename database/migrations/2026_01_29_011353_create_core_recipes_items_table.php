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
        Schema::create('core_recipes_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('recipe_id');
            $table->unsignedBigInteger('product_id');
            $table->decimal('qty_per_unit', 15, 4);
            $table->string('unit', 20);
            $table->timestamps();
            $table->foreign('recipe_id')
                ->references('id')
                ->on('core_recipes')
                ->onDelete('cascade');
            $table->foreign('product_id')
                ->references('id')
                ->on('core_products')
                ->onDelete('restrict');
            $table->unique(['recipe_id', 'product_id']);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('core_recipes_items');
    }
};
