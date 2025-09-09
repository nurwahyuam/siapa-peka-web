<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Period;
use App\Models\Application;
use App\Models\CityFeature;
use App\Models\EducationLevel;
use App\Models\AgeClassification;
use App\Models\Reason;
use App\Models\ChildBride;
use App\Models\ForumChild;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

class WelcomeController extends Controller
{
    public function index(Request $request)
    {
        // Hanya ambil data Jawa Timur
        $cityFeatures = CityFeature::where('province', 'like', '%Jawa Timur%')->get();
        $year = $request->input('year', date('Y'));
        $availableYears = Period::distinct()->pluck('year')->sortDesc()->values();

        // Data collections
        $applicationsData = [];
        $applicationsChildBrideData = [];
        $educationData = [];
        $ageData = [];
        $reasonData = [];
        $childBrideData = [];
        $forumChildrenData = [];

        // Dapatkan semua periode untuk tahun yang dipilih
        $periodsForYear = Period::where('year', $year)->get();

        if ($periodsForYear->count() > 0) {
            // Data Applications - TOTAL (bukan rata-rata)
            $applications = Application::whereIn('period_id', $periodsForYear->pluck('id'))
                ->select('city_feature_id', DB::raw('SUM(accepted) as total_accepted'))
                ->groupBy('city_feature_id')
                ->get();

            foreach ($applications as $app) {
                $applicationsData[$app->city_feature_id] = $app->total_accepted;
            }

            $applicationsChildBrideData = Application::whereIn('period_id', $periodsForYear->pluck('id'))
                ->select('city_feature_id', DB::raw('SUM(accepted) as accepted'), DB::raw('SUM(submitted) as submitted'))
                ->groupBy('city_feature_id')
                ->get();

            foreach ($applicationsChildBrideData as $app) {
                $applicationsChildBrideData[$app->city_feature_id] = [
                    'accepted' => (int) $app->accepted,
                    'submitted' => (int) $app->submitted,
                ];
            }

            // Data Education Levels - TOTAL
            $educationLevels = EducationLevel::whereIn('period_id', $periodsForYear->pluck('id'))
                ->select(
                    'city_feature_id',
                    DB::raw('SUM(no_school) as total_no_school'),
                    DB::raw('SUM(sd) as total_sd'),
                    DB::raw('SUM(smp) as total_smp'),
                    DB::raw('SUM(sma) as total_sma')
                )
                ->groupBy('city_feature_id')
                ->get();

            foreach ($educationLevels as $edu) {
                $educationData[$edu->city_feature_id] = [
                    'no_school' => (int) $edu->total_no_school,
                    'sd' => (int) $edu->total_sd,
                    'smp' => (int) $edu->total_smp,
                    'sma' => (int) $edu->total_sma
                ];
            }

            // Data Age Classification - TOTAL
            $ageClassifications = AgeClassification::whereIn('period_id', $periodsForYear->pluck('id'))
                ->select(
                    'city_feature_id',
                    DB::raw('SUM(less_than_15) as total_less_than_15'),
                    DB::raw('SUM(between_15_19) as total_between_15_19')
                )
                ->groupBy('city_feature_id')
                ->get();

            foreach ($ageClassifications as $age) {
                $ageData[$age->city_feature_id] = [
                    'less_than_15' => (int) $age->total_less_than_15,
                    'between_15_19' => (int) $age->total_between_15_19
                ];
            }

            // Data Reasons - TOTAL
            $reasons = Reason::whereIn('period_id', $periodsForYear->pluck('id'))
                ->select(
                    'city_feature_id',
                    DB::raw('SUM(pregnant) as total_pregnant'),
                    DB::raw('SUM(promiscuity) as total_promiscuity'),
                    DB::raw('SUM(economy) as total_economy'),
                    DB::raw('SUM(traditional_culture) as total_traditional_culture'),
                    DB::raw('SUM(avoiding_adultery) as total_avoiding_adultery')
                )
                ->groupBy('city_feature_id')
                ->get();

            foreach ($reasons as $reason) {
                $reasonData[$reason->city_feature_id] = [
                    'pregnant' => (int) $reason->total_pregnant,
                    'promiscuity' => (int) $reason->total_promiscuity,
                    'economy' => (int) $reason->total_economy,
                    'traditional_culture' => (int) $reason->total_traditional_culture,
                    'avoiding_adultery' => (int) $reason->total_avoiding_adultery
                ];
            }

            // Data Child Brides - TOTAL
            $childBrides = ChildBride::whereIn('period_id', $periodsForYear->pluck('id'))
                ->select(
                    'city_feature_id',
                    DB::raw('SUM(number_of_men_under_19) as total_men_under_19'),
                    DB::raw('SUM(number_of_women_under_19) as total_women_under_19'),
                    DB::raw('SUM(total) as total_children')
                )
                ->groupBy('city_feature_id')
                ->get();

            foreach ($childBrides as $bride) {
                $childBrideData[$bride->city_feature_id] = [
                    'men_under_19' => (int) $bride->total_men_under_19,
                    'women_under_19' => (int) $bride->total_women_under_19,
                    'total' => (int) $bride->total_children
                ];
            }

            // Data Forum Child - TOTAL
            $forumChildren = ForumChild::whereIn('period_id', $periodsForYear->pluck('id'))
                ->select(
                    'question',
                    DB::raw('SUM(CASE WHEN answer = true THEN 1 ELSE 0 END) as yes_count'),
                    DB::raw('SUM(CASE WHEN answer = false THEN 1 ELSE 0 END) as no_count')
                )
                ->groupBy('question')
                ->get();

            $forumChildrenData = $forumChildren;
        }

        // Data tahunan untuk grafik
        $yearlyData = [
            'years' => [],
            'submitted' => [],
            'accepted' => []
        ];

        // Ambil data untuk semua tahun
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

        // Tambahkan semua data ke cityFeatures
        foreach ($cityFeatures as $city) {
            $city->total_accepted = $applicationsData[$city->id] ?? 0;
            $city->year = $periodsForYear->pluck('year') ?? 0;

            // Tentukan kategori
            $city->kategori = $this->getKategori($city->total_accepted);

            // Tambahkan data tambahan (TOTAL, bukan rata-rata)
            $city->application = $applicationsChildBrideData[$city->id] ?? null;
            $city->education_data = $educationData[$city->id] ?? null;
            $city->age_data = $ageData[$city->id] ?? null;
            $city->reason_data = $reasonData[$city->id] ?? null;
            $city->child_bride_data = $childBrideData[$city->id] ?? null;

            // Tambahkan informasi periode
            $city->period_count = $periodsForYear->count();
            $city->period_types = $periodsForYear->pluck('name')->toArray();
        }

        return Inertia::render('Welcome', [
            'canLogin'    => Route::has('login'),
            'canRegister' => Route::has('register'),
            'cityFeatures' => $cityFeatures,
            'availableYears' => $availableYears,
            'selectedYear' => $year,
            'periodInfo' => [
                'count' => $periodsForYear->count(),
                'types' => $periodsForYear->pluck('name')
            ],
            'yearlyData' => $yearlyData,
            'forumChildren' => $forumChildrenData
        ]);
    }

