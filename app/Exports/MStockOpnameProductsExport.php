<?php

namespace App\Exports;

use App\Models\CoreStockOpnameProduct;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MStockOpnameProductsExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $request;
    protected $rowNumber = 0;
    protected $stockOpnameId;
    protected $isOwner;

    public function __construct(Request $request, $stockOpnameId = null)
    {
        $this->request = $request;
        $this->stockOpnameId = $stockOpnameId;
        $this->isOwner = auth()->user()->isOwner() ?? false;
    }

    public function query()
    {
        $query = CoreStockOpnameProduct::query()
            ->with(['product', 'stock', 'stockOpname', 'approvedByUser']);

        if ($this->stockOpnameId) {
            $query->where('stock_opname_id', $this->stockOpnameId);
        }

        if ($this->request->has('search') && $this->request->input('search')) {
            $search = $this->request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('product', function ($productQuery) use ($search) {
                    $productQuery->where('product_name', 'like', "%{$search}%")
                                 ->orWhere('product_code', 'like', "%{$search}%");
                });
            });
        }

        return $query->orderBy('id', 'asc');
    }

    public function headings(): array
    {
        $headings = [
            'No',
            'Kode Produk',
            'Nama Produk',
        ];
        if ($this->isOwner) {
            $headings[] = 'Qty Sistem';
        }
        $headings[] = 'Qty Aktual';
        $headings[] = 'Qty Expired';
        if ($this->isOwner) {
            $headings[] = 'Selisih';
        }

        $headings[] = 'Tanggal Dibuat';

        return $headings;
    }

    public function map($stockOpnameProduct): array
    {
        $this->rowNumber++;

        $systemQty = $stockOpnameProduct->stock->packaging_size_input ?? 0;
        $realQty = $stockOpnameProduct->real_quantity ?? 0;
        $difference = $realQty - $systemQty;

        $row = [
            $this->rowNumber,
            $stockOpnameProduct->product->product_unit_sku ?? '-',
            $stockOpnameProduct->product->product_name ?? '-',
        ];
        if ($this->isOwner) {
            $row[] = $systemQty;
        }
        $row[] = $realQty;
        $row[] = $stockOpnameProduct->expired_quantity ?? 0;
        if ($this->isOwner) {
            $row[] = $difference;
        }

        $row[] = $stockOpnameProduct->created_at ? $stockOpnameProduct->created_at->format('d/m/Y H:i') : '-';

        return $row;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style header row
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 12,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E2E8F0']
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
            ],
        ];
    }
}
