<?php

namespace App\Exports;

use App\Exports\Sheets\SimpleTemplateSheet;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MPackagingLevelTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'Template Level' => new SimpleTemplateSheet(
                'Template Level',
                ['level_code', 'level_description'],
                [
                    [1, 'Satuan Terkecil'],
                    [2, 'Pak / Bundle'],
                    [3, 'Dus / Karton'],
                ]
            ),
        ];
    }
}
