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
        Schema::table('m_packaging_types', function (Blueprint $table) {
            $table->string('packaging_type_name')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('m_packaging_types', function (Blueprint $table) {
            $table->string('packaging_type_name', 20)->change();
        });
    }
};
