<?php

namespace App\Exports;

use App\Models\MCategory;
use App\Models\MPackagingSize;
use App\Models\MPackagingType;
use App\Models\MPropertyItem;
use App\Models\MRepackStatus;
use App\Models\MSupplier;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class CoreProductTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'Template Produk' => new Sheets\ProductTemplateSheet(),
            'Ref Kategori' => new Sheets\ReferenceSheet(
                MCategory::orderBy('category_code')->get(['category_code', 'category_name']),
                ['Kode Kategori', 'Nama Kategori'],
                'Ref Kategori'
            ),
            'Ref Supplier' => new Sheets\ReferenceSheet(
                MSupplier::orderBy('supplier_code')->get(['supplier_code', 'supplier_name']),
                ['Kode Supplier', 'Nama Supplier'],
                'Ref Supplier'
            ),
            'Ref Sifat Benda' => new Sheets\ReferenceSheet(
                MPropertyItem::orderBy('property_code')->get(['property_code', 'property_name']),
                ['Kode Sifat Benda', 'Nama Sifat Benda'],
                'Ref Sifat Benda'
            ),
            'Ref Ukuran Kemasan' => new Sheets\ReferenceSheet(
                MPackagingSize::orderBy('packaging_size_code')->get(['packaging_size_code', 'packaging_size_name']),
                ['Kode Ukuran Kemasan', 'Nama Ukuran Kemasan'],
                'Ref Ukuran Kemasan'
            ),
            'Ref Wadah Kemasan' => new Sheets\ReferenceSheet(
                MPackagingType::orderBy('packaging_type_code')->get(['packaging_type_code', 'packaging_type_name']),
                ['Kode Wadah Kemasan', 'Nama Wadah Kemasan'],
                'Ref Wadah Kemasan'
            ),
            'Ref Repack Status' => new Sheets\ReferenceSheet(
                MRepackStatus::orderBy('repack_code')->get(['repack_code', 'repack_name']),
                ['Kode Repack', 'Nama Repack'],
                'Ref Repack Status'
            ),
            'Ref Tipe Produk' => new Sheets\ReferenceSheet(
                collect([
                    ['product_type' => 'Produk Bahan Baku'],
                    ['product_type' => 'Produk Jadi'],
                ]),
                ['Tipe Produk'],
                'Ref Tipe Produk'
            ),
        ];
    }
}
