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
        Schema::create('level_of_education', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_city_features')->constrained('city_features')->onDelete('cascade');
            $table->foreignId('id_periods')->constrained('periods')->onDelete('cascade');
            $table->integer('no_school')->default(0);
            $table->integer('sd')->default(0);
            $table->integer('smp')->default(0);
            $table->integer('sma')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('level_of_education');
    }
};
