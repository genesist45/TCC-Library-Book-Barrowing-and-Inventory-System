import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Staff Dashboard" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Analytics Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Card 1 */}
                        <div className="h-32 overflow-hidden rounded-xl border border-gray-200 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.03)_10px,rgba(0,0,0,0.03)_20px)] shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]"></div>

                        {/* Card 2 */}
                        <div className="h-32 overflow-hidden rounded-xl border border-gray-200 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.03)_10px,rgba(0,0,0,0.03)_20px)] shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]"></div>

                        {/* Card 3 */}
                        <div className="h-32 overflow-hidden rounded-xl border border-gray-200 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.03)_10px,rgba(0,0,0,0.03)_20px)] shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]"></div>
                    </div>

                    {/* Activity Section */}
                    <div className="mb-6 h-[400px] overflow-hidden rounded-xl border border-gray-200 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.03)_10px,rgba(0,0,0,0.03)_20px)] shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]"></div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

