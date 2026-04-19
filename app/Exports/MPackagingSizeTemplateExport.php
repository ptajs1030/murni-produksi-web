<?php

namespace App\Exports;

use App\Exports\Sheets\ReferenceSheet;
use App\Exports\Sheets\SimpleTemplateSheet;
use App\Models\MPackagingLevel;
use App\Models\MPackagingSizeType;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MPackagingSizeTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'Template Ukuran Kemasan' => new SimpleTemplateSheet(
                'Template Ukuran Kemasan',
                ['packaging_size_code', 'packaging_size_name', 'type_code', 'level_code', 'unit_conversion_value'],
                [
                    ['PS001', 'Kilogram', 'KG01', 1, 1000],
                    ['PS002', 'Ons', 'KG01', 1, 100],
                    ['PS003', 'Liter', 'LT01', 1, 1000],
                ]
            ),
            'Ref Tipe Ukuran' => new ReferenceSheet(
                MPackagingSizeType::orderBy('type_code')->get(['type_code', 'type_description', 'base_unit']),
                ['Kode Tipe', 'Deskripsi Tipe', 'Satuan Dasar'],
                'Ref Tipe Ukuran'
            ),
            'Ref Level Kemasan' => new ReferenceSheet(
                MPackagingLevel::orderBy('level_code')->get(['level_code', 'level_description']),
                ['Kode Level', 'Deskripsi Level'],
                'Ref Level Kemasan'
            ),
        ];
    }
}
