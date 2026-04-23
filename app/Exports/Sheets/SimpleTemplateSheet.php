<?php

namespace App\Exports\Sheets;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SimpleTemplateSheet implements FromArray, WithTitle, WithStyles, ShouldAutoSize
{
    protected string $sheetTitle;
    protected array $headers;
    protected array $sampleRows;

    public function __construct(string $sheetTitle, array $headers, array $sampleRows = [])
    {
        $this->sheetTitle = $sheetTitle;
        $this->headers = $headers;
        $this->sampleRows = $sampleRows;
    }

    public function array(): array
    {
        return array_merge([$this->headers], $this->sampleRows);
    }

    public function title(): string
    {
        return $this->sheetTitle;
    }

    public function styles(Worksheet $sheet)
    {
        $colCount = count($this->headers);
        $lastCol = chr(64 + $colCount);

        $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 11,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
            ],
        ]);

        $rowCount = count($this->sampleRows);
        if ($rowCount > 0) {
            $sheet->getStyle("A2:{$lastCol}" . (1 + $rowCount))->applyFromArray([
                'font' => [
                    'italic' => true,
                    'color' => ['rgb' => '808080'],
                ],
            ]);
        }

        return [];
    }
}
