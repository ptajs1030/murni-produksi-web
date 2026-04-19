<?php

namespace App\Imports;

use App\Models\MCategory;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class MCategoryImport implements ToCollection, WithHeadingRow
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
            'category_code' => 'Kode Kategori',
            'category_name' => 'Nama Kategori',
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

        $code = trim($row['category_code']);

        if (strlen($code) > 5) {
            throw new \Exception("Kode Kategori maksimal 5 karakter");
        }

        if (MCategory::withTrashed()->where('category_code', $code)->exists()) {
            throw new \Exception("Kode Kategori '{$code}' sudah ada");
        }

        DB::beginTransaction();
        try {
            MCategory::create([
                'category_code' => $code,
                'category_name' => trim($row['category_name']),
                'created_by'    => $this->userId,
            ]);
            DB::commit();
            $this->successCount++;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Import category row {$rowNumber} failed: " . $e->getMessage());
            throw new \Exception('Gagal menyimpan: ' . $e->getMessage());
        }
    }

    public function getSuccessCount(): int { return $this->successCount; }
    public function getErrors(): array { return $this->errors; }
}
