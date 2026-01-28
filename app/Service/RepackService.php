<?php

namespace App\Service;

use Illuminate\Support\Facades\DB;
use App\Models\CoreProduct;
use App\Models\CoreStock;
use App\Models\CoreStockTransactions;
use App\Models\MTransactionType;
use Carbon\Carbon; // Import Carbon

class RepackService
{
    public function executeRepack(array $repackData) // Changed type hint
    {
        DB::beginTransaction();
        try {
            // Get transaction type IDs
            $repackOutType = MTransactionType::where('transaction_type_name', 'REPACK_OUT')->firstOrFail();
            $repackInType = MTransactionType::where('transaction_type_name', 'REPACK_IN')->firstOrFail();

            // Handle repack_date
            $repackDate = isset($repackData['repack_date']) ? Carbon::parse($repackData['repack_date']) : now();

            // Validate outgoing product and stock
            $outgoingProduct = CoreProduct::find($repackData['outgoing_product_id']); // Changed access
            if (!$outgoingProduct) {
                throw new \Exception("Outgoing product not found.");
            }

            $outgoingStock = CoreStock::where('product_id', $outgoingProduct->id)->first();
            if (!$outgoingStock || $outgoingStock->in_stock < $repackData['outgoing_quantity']) { // Changed access
                throw new \Exception("Not enough stock for outgoing product.");
            }

            // Decrement outgoing product stock
            $outgoingStock->in_stock -= $repackData['outgoing_quantity']; // Changed access
            $outgoingStock->save();

            // Record outgoing stock transaction
            CoreStockTransactions::create([
                'product_id' => $outgoingProduct->id,
                'transaction_type_id' => $repackOutType->id,
                'quantity' => -$repackData['outgoing_quantity'], // Changed access
                'transaction_date' => $repackDate, // Changed
                'notes' => 'Repack outgoing: ' . ($repackData['notes'] ?? ''), // Changed access
                'created_by' => auth()->id()
            ]);

            // Validate incoming product
            $incomingProduct = CoreProduct::find($repackData['incoming_product_id']); // Changed access
            if (!$incomingProduct) {
                throw new \Exception("Incoming product not found.");
            }

            // Increment incoming product stock
            $incomingStock = CoreStock::firstOrCreate(
                ['product_id' => $incomingProduct->id],
                ['in_stock' => 0]
            );
            $incomingStock->in_stock += $repackData['incoming_quantity']; // Changed access
            $incomingStock->save();

            // Record incoming stock transaction
            CoreStockTransactions::create([
                'product_id' => $incomingProduct->id,
                'transaction_type_id' => $repackInType->id,
                'quantity' => $repackData['incoming_quantity'], // Changed access
                'transaction_date' => $repackDate, // Changed
                'notes' => 'Repack incoming: ' . ($repackData['notes'] ?? ''), // Changed access
                'created_by' => auth()->id()
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
