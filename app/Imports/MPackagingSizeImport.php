<?php

namespace App\Imports;

use App\Models\MPackagingLevel;
use App\Models\MPackagingSize;
use App\Models\MPackagingSizeType;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class MPackagingSizeImport implements ToCollection, WithHeadingRow
{
    protected int $successCount = 0;
    protected array $errors = [];
    protected int $userId;
    protected $sizeTypes;
    protected $packagingLevels;
    private int $sheetIndex = 0;

    public function __construct(int $userId)
    {
        $this->userId = $userId;
        $this->sizeTypes = MPackagingSizeType::pluck('id', 'type_code');
        $this->packagingLevels = MPackagingLevel::pluck('id', 'level_code');
    }

    public function collection(Collection $rows)
    {
        $currentSheet = $this->sheetIndex++;

        if ($rows->isEmpty()) {
            return;
        }

        $expectedHeaders = ['packaging_size_code', 'packaging_size_name', 'type_code', 'level_code', 'unit_conversion_value'];
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
        $requiredFields = [
            'packaging_size_code'  => 'Kode Ukuran',
            'packaging_size_name'  => 'Nama Ukuran',
            'type_code'            => 'Kode Tipe',
            'level_code'           => 'Kode Level',
            'unit_conversion_value' => 'Nilai Konversi',
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

        $code = trim($row['packaging_size_code']);

        if (strlen($code) > 10) {
            throw new \Exception("Kode Ukuran maksimal 10 karakter");
        }

        if (MPackagingSize::withTrashed()->where('packaging_size_code', $code)->exists()) {
            throw new \Exception("Kode Ukuran '{$code}' sudah ada");
        }

        $typeCode = trim($row['type_code']);
        $sizeTypeId = $this->sizeTypes[$typeCode] ?? null;
        if (!$sizeTypeId) {
            throw new \Exception("Kode Tipe '{$typeCode}' tidak ditemukan");
        }

        $levelCode = (int) $row['level_code'];
        $levelId = $this->packagingLevels[$levelCode] ?? null;
        if (!$levelId) {
            throw new \Exception("Kode Level '{$levelCode}' tidak ditemukan");
        }

        $conversionValue = (int) $row['unit_conversion_value'];
        if ($conversionValue < 1) {
            throw new \Exception("Nilai Konversi minimal 1");
        }

        DB::beginTransaction();
        try {
            MPackagingSize::create([
                'packaging_size_code'   => $code,
                'packaging_size_name'   => trim($row['packaging_size_name']),
                'packaging_size_type_id' => $sizeTypeId,
                'packaging_level_id'    => $levelId,
                'unit_conversion_value' => $conversionValue,
                'created_by'            => $this->userId,
            ]);
            DB::commit();
            $this->successCount++;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Import packaging size row {$rowNumber} failed: " . $e->getMessage());
            throw new \Exception('Gagal menyimpan: ' . $e->getMessage());
        }
    }

    public function getSuccessCount(): int { return $this->successCount; }
    public function getErrors(): array { return $this->errors; }
}
