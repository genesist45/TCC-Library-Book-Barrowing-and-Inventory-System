<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            [
                'name' => 'Main Library – IT Section',
                'description' => 'Information Technology and Computer Science materials',
            ],
            [
                'name' => 'Main Library – Reference',
                'description' => 'Reference materials and encyclopedias',
            ],
            [
                'name' => 'Main Library – Social Science',
                'description' => 'Social Science and Humanities materials',
            ],
            [
                'name' => 'Main Library – Filipiniana Collection',
                'description' => 'Philippine literature and cultural materials',
            ],
            [
                'name' => 'Main Library – Fiction Section',
                'description' => 'Fiction, novels, and literary works',
            ],
            [
                'name' => 'Main Library – Circulation Desk',
                'description' => 'Main circulation and borrowing area',
            ],
            [
                'name' => 'Main Library – Reserve Section',
                'description' => 'Reserved materials with limited borrowing',
            ],
            [
                'name' => '2nd Floor – Engineering Section',
                'description' => 'Engineering and technical materials',
            ],
            [
                'name' => '2nd Floor – Medical Section',
                'description' => 'Medical and health science materials',
            ],
            [
                'name' => 'Ground Floor – General Collection',
                'description' => 'General collection and popular reading materials',
            ],
        ];

        foreach ($locations as $location) {
            Location::firstOrCreate(
                ['name' => $location['name']],
                [
                    'description' => $location['description'],
                    'is_published' => true,
                ]
            );
        }
    }
}
