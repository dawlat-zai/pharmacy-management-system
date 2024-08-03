<?php

namespace App\Traits;

use App\Enums\DiscountTypeEnum;

trait SaleTrait 
{
    public function calculateSubTotal(array $items): float
    {
        $subtotal = 0;

        foreach ($items as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        return $subtotal;
    }

    public function calculateDiscount(float $discount, string $discountType, float $subtotal): float
    {
        $discountAmount = 0;

        if ($discountType === DiscountTypeEnum::PERCENTAGE->value) {
            $discountAmount = ($discount / 100) * $subtotal;
        } else {
            $discountAmount = $discount;
        }

        return $discountAmount;
    }

    public function calculateTotal(float $subtotal, float $discount): float
    {
        return $subtotal - $discount;
    }
}