<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['name' => 'create users'],
            ['name' => 'read users'],
            ['name' => 'update users'],
            ['name' => 'delete users'],
            ['name' => 'create products'],
            ['name' => 'read products'],
            ['name' => 'update products'],
            ['name' => 'delete products'],
            ['name' => 'create customers'],
            ['name' => 'read customers'],
            ['name' => 'update customers'],
            ['name' => 'delete customers'],
        ];

        foreach($permissions as $permission) {
            Permission::create($permission);
        }
    }
}
