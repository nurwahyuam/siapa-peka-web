<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EducationLevel;
use App\Models\AgeClassification;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Period;


class DashboardController extends Controller
{
    public function index() {
        $availableYears = Period::distinct()->pluck('year')->sortDesc()->values();
        foreach ($availableYears as $yr) {
            $periods = Period::where('year', $yr)->get();

            if ($periods->count() > 0) {
                $apps = Application::whereIn('period_id', $periods->pluck('id'))
                    ->select(DB::raw('SUM(submitted) as total_submitted'), DB::raw('SUM(accepted) as total_accepted'))
                    ->first();

                $yearlyData['years'][] = $yr;
                $yearlyData['submitted'][] = (int)($apps->total_submitted ?? 0);
                $yearlyData['accepted'][] = (int)($apps->total_accepted ?? 0);
            }
        }
        return Inertia::render('Admin/Dashboard', [
            'availableYears' => $availableYears,
            'yearlyData' => $yearlyData ?? null,
        ]);
    }
}
