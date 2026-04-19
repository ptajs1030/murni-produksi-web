<?php

namespace App\Imports;

use App\Models\MPropertyItem;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class MPropertyItemImport implements ToCollection, WithHeadingRow
{
    protected int $successCount = 0;
    protected array $errors = [];
    protected int $userId;

    public function __construct(int $userId)
    {
        $this->userId = $userId;
    }

    public function collection(Collection $rows)
    {
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
            'property_code' => 'Kode Sifat',
            'property_name' => 'Nama Sifat',
        ];

        $missing = [];
        foreach ($requiredFields as $field => $label) {
            if (empty($row[$field]) && $row[$field] !== '0') {
                $missing[] = $label;
            }
        }

        if (!empty($missing)) {
            throw new \Exception('Kolom wajib kosong: ' . implode(', ', $missing));
        }

        $code = trim($row['property_code']);

        if (strlen($code) > 1) {
            throw new \Exception("Kode Sifat hanya boleh 1 karakter");
        }

        if (MPropertyItem::withTrashed()->where('property_code', $code)->exists()) {
            throw new \Exception("Kode Sifat '{$code}' sudah ada");
        }

        DB::beginTransaction();
        try {
            MPropertyItem::create([
                'property_code' => $code,
                'property_name' => trim($row['property_name']),
                'created_by'    => $this->userId,
            ]);
            DB::commit();
            $this->successCount++;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Import property item row {$rowNumber} failed: " . $e->getMessage());
            throw new \Exception('Gagal menyimpan: ' . $e->getMessage());
        }
    }

    public function getSuccessCount(): int { return $this->successCount; }
    public function getErrors(): array { return $this->errors; }
}
