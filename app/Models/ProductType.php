<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductType extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
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
}
