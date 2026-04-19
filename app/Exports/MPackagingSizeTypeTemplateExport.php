<?php

namespace App\Exports;

use App\Exports\Sheets\SimpleTemplateSheet;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MPackagingSizeTypeTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'Template Tipe Ukuran' => new SimpleTemplateSheet(
                'Template Tipe Ukuran',
                ['type_code', 'type_description', 'base_unit'],
                [
                    ['KG01', 'Kilogram', 'gram'],
                    ['LT01', 'Liter', 'ml'],
                    ['PC01', 'Pieces', 'pcs'],
                ]
            ),
        ];
    }
}
