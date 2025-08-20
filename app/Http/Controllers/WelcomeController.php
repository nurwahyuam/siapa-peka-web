<?php

namespace App\Http\Controllers;

use App\Models\CityFeature;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

class WelcomeController extends Controller
{
    public function index()
    {
        $cityFeatures = CityFeature::all();

        return Inertia::render('Welcome', [
            'canLogin'    => Route::has('login'),
            'canRegister' => Route::has('register'),
            'cityFeatures' => $cityFeatures,
        ]);
    }
}