    /**
     * Tentukan kategori berdasarkan jumlah aplikasi yang diterima
     */
    private function getKategori($totalAccepted)
    {
        if ($totalAccepted === 0) {
            return "Tidak Ada";
        } elseif ($totalAccepted <= 100) {
            return "Rendah";
        } elseif ($totalAccepted <= 250) {
            return "Cukup";
        } elseif ($totalAccepted <= 500) {
            return "Tinggi";
        } else {
            return "Sangat Tinggi";
        }
    }

    /**
     * API untuk mendapatkan data detail per periode
     */
    public function getCityDetail($cityId, $year)
    {
        $periods = Period::where('year', $year)->get();

        if ($periods->isEmpty()) {
            return response()->json(['error' => 'No data found for this year'], 404);
        }

        // Data per periode (bukan aggregate)
        $data = [
            'applications' => Application::where('city_feature_id', $cityId)
                ->whereIn('period_id', $periods->pluck('id'))
                ->with('period')
                ->get()
                ->groupBy('period.name'),

            'education' => EducationLevel::where('city_feature_id', $cityId)
                ->whereIn('period_id', $periods->pluck('id'))
                ->with('period')
                ->get()
                ->groupBy('period.name'),

            'age_classification' => AgeClassification::where('city_feature_id', $cityId)
                ->whereIn('period_id', $periods->pluck('id'))
                ->with('period')
                ->get()
                ->groupBy('period.name'),

            'reasons' => Reason::where('city_feature_id', $cityId)
                ->whereIn('period_id', $periods->pluck('id'))
                ->with('period')
                ->get()
                ->groupBy('period.name'),

            'child_brides' => ChildBride::where('city_feature_id', $cityId)
                ->whereIn('period_id', $periods->pluck('id'))
                ->with('period')
                ->get()
                ->groupBy('period.name'),
        ];

        return response()->json([
            'city' => CityFeature::find($cityId),
            'periods' => $periods,
            'data' => $data
        ]);
    }
}
