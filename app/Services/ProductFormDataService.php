<?php

namespace App\Services;

use App\Models\MCategory;
use App\Models\MPackagingSize;
use App\Models\MPackagingType;
use App\Models\MPropertyItem;
use App\Models\MRepackStatus;
use App\Models\MSupplier;

class ProductFormDataService
{
    public function getFormData(): array
    {
        return [
            'categories' => $this->getCategories(),
            'suppliers' => $this->getSuppliers(),
            'propertyItems' => $this->getPropertyItems(),
            'packagingSizes' => $this->getPackagingSizes(),
            'packagingTypes' => $this->getPackagingTypes(),
            'repackStatus' => $this->getRepackStatus(),
        ];
    }

    public function getCategories()
    {
        return MCategory::select('id', 'category_code', 'category_name')->get();
    }

    public function getSuppliers()
    {
        return MSupplier::select('id', 'supplier_code', 'supplier_name')->get();
    }

    public function getPropertyItems()
    {
        return MPropertyItem::select('id', 'property_code', 'property_name')->get();
    }

    public function getPackagingSizes()
    {
        return MPackagingSize::select('id', 'packaging_size_code', 'packaging_size_name')
            ->where('packaging_level_id', 1) // hanya menampilkan ukuran terkecil
            ->get();
    }

    public function getPackagingTypes()
    {
        return MPackagingType::select('id', 'packaging_type_code', 'packaging_type_name')->get();
    }

    public function getRepackStatus()
    {
        return MRepackStatus::select('id', 'repack_code', 'repack_name')->get();
    }
}
