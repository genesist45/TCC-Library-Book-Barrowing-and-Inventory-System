import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { DeleteUserForm } from '../Components/DeleteUserForm';
import { UpdatePasswordForm } from '../Components/UpdatePasswordForm';
import { UpdateProfileInformationForm } from '../Components/UpdateProfileInformationForm';
import { UpdateAppearanceForm } from '../Components/UpdateAppearanceForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow transition-colors duration-300 dark:bg-[#2a2a2a] sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="bg-white p-4 shadow transition-colors duration-300 dark:bg-[#2a2a2a] sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow transition-colors duration-300 dark:bg-[#2a2a2a] sm:rounded-lg sm:p-8">
                        <UpdateAppearanceForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow transition-colors duration-300 dark:bg-[#2a2a2a] sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
