<?php

namespace App\Exports;

use App\Exports\Sheets\ReferenceSheet;
use App\Exports\Sheets\SimpleTemplateSheet;
use App\Models\MPackagingLevel;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MPackagingTypeTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'Template Tipe Kemasan' => new SimpleTemplateSheet(
                'Template Tipe Kemasan',
                ['packaging_type_code', 'packaging_type_name', 'level_code'],
                [
                    ['PT001', 'Dus', 1],
                    ['PT002', 'Plastik', 2],
                    ['PT003', 'Botol', 1],
                ]
            ),
            'Ref Level Kemasan' => new ReferenceSheet(
                MPackagingLevel::orderBy('level_code')->get(['level_code', 'level_description']),
                ['Kode Level', 'Deskripsi Level'],
                'Ref Level Kemasan'
            ),
        ];
    }
}
