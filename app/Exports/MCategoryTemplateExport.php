<?php

namespace App\Exports;

use App\Exports\Sheets\SimpleTemplateSheet;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MCategoryTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'Template Kategori' => new SimpleTemplateSheet(
                'Template Kategori',
                ['category_code', 'category_name'],
                [
                    ['KT001', 'Makanan'],
                    ['KT002', 'Minuman'],
                    ['KT003', 'Bumbu Masak'],
                ]
            ),
        ];
    }
}
