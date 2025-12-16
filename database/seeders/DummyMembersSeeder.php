<?php

namespace Database\Seeders;

use App\Models\Member;
use Illuminate\Database\Seeder;

class DummyMembersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $members = [
            [
                'member_no' => 'MEM-2024-0001',
                'name' => 'Juan Dela Cruz',
                'type' => 'Regular',
                'borrower_category' => 'Student',
                'status' => 'Active',
                'email' => 'juan.delacruz@tcc.edu.ph',
                'phone' => '09171234567',
                'address' => '123 Rizal Street, Tagoloan, Misamis Oriental 9001',
                'booking_quota' => 5,
                'member_group' => 'BSIT',
                'allow_login' => false,
            ],
            [
                'member_no' => 'MEM-2024-0002',
                'name' => 'Maria Clara Santos',
                'type' => 'Regular',
                'borrower_category' => 'Student',
                'status' => 'Active',
                'email' => 'maria.santos@tcc.edu.ph',
                'phone' => '09182345678',
                'address' => '456 Bonifacio Avenue, Tagoloan, Misamis Oriental 9001',
                'booking_quota' => 5,
                'member_group' => 'BSBA',
                'allow_login' => false,
            ],
            [
                'member_no' => 'MEM-2024-0003',
                'name' => 'Dr. Pedro Reyes Garcia',
                'type' => 'Privileged',
                'borrower_category' => 'Faculty',
                'status' => 'Active',
                'email' => 'pedro.garcia@tcc.edu.ph',
                'phone' => '09193456789',
                'address' => '789 Mabini Road, Cagayan de Oro City, Misamis Oriental 9000',
                'booking_quota' => 10,
                'member_group' => 'CCS Faculty',
                'allow_login' => false,
            ],
            [
                'member_no' => 'MEM-2024-0004',
                'name' => 'Ana Liza Fernandez',
                'type' => 'Regular',
                'borrower_category' => 'Student',
                'status' => 'Active',
                'email' => 'ana.fernandez@tcc.edu.ph',
                'phone' => '09204567890',
                'address' => '234 Luna Street, Tagoloan, Misamis Oriental 9001',
                'booking_quota' => 5,
                'member_group' => 'BSEd',
                'allow_login' => false,
            ],
            [
                'member_no' => 'MEM-2024-0005',
                'name' => 'Carlo Miguel Ramos',
                'type' => 'Regular',
                'borrower_category' => 'Student',
                'status' => 'Active',
                'email' => 'carlo.ramos@tcc.edu.ph',
                'phone' => '09215678901',
                'address' => '567 Del Pilar Extension, Tagoloan, Misamis Oriental 9001',
                'booking_quota' => 5,
                'member_group' => 'BSIT',
                'allow_login' => false,
            ],
            [
                'member_no' => 'MEM-2024-0006',
                'name' => 'Sofia Angela Cruz',
                'type' => 'Regular',
                'borrower_category' => 'Student',
                'status' => 'Active',
                'email' => 'sofia.cruz@tcc.edu.ph',
                'phone' => '09226789012',
                'address' => '890 Aguinaldo Street, Villanueva, Misamis Oriental 9002',
                'booking_quota' => 5,
                'member_group' => 'BSHM',
                'allow_login' => false,
            ],
            [
                'member_no' => 'MEM-2024-0007',
                'name' => 'Prof. Roberto Villanueva',
                'type' => 'Privileged',
                'borrower_category' => 'Faculty',
                'status' => 'Active',
                'email' => 'roberto.villanueva@tcc.edu.ph',
                'phone' => '09237890123',
                'address' => '321 Quezon Boulevard, Cagayan de Oro City, Misamis Oriental 9000',
                'booking_quota' => 10,
                'member_group' => 'CBA Faculty',
                'allow_login' => false,
            ],
            [
                'member_no' => 'MEM-2024-0008',
                'name' => 'Jessica Mae Tolentino',
                'type' => 'Regular',
                'borrower_category' => 'Student',
                'status' => 'Active',
                'email' => 'jessica.tolentino@tcc.edu.ph',
                'phone' => '09248901234',
                'address' => '654 Osmeña Highway, Tagoloan, Misamis Oriental 9001',
                'booking_quota' => 5,
                'member_group' => 'BSBA',
                'allow_login' => false,
            ],
            [
                'member_no' => 'MEM-2024-0009',
                'name' => 'Mark Anthony Bautista',
                'type' => 'Regular',
                'borrower_category' => 'Student',
                'status' => 'Inactive',
                'email' => 'mark.bautista@tcc.edu.ph',
                'phone' => '09259012345',
                'address' => '987 Magsaysay Avenue, Jasaan, Misamis Oriental 9003',
                'booking_quota' => 5,
                'member_group' => 'BSIT',
                'allow_login' => false,
            ],
            [
                'member_no' => 'MEM-2024-0010',
                'name' => 'Dr. Kristine Joy Mendoza',
                'type' => 'Privileged',
                'borrower_category' => 'Faculty',
                'status' => 'Active',
                'email' => 'kristine.mendoza@tcc.edu.ph',
                'phone' => '09260123456',
                'address' => '147 Roxas Street, Tagoloan, Misamis Oriental 9001',
                'booking_quota' => 10,
                'member_group' => 'Library Faculty',
                'allow_login' => false,
            ],
        ];

        $created = 0;
        foreach ($members as $memberData) {
            // Skip if member already exists
            if (Member::where('member_no', $memberData['member_no'])->exists()) {
                continue;
            }

            Member::create($memberData);
            $created++;
        }

        $this->command->info("✅ Dummy members created successfully! ($created new members added)");
        $this->command->info('   - Students: 7');
        $this->command->info('   - Faculty: 3');
    }
}
