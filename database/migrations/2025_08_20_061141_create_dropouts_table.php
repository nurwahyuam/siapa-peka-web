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
        Schema::create('dropouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_city_features')->constrained('city_features')->onDelete('cascade');
            $table->foreignId('id_periods')->constrained('periods')->onDelete('cascade');
            $table->enum('level', ['SMA', 'SMK'])->default('SMA');
            $table->integer('number_of_men')->default(0);
            $table->integer('number_of_women')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dropouts');
    }
};
