<?php

namespace App\Imports;

use App\Models\MPackagingLevel;
use App\Models\MPackagingType;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class MPackagingTypeImport implements ToCollection, WithHeadingRow
{
    protected int $successCount = 0;
    protected array $errors = [];
    protected int $userId;
    protected $packagingLevels;
    private int $sheetIndex = 0;

    public function __construct(int $userId)
    {
        $this->userId = $userId;
        $this->packagingLevels = MPackagingLevel::pluck('id', 'level_code');
    }

    public function collection(Collection $rows)
    {
        $currentSheet = $this->sheetIndex++;

        if ($rows->isEmpty()) {
            return;
        }

        $expectedHeaders = ['packaging_type_code', 'packaging_type_name', 'level_code'];
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
            'packaging_type_code' => 'Kode Tipe Kemasan',
            'packaging_type_name' => 'Nama Tipe Kemasan',
            'level_code'          => 'Kode Level',
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

        $code = trim($row['packaging_type_code']);
        $name = trim($row['packaging_type_name']);

        if (strlen($code) > 5) {
            throw new \Exception("Kode Tipe Kemasan maksimal 5 karakter");
        }

        if (strlen($name) > 20) {
            throw new \Exception("Nama Tipe Kemasan maksimal 20 karakter (saat ini " . strlen($name) . " karakter)");
        }

        if (MPackagingType::withTrashed()->where('packaging_type_code', $code)->exists()) {
            throw new \Exception("Kode Tipe Kemasan '{$code}' sudah ada");
        }

        $levelCode = (int) $row['level_code'];
        $levelId = $this->packagingLevels[$levelCode] ?? null;
        if (!$levelId) {
            throw new \Exception("Kode Level '{$levelCode}' tidak ditemukan");
        }

        DB::beginTransaction();
        try {
            MPackagingType::create([
                'packaging_type_code' => $code,
                'packaging_type_name' => $name,
                'packaging_level_id'  => $levelId,
                'created_by'          => $this->userId,
            ]);
            DB::commit();
            $this->successCount++;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Import packaging type row {$rowNumber} failed: " . $e->getMessage());
            throw new \Exception('Gagal menyimpan: ' . $e->getMessage());
        }
    }

    public function getSuccessCount(): int { return $this->successCount; }
    public function getErrors(): array { return $this->errors; }
}
