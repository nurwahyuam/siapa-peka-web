<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ManageController;

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

Route::middleware('auth')->group(function () {
    Route::get('/admin/beranda', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/admin/profil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/admin/profil', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/admin/profil', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/admin/manajemen', [ManageController::class, 'index'])->name('manage.index');
    Route::get('/admin/manajemen/tambah', [ManageController::class, 'create'])->name('manage.create');
    Route::post('/admin/manajemen/tambah/simpan', [ManageController::class, 'storeCreate'])->name('manage.create.store');
    Route::get('/admin/manajemen/sunting/{id}', [ManageController::class, 'edit'])->name('manage.edit');
    Route::get('/admin/manajemen/import', [ManageController::class, 'import'])->name('manage.import');
    Route::post('/admin/manajemen/import/simpan', [ManageController::class, 'storeImport'])->name('manage.import.store');
    Route::get('/admin/manajemen/export', [ManageController::class, 'export'])->name('manage.export');
    Route::get('/admin/manajemen/detail/{id}', [ManageController::class, 'show'])->name('manage.show');

    Route::delete('/admin/manajemen/hapus/{name}',
    [ManageController::class, 'destroy'])->name('manage.destroy');
    Route::delete('/admin/manajemen/hapus-semua', [ManageController::class, 'destroyAll'])->name('manage.destroyAll');

    Route::get('/admin/statistic/read', function () {
        return Inertia::render('Admin/Statistic/Read');
    })->name('statistic');
});


require __DIR__ . '/auth.php';
