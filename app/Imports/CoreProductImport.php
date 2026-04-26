<?php

namespace App\Imports;

use App\Models\CoreProduct;
use App\Models\MCategory;
use App\Models\MPackagingSize;
use App\Models\MPackagingType;
use App\Models\MPropertyItem;
use App\Models\MRepackStatus;
use App\Models\MSupplier;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CoreProductImport implements ToCollection, WithHeadingRow
{
    protected int $successCount = 0;
    protected array $errors = [];
    protected int $userId;

    // Cache lookups
    protected $categories;
    protected $suppliers;
    protected $propertyItems;
    protected $packagingSizes;
    protected $packagingTypes;
    protected $repackStatuses;
    private int $sheetIndex = 0;

    public function __construct(int $userId)
    {
        $this->userId = $userId;

        $this->categories = MCategory::pluck('id', 'category_code');
        $this->suppliers = MSupplier::pluck('id', 'supplier_code');
        $this->propertyItems = MPropertyItem::pluck('id', 'property_code');
        $this->packagingSizes = MPackagingSize::pluck('id', 'packaging_size_code');
        $this->packagingTypes = MPackagingType::pluck('id', 'packaging_type_code');
        $this->repackStatuses = MRepackStatus::pluck('id', 'repack_code');
    }

    public function collection(Collection $rows)
    {
        $currentSheet = $this->sheetIndex++;

        if ($rows->isEmpty()) {
            return;
        }

        $expectedHeaders = ['product_name', 'product_type', 'category_code', 'supplier_code', 'expired_date', 'property_code', 'packaging_size_code', 'packaging_type_code', 'repack_code'];
        $actualKeys = $rows->first()->keys()->toArray();
        $missingHeaders = array_diff($expectedHeaders, $actualKeys);

        if (!empty($missingHeaders)) {
            if ($currentSheet === 0) {
                $this->errors[] = 'Format file tidak sesuai template. Kolom tidak ditemukan: ' . implode(', ', $missingHeaders) . '. Gunakan file template yang didownload.';
            }
            return;
        }

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;

            if ($row->filter()->isEmpty()) {
                continue;
            }

            try {
                $this->processRow($row, $rowNumber);
            } catch (\Exception $e) {
                $this->errors[] = "Baris {$rowNumber}: {$e->getMessage()}";
            }
        }
    }

    protected function processRow(Collection $row, int $rowNumber): void
    {
        // Validate required fields (matching Create.vue form)
        $requiredFields = [
            'product_name' => 'Nama Produk',
            'product_type' => 'Tipe Produk',
            'category_code' => 'Kode Kategori',
            'supplier_code' => 'Kode Supplier',
            'expired_date' => 'Expired Date',
            'property_code' => 'Kode Sifat Benda',
            'packaging_size_code' => 'Kode Ukuran Kemasan',
            'packaging_type_code' => 'Kode Wadah Kemasan',
            'repack_code' => 'Kode Repack',
        ];

        $missing = [];
        foreach ($requiredFields as $field => $label) {
            if (empty($row[$field]) && $row[$field] !== 0 && $row[$field] !== '0') {
                $missing[] = $label;
            }
        }

        if (!empty($missing)) {
            throw new \Exception('Kolom wajib kosong: ' . implode(', ', $missing));
        }

        // Validate product_type
        $validTypes = ['Produk Bahan Baku', 'Produk Jadi'];
        if (!in_array($row['product_type'], $validTypes)) {
            throw new \Exception("Tipe Produk '{$row['product_type']}' tidak valid. Gunakan: " . implode(', ', $validTypes));
        }

        // Lookup foreign keys
        $categoryId = $this->categories[$row['category_code']] ?? null;
        if (!$categoryId) {
            throw new \Exception("Kode Kategori '{$row['category_code']}' tidak ditemukan");
        }

        $supplierId = $this->suppliers[$row['supplier_code']] ?? null;
        if (!$supplierId) {
            throw new \Exception("Kode Supplier '{$row['supplier_code']}' tidak ditemukan");
        }

        $propertyItemId = $this->propertyItems[$row['property_code']] ?? null;
        if (!$propertyItemId) {
            throw new \Exception("Kode Sifat Benda '{$row['property_code']}' tidak ditemukan");
        }

        $packagingSizeId = $this->packagingSizes[$row['packaging_size_code']] ?? null;
        if (!$packagingSizeId) {
            throw new \Exception("Kode Ukuran Kemasan '{$row['packaging_size_code']}' tidak ditemukan");
        }

        $packagingTypeId = $this->packagingTypes[$row['packaging_type_code']] ?? null;
        if (!$packagingTypeId) {
            throw new \Exception("Kode Wadah Kemasan '{$row['packaging_type_code']}' tidak ditemukan");
        }

        $repackStatusId = $this->repackStatuses[$row['repack_code']] ?? null;
        if (!$repackStatusId) {
            throw new \Exception("Kode Repack '{$row['repack_code']}' tidak ditemukan");
        }

        // Build product data (matching Create.vue form fields)
        $data = [
            'product_name' => $row['product_name'],
            'brand_name' => !empty($row['brand_name']) ? $row['brand_name'] : null,
            'product_type' => $row['product_type'],
            'm_category_id' => $categoryId,
            'm_supplier_id' => $supplierId,
            'expired_date' => $this->parseDate($row['expired_date']),
            'm_property_item_id' => $propertyItemId,
            'm_packaging_size_id' => $packagingSizeId,
            'm_packaging_type_id' => $packagingTypeId,
            'm_repack_status_id' => $repackStatusId,
            'description' => !empty($row['description']) ? $row['description'] : null,
            'packaging_size_input' => 0,
            'product_unit_qty' => 0,
            'product_unit_price' => 0,
            'created_by' => $this->userId,
        ];

        // Optional: product_unit_sku — if empty, model boot will auto-generate
        if (!empty($row['product_unit_sku'])) {
            $data['product_unit_sku'] = $row['product_unit_sku'];
        }

        // target_selling_date — input is number of days from today
        if (!empty($row['target_selling_date'])) {
            $days = (int) $row['target_selling_date'];
            $data['target_selling_date'] = now()->addDays($days)->format('Y-m-d');
        }

        DB::beginTransaction();
        try {
            CoreProduct::create($data);
            DB::commit();
            $this->successCount++;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Import product row {$rowNumber} failed: " . $e->getMessage());
            throw new \Exception('Gagal menyimpan: ' . $e->getMessage());
        }
    }

    protected function parseDate($value): ?string
    {
        if (empty($value)) {
            return null;
        }

        // Handle Excel numeric date format
        if (is_numeric($value)) {
            return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject((int) $value)->format('Y-m-d');
        }

        // Try standard date parsing
        try {
            return \Carbon\Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getSuccessCount(): int
    {
        return $this->successCount;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
