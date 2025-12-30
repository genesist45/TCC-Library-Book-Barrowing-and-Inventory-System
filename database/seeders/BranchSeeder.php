<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = [
            [
                'name' => 'Main Library',
                'address' => 'Tagoloan Community College, Tagoloan, Misamis Oriental',
                'description' => 'Main campus library with all collections',
            ],
        ];

        foreach ($branches as $branch) {
            Branch::firstOrCreate(
                ['name' => $branch['name']],
                [
                    'address' => $branch['address'],
                    'description' => $branch['description'],
                    'is_published' => true,
                ]
            );
        }
    }
}
