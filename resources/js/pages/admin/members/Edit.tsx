import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import InputLabel from '@/components/forms/InputLabel';
import TextInput from '@/components/forms/TextInput';
import InputError from '@/components/forms/InputError';
import Checkbox from '@/components/forms/Checkbox';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { Member } from '@/types';
import { toast } from 'react-toastify';

interface EditMemberProps {
    member: Member;
}

export default function EditMember({ member }: EditMemberProps) {
    const { data, setData, patch, processing, errors, clearErrors } = useForm({
        member_no: member.member_no || '',
        name: member.name || '',
        type: member.type || 'Regular',
        status: member.status || 'Active',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        booking_quota: member.booking_quota || '',
        member_group: member.member_group || '',
        allow_login: member.allow_login ?? false,
    });

    const [showErrors, setShowErrors] = useState({
        member_no: true,
        name: true,
        type: true,
        status: true,
        email: true,
        phone: true,
        address: true,
        booking_quota: true,
        member_group: true,
        allow_login: true,
    });

    useEffect(() => {
        setData({
            member_no: member.member_no,
            name: member.name,
            type: member.type,
            status: member.status,
            email: member.email || '',
            phone: member.phone || '',
            address: member.address || '',
            booking_quota: member.booking_quota || '',
            member_group: member.member_group || '',
            allow_login: member.allow_login,
        });
    }, [member]);

    const handleChange = (field: keyof typeof data, value: string | boolean | number) => {
        setData(field, value as any);
        setShowErrors({ ...showErrors, [field]: false });
        if (errors[field]) {
            clearErrors(field);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        setShowErrors({
            member_no: true,
            name: true,
            type: true,
            status: true,
            email: true,
            phone: true,
            address: true,
            booking_quota: true,
            member_group: true,
            allow_login: true,
        });

        patch(route('admin.members.update', member.id), {
            onSuccess: () => {
                toast.success('Member updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update member');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Member - ${member.name}`} />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <form onSubmit={handleSubmit} className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                Edit Member
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                                Update the member information below
                            </p>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <InputLabel htmlFor="member_no" value="Member Number" required />
                                    <TextInput
                                        id="member_no"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.member_no}
                                        onChange={(e) => handleChange('member_no', e.target.value)}
                                        placeholder="e.g., MEM-2025-001"
                                    />
                                    <InputError message={showErrors.member_no ? errors.member_no : ''} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="name" value="Full Name" required />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="e.g., John Doe"
                                    />
                                    <InputError message={showErrors.name ? errors.name : ''} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="type" value="Member Type" required />
                                    <select
                                        id="type"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                        value={data.type}
                                        onChange={(e) => handleChange('type', e.target.value)}
                                    >
                                        <option value="Regular">Regular</option>
                                        <option value="Privileged">Privileged</option>
                                    </select>
                                    <InputError message={showErrors.type ? errors.type : ''} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Status" required />
                                    <select
                                        id="status"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                        value={data.status}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                    <InputError message={showErrors.status ? errors.status : ''} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        placeholder="member@example.com"
                                    />
                                    <InputError message={showErrors.email ? errors.email : ''} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="phone" value="Phone Number" />
                                    <TextInput
                                        id="phone"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        placeholder="+1234567890"
                                    />
                                    <InputError message={showErrors.phone ? errors.phone : ''} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="member_group" value="Member Group" />
                                    <TextInput
                                        id="member_group"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.member_group}
                                        onChange={(e) => handleChange('member_group', e.target.value)}
                                        placeholder="e.g., Students, Faculty"
                                    />
                                    <InputError message={showErrors.member_group ? errors.member_group : ''} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="booking_quota" value="Booking Quota" />
                                    <TextInput
                                        id="booking_quota"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.booking_quota}
                                        onChange={(e) => handleChange('booking_quota', e.target.value)}
                                        placeholder="e.g., 5"
                                        min="0"
                                    />
                                    <InputError message={showErrors.booking_quota ? errors.booking_quota : ''} className="mt-1" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="address" value="Address" />
                                <textarea
                                    id="address"
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                    value={data.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    placeholder="Member's address..."
                                />
                                <InputError message={showErrors.address ? errors.address : ''} className="mt-1" />
                            </div>

                            <div className="mt-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        checked={data.allow_login}
                                        onChange={(e) => handleChange('allow_login', e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                        Allow this member to login to the system
                                    </span>
                                </label>
                                <InputError message={showErrors.allow_login ? errors.allow_login : ''} className="mt-1" />
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <Link href={route('admin.members.index')}>
                                    <SecondaryButton type="button">
                                        Cancel
                                    </SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Update Member
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
