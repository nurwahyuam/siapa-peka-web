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
        Schema::create('age_classifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_city_features')->constrained('city_features')->onDelete('cascade');
            $table->foreignId('id_periods')->constrained('periods')->onDelete('cascade');
            $table->integer('less_than_15')->default(0);
            $table->integer('between_15_19')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('age_classifications');
    }
};
