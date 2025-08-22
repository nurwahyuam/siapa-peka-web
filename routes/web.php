<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ManageController;

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/manage', [ManageController::class, 'index'])->name('manage.index');
    Route::get('/manage/create', [ManageController::class, 'create'])->name('manage.create');
    Route::post('/manage/import', [ManageController::class, 'store'])->name('manage.store');
    Route::get('/manage/show/{id}', [ManageController::class, 'show'])->name('manage.show');
    Route::delete('/manage/destroy/{id}', [ManageController::class, 'destroy'])->name('manage.destroy');
    Route::delete('/manage/destroy', [ManageController::class, 'destroyAll'])->name('manage.destroyAll');

    Route::get('/statistic/read', function () {
        return Inertia::render('Admin/Statistic/Read');
    })->name('statistic');
});


require __DIR__ . '/auth.php';
