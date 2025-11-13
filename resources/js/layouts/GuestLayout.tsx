import ApplicationLogo from '@/components/common/ApplicationLogo';
import PublicHeader from '@/components/common/PublicHeader';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    const { auth } = usePage().props;

    // Force light mode for authentication pages
    useEffect(() => {
        // Remove dark class from html element
        document.documentElement.classList.remove('dark');
        
        // Cleanup: restore the user's theme preference when leaving
        return () => {
            const theme = localStorage.getItem('theme') || 'light';
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Public Header */}
            <PublicHeader user={auth.user} />

            {/* Main Content */}
            <div className="flex min-h-screen flex-col items-center px-4 pt-40 sm:px-6">
                <div className="w-full overflow-hidden bg-white px-8 py-10 shadow-xl sm:max-w-md sm:rounded-2xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
