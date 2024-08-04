<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    protected $fillable = [
        'sub_total',
        'discount',
        'total',
    ];

    public function sale_items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }
}
