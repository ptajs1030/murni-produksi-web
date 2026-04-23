<?php

namespace App\Exports;

use App\Exports\Sheets\SimpleTemplateSheet;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MPropertyItemTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'Template Sifat Benda' => new SimpleTemplateSheet(
                'Template Sifat Benda',
                ['property_code', 'property_name'],
                [
                    ['P', 'Padat'],
                    ['C', 'Cair'],
                    ['G', 'Gas'],
                ]
            ),
        ];
    }
}
