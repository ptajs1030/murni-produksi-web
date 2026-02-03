<?php

namespace App\Traits;

use App\Models\CoreProduct;
use App\Models\CoreProductImage;

trait HandlesImageUploads
{
    /**
     * Handle upload multiple gambar
     */
    private function handleImageUploads(CoreProduct $product, array $images): void
    {
        foreach ($images as $index => $image) {
            if ($image->isValid()) {
                CoreProductImage::uploadAndCreate($product->id, $image, [
                    'order' => $index,
                ]);
            }
        }
    }
}
