<?php

namespace App\Exports;

use App\Models\MCategory;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MCategoryExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $request;
    protected $rowNumber = 0;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function query()
    {
        $query = MCategory::query()->with('creator');

        if ($this->request->has('search') && $this->request->input('search')) {
            $search = $this->request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('category_code', 'like', "%{$search}%")
                  ->orWhere('category_name', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('category_code', 'asc');
    }

    public function headings(): array
    {
        return [
            'No',
            'Kode Kategori',
            'Nama Kategori',
            'Tanggal Dibuat',
            'Dibuat Oleh',
        ];
    }

    public function map($category): array
    {
        $this->rowNumber++;

        return [
            $this->rowNumber,
            $category->category_code,
            $category->category_name,
            $category->created_at ? $category->created_at->format('d/m/Y H:i') : '-',
            $category->creator->name ?? '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style header row
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 12,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E2E8F0']
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
            ],
        ];
    }
}
