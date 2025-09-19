<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\Admin\StatisticController;
use App\Http\Controllers\Admin\ManageController;
use App\Http\Controllers\Admin\DashboardController;

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

    Route::middleware('auth')->group(function () {
        Route::get('/admin/beranda', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/admin/profil', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/admin/profil', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/admin/profil', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('/admin/manajemen', [ManageController::class, 'index'])->name('manage.index');
        Route::get('/admin/manajemen/tambah', [ManageController::class, 'create'])->name('manage.create');
        Route::post('/admin/manajemen/tambah/simpan', [ManageController::class, 'storeCreate'])->name('manage.create.store');
        Route::get('/admin/manajemen/impor', [ManageController::class, 'import'])->name('manage.import');
        Route::post('/admin/manajemen/impor/simpan', [ManageController::class, 'storeImport'])->name('manage.import.store');
        Route::get('/admin/manajemen/unduh', [ManageController::class, 'export'])->name('manage.export');
        Route::get('/admin/manajemen/detail/{slug}', [ManageController::class, 'show'])->name('manage.show');
        Route::get('/admin/manajemen/{city}/{year?}/{period?}', [ManageController::class, 'edit'])
            ->name('manage.edit');
        Route::put('/admin/manajemen/{city}/{year}/{period?}', [ManageController::class, 'update'])
            ->name('manage.update');
        Route::delete('/admin/manajemen/{city}/{period?}/destroy', [ManageController::class, 'destroy'])
            ->name('manage.destroy');

        Route::get('/admin/statistik', [StatisticController::class, 'index'])->name('statistic');
    });

Route::fallback(function () {
    return Inertia::render('NotFound')->toResponse(request())->setStatusCode(404);
});


require __DIR__ . '/auth.php';
