<?php

namespace App\Exports\Sheets;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProductTemplateSheet implements FromArray, WithTitle, WithStyles, ShouldAutoSize
{
    public function array(): array
    {
        return [
            // Header row
            [
                'product_name',
                'brand_name',
                'product_type',
                'category_code',
                'supplier_code',
                'target_selling_date',
                'expired_date',
                'property_code',
                'packaging_size_code',
                'packaging_type_code',
                'repack_code',
                'product_unit_sku',
                'description',
            ],
        ];
    }

    public function title(): string
    {
        return 'Template Produk';
    }

    public function styles(Worksheet $sheet)
    {
        $lastCol = 'M';

        // Style header row
        $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 11,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
            ],
        ]);

        // Style example row (lighter color to indicate it should be replaced)
        $sheet->getStyle("A2:{$lastCol}2")->applyFromArray([
            'font' => [
                'italic' => true,
                'color' => ['rgb' => '808080'],
            ],
        ]);

        return [];
    }
}
