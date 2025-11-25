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
        Schema::create('child_brides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('city_feature_id')->constrained()->onDelete('cascade');
            $table->foreignId('period_id')->constrained()->onDelete('cascade');
            $table->integer('number_of_men_under_19')->default(0);
            $table->integer('number_of_women_under_19')->default(0);
            $table->integer('total')->default(0);
            $table->timestamps();
            $table->unique(['city_feature_id', 'period_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('child_brides');
    }
};
