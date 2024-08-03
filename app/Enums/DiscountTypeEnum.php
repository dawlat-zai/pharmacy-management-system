<?php

namespace App\Enums;

enum DiscountTypeEnum: string 
{
    case FLAT = 'flat';
    case PERCENTAGE = 'percentage';

    public static function getAllValues(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function getValueName($value): string | null
    {
        return match ($value) {
            self::FLAT => 'flat',
            self::PERCENTAGE => 'percentage',
            default => null
        };
    }
}