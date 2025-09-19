<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Period;
use App\Models\CityFeature;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminRoutesTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->city = CityFeature::factory()->create([
            'name'     => 'Kota Surabaya',
            'slug'     => 'kota-surabaya',
            'province' => 'Jawa Timur',
            'geometry' => [], // wajib karena kolom NOT NULL
        ]);
    }

    #[Test]
    public function admin_can_access_dashboard()
    {
        $response = $this->actingAs($this->user)->get('/admin/beranda');
        $response->assertStatus(200);
    }

    #[Test]
    public function admin_can_access_profile_edit()
    {
        $response = $this->actingAs($this->user)->get('/admin/profil');
        $response->assertStatus(200);
    }

    #[Test]
    public function admin_can_update_profile()
    {
        $response = $this->actingAs($this->user)->patch('/admin/profil', [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);
        $response->assertRedirect();
    }

    #[Test]
    public function admin_can_delete_profile()
    {
        $response = $this->actingAs($this->user)->delete('/admin/profil');
        $response->assertRedirect();
    }

    #[Test]
    public function admin_can_access_manage_index()
    {
        $response = $this->actingAs($this->user)->get('/admin/manajemen');
        $response->assertStatus(200);
    }

    #[Test]
    public function admin_can_access_manage_create()
    {
        $response = $this->actingAs($this->user)->get('/admin/manajemen/tambah');
        $response->assertStatus(200);
    }

    #[Test]
    public function admin_can_store_new_manage_item()
    {
        $response = $this->actingAs($this->user)->post('/admin/manajemen/tambah/simpan', [
            'city_feature_id'    => $this->city->id, // pakai data dari setUp()
            'selected_year'      => 2025,
            'manual_period_name' => 'Triwulan I',
            'submitted'          => 10,
            'accepted'           => 8,
            'sources'            => [
                ['name' => 'BPS'],
                ['name' => 'Disdukcapil'],
            ],
            'no_school'          => 1,
            'sd'                 => 2,
            'smp'                => 3,
            'sma'                => 4,
            'less_than_15'       => 5,
            'between_15_19'      => 6,
            'number_of_men_under_19'   => 2,
            'number_of_women_under_19' => 3,
            'pregnant'           => 1,
            'promiscuity'        => 0,
            'economy'            => 1,
            'traditional_culture' => 0,
            'avoiding_adultery'  => 0,
        ]);

        $this->assertDatabaseHas('applications', [
            'city_feature_id' => $this->city->id,
            'submitted'       => 10,
            'accepted'        => 8,
        ]);

        $response->assertRedirect(route('manage.index'));
    }



    #[Test]
    public function admin_can_access_manage_import()
    {
        $response = $this->actingAs($this->user)->get('/admin/manajemen/impor');
        $response->assertStatus(200);
    }

    #[Test]
    public function admin_can_store_manage_import()
    {
        $response = $this->actingAs($this->user)->post('/admin/manajemen/impor/simpan', [
            // isi sesuai kebutuhan form impor
        ]);
        $response->assertRedirect();
    }

    #[Test]
    public function admin_can_access_manage_export()
    {
        $response = $this->actingAs($this->user)->get('/admin/manajemen/unduh');
        $response->assertStatus(200);
    }

    #[Test]
    public function admin_can_show_manage_detail()
    {
        $response = $this->actingAs($this->user)->get('/admin/manajemen/detail/kota-surabaya');
        $response->assertStatus(200);
    }


    #[Test]
    public function admin_can_access_manage_edit()
    {
        $period = Period::factory()->create([
            'year' => 2025,
        ]);

        $response = $this->actingAs($this->user)
            ->get("/admin/manajemen/{$this->city->slug}/{$period->year}/{$period->id}");

        $response->assertStatus(200);
    }

    #[Test]
    public function admin_can_update_manage()
    {
        $response = $this->actingAs($this->user)->put('/admin/manajemen/kota-surabaya/2025/1', [
            'data' => 'some-updated-data',
        ]);
        $response->assertRedirect();
    }

    #[Test]
    public function admin_can_destroy_manage()
    {
        $response = $this->actingAs($this->user)->delete('/admin/manajemen/kota-surabaya/1/destroy');
        $response->assertRedirect();
    }

    #[Test]
    public function admin_can_access_statistic()
    {
        $response = $this->actingAs($this->user)->get('/admin/statistik');
        $response->assertStatus(200);
    }
}
