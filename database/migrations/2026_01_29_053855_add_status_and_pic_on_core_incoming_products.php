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
        Schema::table('core_incoming_products', function (Blueprint $table) {
            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED'])->default('PENDING')->after('price');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDeleteNull();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDeleteNull();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("core_incoming_products", function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('created_by');
            $table->dropColumn('updated_by');
            $table->dropColumn('deleted_by');
        });
    }
};
