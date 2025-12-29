<?php

namespace Database\Seeders;

use App\Models\Member;
use Illuminate\Database\Seeder;

class TestMembersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates 5 simple test members with easy-to-remember member numbers (1-5)
     * for quick testing during development.
     */
    public function run(): void
    {
        $members = [
            [
                'member_no' => '1',
                'name' => 'John Doe',
                'type' => 'Regular',
                'borrower_category' => 'Student',
                'status' => 'Active',
                'email' => 'john.doe@test.com',
                'phone' => '09171111111',
                'address' => '123 Main Street, Test City',
                'booking_quota' => 5,
                'member_group' => 'BSIT',
                'allow_login' => false,
            ],
            [
                'member_no' => '2',
                'name' => 'Jane Smith',
                'type' => 'Regular',
                'borrower_category' => 'Student',
                'status' => 'Active',
                'email' => 'jane.smith@test.com',
                'phone' => '09172222222',
                'address' => '456 Oak Avenue, Test City',
                'booking_quota' => 5,
                'member_group' => 'BSBA',
                'allow_login' => false,
            ],
            [
                'member_no' => '3',
                'name' => 'Mike Johnson',
                'type' => 'Privileged',
                'borrower_category' => 'Faculty',
                'status' => 'Active',
                'email' => 'mike.johnson@test.com',
                'phone' => '09173333333',
                'address' => '789 Pine Road, Test City',
                'booking_quota' => 10,
                'member_group' => 'CCS Faculty',
                'allow_login' => false,
            ],
            [
                'member_no' => '4',
                'name' => 'Sarah Williams',
                'type' => 'Regular',
                'borrower_category' => 'Student',
                'status' => 'Active',
                'email' => 'sarah.williams@test.com',
                'phone' => '09174444444',
                'address' => '321 Elm Street, Test City',
                'booking_quota' => 5,
                'member_group' => 'BSEd',
                'allow_login' => false,
            ],
            [
                'member_no' => '5',
                'name' => 'Tom Brown',
                'type' => 'Regular',
                'borrower_category' => 'Student',
                'status' => 'Active',
                'email' => 'tom.brown@test.com',
                'phone' => '09175555555',
                'address' => '654 Maple Lane, Test City',
                'booking_quota' => 5,
                'member_group' => 'BSIT',
                'allow_login' => false,
            ],
        ];

        $created = 0;
        $skipped = 0;

        foreach ($members as $memberData) {
            // Skip if member already exists
            if (Member::where('member_no', $memberData['member_no'])->exists()) {
                $skipped++;
                $this->command->info("  ⏭ Member #{$memberData['member_no']} ({$memberData['name']}) already exists, skipping...");
                continue;
            }

            Member::create($memberData);
            $created++;
            $this->command->info("  ✓ Created Member #{$memberData['member_no']}: {$memberData['name']}");
        }

        $this->command->newLine();
        $this->command->info("✅ Test members seeding complete!");
        $this->command->info("   - Created: {$created}");
        $this->command->info("   - Skipped: {$skipped}");
        $this->command->newLine();
        $this->command->info("📝 Quick Reference for Testing:");
        $this->command->info("   Member #1 → John Doe (Student)");
        $this->command->info("   Member #2 → Jane Smith (Student)");
        $this->command->info("   Member #3 → Mike Johnson (Faculty)");
        $this->command->info("   Member #4 → Sarah Williams (Student)");
        $this->command->info("   Member #5 → Tom Brown (Student)");
    }
}
