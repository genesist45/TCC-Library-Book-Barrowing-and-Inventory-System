import { Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import tccLogo from '@/assets/images/logos/tcc-logo-home.png';
import { User } from '@/types';
import { Menu, X, ChevronDown } from 'lucide-react';

interface PublicHeaderProps {
    user?: User;
    onCatalogsClick?: () => void;
}

export default function PublicHeader({ user, onCatalogsClick }: PublicHeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCatalogsClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);

        if (onCatalogsClick) {
            onCatalogsClick();
        } else {
            const catalogsSection = document.getElementById('catalogs-section');
            if (catalogsSection) {
                catalogsSection.scrollIntoView({ behavior: 'smooth' });
                // Update URL without reload to reflect section
                window.history.pushState(null, '', '#catalogs-section');
            } else {
                router.visit('/#catalogs-section');
            }
        }
    };

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Catalogs', href: '#catalogs-section', onClick: handleCatalogsClick },
        { name: 'Contact Us', href: '/contact' },
    ];

    return (
        <header
            className={`fixed left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'top-0 bg-gradient-to-r from-white via-pink-50/80 to-white backdrop-blur-md shadow-sm border-b border-pink-100/50'
                : 'top-0 bg-gradient-to-r from-transparent via-pink-50/30 to-transparent'
                }`}
        >
            <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-12">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <img
                        src={tccLogo}
                        alt="TCC Logo"
                        className="h-10 w-auto sm:h-11"
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        link.onClick ? (
                            <button
                                key={link.name}
                                onClick={link.onClick}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isScrolled
                                    ? 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                                    : 'text-gray-700 hover:bg-white/50 hover:text-blue-600'
                                    }`}
                            >
                                {link.name}
                            </button>
                        ) : (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isScrolled
                                    ? 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                                    : 'text-gray-700 hover:bg-white/50 hover:text-blue-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                </nav>

                {/* Right side - Login button and mobile menu */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <Link
                            href={route('dashboard')}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Staff Portal
                        </Link>
                    )}

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`rounded-lg p-2 transition-colors md:hidden ${isScrolled
                            ? 'text-gray-600 hover:bg-gray-100'
                            : 'text-gray-600 hover:bg-white/50'
                            }`}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`overflow-hidden transition-all duration-300 md:hidden ${isMobileMenuOpen ? 'max-h-64' : 'max-h-0'
                }`}>
                <div className="border-t border-gray-100 bg-white/95 backdrop-blur-md">
                    <nav className="container mx-auto px-4 py-4">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                link.onClick ? (
                                    <button
                                        key={link.name}
                                        onClick={link.onClick}
                                        className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
                                    >
                                        {link.name}
                                    </button>
                                ) : (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
