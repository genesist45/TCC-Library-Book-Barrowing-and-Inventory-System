import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import tccLogo from '@/assets/images/logos/tcc-logo.png';
import { User } from '@/types';

interface PublicHeaderProps {
    user?: User;
}

export default function PublicHeader({ user }: PublicHeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Consider scrolled if user scrolls more than 20px
            setIsScrolled(window.scrollY > 20);
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header 
            className={`fixed z-50 transition-all duration-500 ease-in-out ${
                isScrolled 
                    ? 'top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 rounded-xl sm:rounded-2xl bg-white/70 backdrop-blur-lg shadow-lg' 
                    : 'top-0 left-0 right-0 rounded-none bg-white/95 backdrop-blur-md shadow-sm'
            }`}
        >
            <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 sm:gap-3">
                    <img 
                        src={tccLogo} 
                        alt="TCC Logo" 
                        className="h-10 w-auto sm:h-12"
                    />
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-1.5 sm:gap-2">
                    {user ? (
                        <Link
                            href={route('dashboard')}
                            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-6 sm:py-2.5 sm:text-sm"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-6 sm:py-2.5 sm:text-sm"
                        >
                            Log in
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
