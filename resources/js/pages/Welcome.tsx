import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import PublicHeader from '@/components/common/PublicHeader';
import ScrollToTop from '@/components/common/ScrollToTop';

export default function Welcome({
    auth,
}: PageProps) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-jakarta">
                {/* Header */}
                <PublicHeader user={auth.user} />

                {/* Main Content */}
                <main className="container mx-auto flex min-h-screen items-center px-4 pt-13 sm:px-6 lg:px-12">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                            Welcome to the
                        </h2>
                        <h3 className="mt-2 text-2xl font-bold text-indigo-600 sm:mt-3 sm:text-3xl md:text-4xl lg:text-5xl">
                            Library Management System
                        </h3>
                        <p className="mt-4 max-w-2xl text-base text-gray-600 sm:mt-6 sm:text-lg">
                            Manage your library's book borrowing and inventory with ease.
                            Sign in to access the system or register for a new account.
                        </p>
                        
                        {!auth.user && (
                            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                                <Link
                                    href={route('login')}
                                    className="rounded-lg bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-8 sm:text-base"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:px-8 sm:text-base"
                                >
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </div>
                </main>

                {/* Placeholder Cards Section */}
                <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-20">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Card 1 */}
                        <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg">
                            <div className="mb-4 h-48 rounded-md bg-gray-200"></div>
                            <div className="space-y-3">
                                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                                <div className="h-3 w-full rounded bg-gray-100"></div>
                                <div className="h-3 w-5/6 rounded bg-gray-100"></div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg">
                            <div className="mb-4 h-48 rounded-md bg-gray-200"></div>
                            <div className="space-y-3">
                                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                                <div className="h-3 w-full rounded bg-gray-100"></div>
                                <div className="h-3 w-5/6 rounded bg-gray-100"></div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg">
                            <div className="mb-4 h-48 rounded-md bg-gray-200"></div>
                            <div className="space-y-3">
                                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                                <div className="h-3 w-full rounded bg-gray-100"></div>
                                <div className="h-3 w-5/6 rounded bg-gray-100"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Scroll to Top Button with Progress */}
                <ScrollToTop />
            </div>
        </>
    );
}
