import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Publishers() {
    return (
        <AuthenticatedLayout>
            <Head title="Publishers" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Publishers</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            This page is under construction. Publisher management will be available soon.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
