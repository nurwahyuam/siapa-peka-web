<?php

namespace App\Exports;

use App\Models\Application;
use App\Models\EducationLevel;
use App\Models\AgeClassification;
use App\Models\ChildBride;
use App\Models\Reason;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ApplicationsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle, WithEvents
{
    protected $periodId;

    public function __construct($periodId = null)
    {
        $this->periodId = $periodId;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                // Format kolom numeric (kolom H sampai U) untuk menampilkan 0
                $worksheet = $event->sheet->getDelegate();

                // Kolom H sampai U (index 7 sampai 20)
                for ($col = 8; $col <= 21; $col++) {
                    $columnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col);
                    $range = $columnLetter . '2:' . $columnLetter . $worksheet->getHighestRow();

                    $worksheet->getStyle($range)
                        ->getNumberFormat()
                        ->setFormatCode('0');
                }
            },
        ];
    }

    public function collection()
    {
        $query = Application::with(['cityFeature', 'period'])
            ->join('periods', 'applications.period_id', '=', 'periods.id')
            ->orderBy('periods.year', 'desc')
            ->orderBy('periods.id', 'desc')
            ->select('applications.*');

        if ($this->periodId) {
            $query->where('applications.period_id', $this->periodId);
        }

        return $query->get();
    }

    private function getSafeValue($model, $property)
    {
        if (!$model) {
            return 0; // Return integer 0, bukan string '0'
        }

        $value = $model->{$property};

        if ($value === null || $value === '' || !is_numeric($value)) {
            return 0; // Return integer 0
        }

        return (int) $value;
    }

    public function map($application): array
    {
        $education = EducationLevel::where('city_feature_id', $application->city_feature_id)
            ->where('period_id', $application->period_id)
            ->first();

        $age = AgeClassification::where('city_feature_id', $application->city_feature_id)
            ->where('period_id', $application->period_id)
            ->first();

        $child = ChildBride::where('city_feature_id', $application->city_feature_id)
            ->where('period_id', $application->period_id)
            ->first();

        $reason = Reason::where('city_feature_id', $application->city_feature_id)
            ->where('period_id', $application->period_id)
            ->first();

        return [
            $application->cityFeature->code ?? '-',
            $application->cityFeature->name ?? '-',
            $application->period->year ?? '-',
            $application->period->name ?? '-',
            $this->getSafeValue($application, 'submitted'),
            $this->getSafeValue($application, 'accepted'),
            $application->source ?? '-',

            // Education
            $this->getSafeValue($education, 'no_school'),
            $this->getSafeValue($education, 'sd'),
            $this->getSafeValue($education, 'smp'),
            $this->getSafeValue($education, 'sma'),

            // Age Classification
            $this->getSafeValue($age, 'less_than_15'),
            $this->getSafeValue($age, 'between_15_19'),

            // Child Bride
            $this->getSafeValue($child, 'number_of_men_under_19'),
            $this->getSafeValue($child, 'number_of_women_under_19'),
            $this->getSafeValue($child, 'total'),

            // Reasons
            $this->getSafeValue($reason, 'pregnant'),
            $this->getSafeValue($reason, 'promiscuity'),
            $this->getSafeValue($reason, 'economy'),
            $this->getSafeValue($reason, 'traditional_culture'),
            $this->getSafeValue($reason, 'avoiding_adultery'),

            $application->created_at?->format('d/m/Y H:i') ?? '-',
            $application->updated_at?->format('d/m/Y H:i') ?? '-',
        ];
    }

    public function headings(): array
    {
        return [
            'Kode Kota/Kabupaten',
            'Nama Kota/Kabupaten',
            'Tahun',
            'Periode',
            'Diajukan',
            'Dikabulkan',
            'Sumber',
            'Tidak Sekolah',
            'SD',
            'SMP',
            'SMA',
            'Usia < 15',
            'Usia 15-19',
            'Pria < 19',
            'Wanita < 19',
            'Total Pengantin Anak',
            'Hamil',
            'Pergaulan Bebas',
            'Ekonomi',
            'Budaya Tradisional',
            'Menghindari Zina',
            'Dibuat Pada',
            'Diupdate Pada'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FFE0E0E0']
                ]
            ],
        ];
    }

    public function title(): string
    {
        return 'Data Aplikasi';
    }
}
