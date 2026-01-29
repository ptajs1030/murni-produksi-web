<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\CoreProduct;
use App\Models\CoreProductImage;
use App\Models\CoreStock;
use App\Traits\HandlesImageUploads;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class CoreProductController extends Controller
{
    use HandlesImageUploads;

    public function __construct(private \App\Services\ProductFormDataService $productFormDataService)
    {
    }
    public function index(Request $request)
    {
        $query = CoreProduct::query()->with(['category', 'supplier']);
        if ($request->has('search')) {
            $query->where('product_name', 'like', '%' . $request->input('search') . '%');
        }
        $products = $query->paginate(10);

        return Inertia::render('CoreProducts/Index', [
            'products' => $products,
            'filters' => $request->all(['search']),
        ]);
    }
    public function create()
    {
        return Inertia::render('CoreProducts/Create', $this->productFormDataService->getFormData());
    }

    public function edit(CoreProduct $product)
    {
        $product->load(['productImages', 'primaryImage']);


        return Inertia::render('CoreProducts/Edit', array_merge(
            ['product' => $product],
            $this->productFormDataService->getFormData()
        ));
    }

    public function store(ProductRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = auth()->id();


        unset($validated['images']);
        unset($validated['deleted_images']);

        DB::beginTransaction();

        try {
            // Buat produk
            $product = CoreProduct::create($validated);
            // Handle upload gambar
            if ($request->hasFile('images')) {
                $this->handleImageUploads($product, $request->file('images'));
            }

            DB::commit();

            toast_success('Produk berhasil ditambahkan.');

            return redirect()->route('products.index');
        } catch (\Exception $e) {
            DB::rollBack();

            // Log error untuk debugging
            Log::error('Error creating product: '.$e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['images']), // Exclude files from logging
            ]);

            toast_error('Gagal menyimpan produk: '.$e->getMessage());

            return back()->withInput();
        }
    }

    public function update(ProductRequest $request, CoreProduct $product)
    {
        $validated = $request->validated();
        $validated['updated_by'] = auth()->id();

        // Remove images from validated data karena tidak ada di tabel core_products
        unset($validated['images']);
        unset($validated['deleted_images']);

        DB::beginTransaction();

        try {
            // Update produk
            $product->update($validated);

            // Handle gambar yang dihapus
            if ($request->has('deleted_images') && ! empty($request->deleted_images)) {
                $this->handleImageDeletions($request->deleted_images);
            }

            // Handle upload gambar baru
            if ($request->hasFile('images')) {
                $this->handleImageUploads($product, $request->file('images'));
            }

            DB::commit();

            toast_success('Produk berhasil diperbarui.');

            return redirect()->route('products.index');
        } catch (\Exception $e) {
            DB::rollBack();

            toast_error('Gagal mengupdate produk: '.$e->getMessage());

            return back()->withInput();
        }
    }
    public function destroy(CoreProduct $product)
    {
        $product->update(['deleted_by' => auth()->id()]);
        $product->delete();

        toast_warning('Produk berhasil dihapus.');

        return redirect()->route('products.index');
    }

    /**
     * Handle penghapusan gambar
     */
    private function handleImageDeletions(array $imageIds)
    {
        $images = CoreProductImage::whereIn('id', $imageIds)->get();

        foreach ($images as $image) {
            $image->deleteImageFile();
            $image->delete();
        }
    }

    public function stockDetails(CoreProduct $product)
    {
        $stockDetails = CoreStock::with([
            'product.packagingSize.sizeType:id,base_unit',
            'product.packagingSize:id,packaging_size_name,unit_conversion_value,packaging_size_type_id',
        ])
            ->where('product_id', $product->id)
            ->get()
            ->map(function ($stock) {
                return [
                    'stock' => [
                        'in_stock' => $stock->in_stock,
                        'packaging_size_input' => $stock->packaging_size_input,
                        'real_quantity_smallest_unit' => $stock->real_quantity_in_smallest_unit,
                        'formatted_quantity' => $stock->formatted_quantity,
                        'track_stock' => $stock->track_stock,
                        'stock_alert' => $stock->stock_alert,
                        'track_alert' => $stock->track_alert,
                        'cost_amount' => $stock->cost_amount,
                    ],
                ];
            });
   


        return response()->json([
            'product' => [
                'id' => $product->id,
                'product_code' => $product->product_unit_sku,
                'product_name' => $product->product_name,
                'packaging_size' => $product->packagingSize?->packaging_size_name,
                'packaging_type' => $product->packagingType?->packaging_type_name,
            ],
            'stock_details' => $stockDetails,
        ]);
    }
}
