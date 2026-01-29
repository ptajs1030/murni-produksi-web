<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductionRequest;
use App\Models\Production;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProductionController extends Controller
{
    /**
     * Store a newly created production event in storage.
     */
    public function store(ProductionRequest $request): JsonResponse
    {
        // Data sudah divalidasi oleh ProductionRequest, termasuk cek kategori
        $validatedData = $request->validated();

        // Buat record produksi baru
        $production = Production::create([
            'incoming_product_id' => $validatedData['incoming_product_id'],
            'incoming_quantity' => $validatedData['incoming_quantity'],
            'outgoing_product_id' => $validatedData['outgoing_product_id'],
            'outgoing_quantity' => $validatedData['outgoing_quantity'],
            'notes' => $validatedData['notes'] ?? null,
            'user_id' => Auth::id(), // Catat user yang melakukan produksi
        ]);

        // Note: Logika untuk mengurangi dan menambah stok belum ditambahkan
        // Anda bisa membuat service atau event listener untuk menangani hal ini

        return response()->json([
            'status' => true,
            'message' => 'Produksi berhasil dicatat.',
            'data' => $production,
        ], 201); // 201 Created
    }
}
