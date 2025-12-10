import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Member } from '@/types';
import { Pencil } from 'lucide-react';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { MemberDetailsGrid } from '@/components/members/view-sections';

interface ViewMemberProps {
    member: Member;
}

export default function ViewMember({ member }: ViewMemberProps) {
    return (
        <AuthenticatedLayout>
            <Head title={`View Member - ${member.name}`} />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-end">
                        <Link href={route('admin.members.edit', member.id)}>
                            <PrimaryButton className="flex items-center gap-2">
                                <Pencil className="h-4 w-4" />
                                Edit Member
                            </PrimaryButton>
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                            <h2 className="text-xl font-semibold text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                Member Details
                            </h2>
                        </div>

                        <div className="p-6">
                            <MemberDetailsGrid member={member} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
