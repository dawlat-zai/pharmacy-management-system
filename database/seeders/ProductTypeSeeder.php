<?php

namespace Database\Seeders;

use App\Models\ProductType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productTypes = [
            ['name' => 'Tablet'],
            ['name' => 'Capsule'],
            ['name' => 'Syrup'],
            ['name' => 'Injection'],
            ['name' => 'Infusion'],
            ['name' => 'Ointment'],
            ['name' => 'Drops'],
        ];

        foreach($productTypes as $productType) {
            ProductType::create($productType);
        }
    }
}
