import { Link } from '@inertiajs/react';
import { User } from '@/types';

interface HeroSectionProps {
    user: User | null;
}

export default function HeroSection({ user }: HeroSectionProps) {
    return (
        <main className="container mx-auto flex min-h-screen items-center px-4 pt-20 pb-16 sm:px-6 lg:px-12">
            <div className="w-full max-w-4xl">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                    Welcome to the
                </h2>
                <h3 className="mt-2 text-2xl font-bold text-indigo-600 sm:mt-3 sm:text-3xl md:text-4xl lg:text-5xl">
                    Library Management System
                </h3>
                <p className="mt-4 max-w-2xl text-base text-gray-600 sm:mt-6 sm:text-lg">
                    Discover and borrow from our extensive collection of books. Your next adventure awaits in our library.
                </p>

                {!user && (
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
    );
}
