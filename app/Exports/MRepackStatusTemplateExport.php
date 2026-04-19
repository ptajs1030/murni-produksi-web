<?php

namespace App\Exports;

use App\Exports\Sheets\SimpleTemplateSheet;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MRepackStatusTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'Template Status Repack' => new SimpleTemplateSheet(
                'Template Status Repack',
                ['repack_code', 'repack_name'],
                [
                    ['R1', 'Repack Manual'],
                    ['R2', 'Repack Otomatis'],
                    ['NR', 'Tidak Direpack'],
                ]
            ),
        ];
    }
}
