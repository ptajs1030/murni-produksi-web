<?php

namespace App\Exports;

use App\Exports\Sheets\SimpleTemplateSheet;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MSupplierTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'Template Supplier' => new SimpleTemplateSheet(
                'Template Supplier',
                ['supplier_code', 'supplier_name'],
                [
                    ['SP001', 'PT Maju Bersama'],
                    ['SP002', 'CV Sejahtera Jaya'],
                    ['SP003', 'UD Sumber Rejeki'],
                ]
            ),
        ];
    }
}
