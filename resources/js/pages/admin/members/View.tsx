import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Member } from '@/types';
import { Pencil } from 'lucide-react';
import PrimaryButton from '@/components/buttons/PrimaryButton';

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
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                                        Member Number
                                    </label>
                                    <p className="mt-1.5 text-base text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                        {member.member_no}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                                        Full Name
                                    </label>
                                    <p className="mt-1.5 text-base text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                        {member.name}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                                        Member Type
                                    </label>
                                    <p className="mt-1.5">
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                                            member.type === 'Privileged'
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                        }`}>
                                            {member.type}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                                        Status
                                    </label>
                                    <p className="mt-1.5">
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                                            member.status === 'Active'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                : member.status === 'Suspended'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                        }`}>
                                            {member.status}
                                        </span>
                                    </p>
                                </div>

                                {member.email && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                                            Email
                                        </label>
                                        <p className="mt-1.5 text-base text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                            {member.email}
                                        </p>
                                    </div>
                                )}

                                {member.phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                                            Phone Number
                                        </label>
                                        <p className="mt-1.5 text-base text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                            {member.phone}
                                        </p>
                                    </div>
                                )}

                                {member.member_group && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                                            Member Group
                                        </label>
                                        <p className="mt-1.5 text-base text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                            {member.member_group}
                                        </p>
                                    </div>
                                )}

                                {member.booking_quota !== null && member.booking_quota !== undefined && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                                            Booking Quota
                                        </label>
                                        <p className="mt-1.5 text-base text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                            {member.booking_quota}
                                        </p>
                                    </div>
                                )}

                                {member.address && (
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                                            Address
                                        </label>
                                        <p className="mt-1.5 text-base text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                            {member.address}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                                        Login Access
                                    </label>
                                    <p className="mt-1.5">
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                                            member.allow_login
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                        }`}>
                                            {member.allow_login ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                                        Joined Date
                                    </label>
                                    <p className="mt-1.5 text-base text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                        {new Date(member.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
