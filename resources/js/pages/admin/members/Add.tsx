import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { toast } from 'react-toastify';
import {
    BasicInfoSection,
    BorrowerDetailsSection,
    ContactInfoSection,
    AddressSection,
} from '@/components/members/form-sections';

export default function AddMember() {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        member_no: '',
        name: '',
        type: 'Regular',
        borrower_category: '',
        status: 'Active',
        email: '',
        phone: '',
        address: '',
        booking_quota: '',
        member_group: '',
        allow_login: false,
    });

    const [showErrors, setShowErrors] = useState({
        member_no: true,
        name: true,
        type: true,
        borrower_category: true,
        status: true,
        email: true,
        phone: true,
        address: true,
        booking_quota: true,
        member_group: true,
        allow_login: true,
    });

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
            borrower_category: true,
            status: true,
            email: true,
            phone: true,
            address: true,
            booking_quota: true,
            member_group: true,
            allow_login: true,
        });

        post(route('admin.members.store'), {
            onSuccess: () => {
                toast.success('Member added successfully!');
            },
            onError: () => {
                toast.error('Failed to add member');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Member" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <form onSubmit={handleSubmit} className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                Add New Member
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                                Fill in the information below to create a new member
                            </p>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <BasicInfoSection
                                    data={data}
                                    errors={errors}
                                    showErrors={showErrors}
                                    onDataChange={handleChange}
                                />
                                <BorrowerDetailsSection
                                    data={data}
                                    errors={errors}
                                    showErrors={showErrors}
                                    onDataChange={handleChange}
                                />
                                <ContactInfoSection
                                    data={data}
                                    errors={errors}
                                    showErrors={showErrors}
                                    onDataChange={handleChange}
                                />
                            </div>

                            <AddressSection
                                data={data}
                                errors={errors}
                                showErrors={showErrors}
                                onDataChange={handleChange}
                            />



                            <div className="mt-6 flex justify-end gap-3">
                                <Link href={route('admin.members.index')}>
                                    <SecondaryButton type="button">
                                        Cancel
                                    </SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Add Member
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
