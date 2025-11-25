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
        Schema::create('reasons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('city_feature_id')->constrained()->onDelete('cascade');
            $table->foreignId('period_id')->constrained()->onDelete('cascade');
            $table->integer('pregnant')->default(0);
            $table->integer('promiscuity')->default(0);
            $table->integer('economy')->default(0);
            $table->integer('traditional_culture')->default(0);
            $table->integer('avoiding_adultery')->default(0);
            $table->timestamps();
            $table->unique(['city_feature_id', 'period_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reasons');
    }
};
