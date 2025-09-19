<?php

namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Tambahkan fungsi SQLite agar tidak error di unit test
        if (DB::getDriverName() === 'sqlite') {
            DB::getPdo()->sqliteCreateFunction('jsonb_array_length', function ($json) {
                $arr = json_decode($json, true);
                return is_array($arr) ? count($arr) : 0;
            });
        }
    }
}
