<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'category_id',
        'product_type_id',
        'manufacture_date',
        'expiry_date',
        'purchase_price',
        'sale_price',
        'quantity'
    ];

    protected $casts = [
        'manufacture_date' => 'date',
        'expiry_date' => 'date',
    ];

    /*
     * Filter users
    */
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, fn ($query, $search) =>
            $query->where('name', 'like', '%' . $search . '%')
        );
        
        if (isset($filters['sort_by']) && isset($filters['sort_order'])) {
            $query->orderBy($filters['sort_by'], $filters['sort_order']);
        }
    }

    /**
     * Get the category that belongs to the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the product type that belongs to the product.
     */
    public function product_type(): BelongsTo
    {
        return $this->belongsTo(ProductType::class);
    }
}
