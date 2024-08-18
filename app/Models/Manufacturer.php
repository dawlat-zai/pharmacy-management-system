<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manufacturer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'address',
        'phone_number',
        'mobile_number',
        'contact_person',
        'is_active'
    ];

    /*
     * Filter query
    */
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('name', 'like', '%'.$search.'%')
                ->orWhere('address', 'like', '%'.$search.'%')
                ->orWhere('phone_number', 'like', '%'.$search.'%')
                ->orWhere('mobile_number', 'like', '%'.$search.'%')
                ->orWhere('contact_person', 'like', '%'.$search.'%')
                ->orWhere('email', 'like', '%'.$search.'%');
        });
        
        if (isset($filters['sort_by']) && isset($filters['sort_order'])) {
            $query->orderBy($filters['sort_by'], $filters['sort_order']);
        }
    }
}
