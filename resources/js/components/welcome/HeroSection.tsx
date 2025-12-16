import { Link } from '@inertiajs/react';
import { User } from '@/types';
import { ArrowRight, BookOpen, Search, Users, Library, Star, CheckCircle } from 'lucide-react';

interface HeroSectionProps {
    user: User | null;
}

export default function HeroSection({ user }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            {/* Background decorative elements */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute right-1/4 top-20 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />
                <div className="absolute right-10 top-1/3 h-48 w-48 rounded-full bg-indigo-100/40 blur-2xl" />
                <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-100/30 blur-3xl" />
                {/* Floating star decorations */}
                <Star className="absolute right-1/3 top-32 h-6 w-6 text-blue-400/40 animate-pulse" />
                <Star className="absolute right-1/4 top-1/4 h-4 w-4 text-indigo-400/50" />
            </div>

            <div className="container relative mx-auto px-4 pt-32 pb-20 sm:px-6 lg:px-12">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left Content */}
                    <div className="max-w-xl">
                        {/* Badge */}
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-2 backdrop-blur-sm">
                            <Library className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">
                                Tagoloan Community College Library
                            </span>
                            <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>

                        {/* Main Headline */}
                        <h1 className="mb-6 font-jakarta text-4xl font-black tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                            <span className="block">Discover.</span>
                            <span className="block">Borrow.</span>
                            <span className="relative inline-block text-blue-600">
                                Learn.
                                <svg
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 200 12"
                                    fill="none"
                                >
                                    <path
                                        d="M2 8.5C40 3 80 2 100 4C130 6 170 8 198 3"
                                        stroke="#3B82F6"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        className="opacity-30"
                                    />
                                </svg>
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mb-8 max-w-lg text-lg text-gray-600 sm:text-xl">
                            Access our extensive collection of books, journals, and resources —
                            <span className="font-medium text-gray-700"> streamlined borrowing, powerful search, seamless experience.</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href="#catalogs-section"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('catalogs-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Browse Catalog
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-2 text-base font-semibold text-gray-700 transition-colors hover:text-blue-600"
                            >
                                Learn More
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span>Free to use</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span>Easy borrowing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span>1000+ Resources</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Floating Mockups */}
                    <div className="relative hidden lg:block">
                        {/* Main mockup card */}
                        <div className="relative z-10 rounded-2xl border border-gray-200/60 bg-white p-6 shadow-2xl shadow-gray-200/50">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-400" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                    <div className="h-3 w-3 rounded-full bg-green-400" />
                                </div>
                                <span className="text-xs font-medium text-gray-400">Library Catalog</span>
                            </div>

                            {/* Search bar mockup */}
                            <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
                                <Search className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-400">Search for books, journals...</span>
                            </div>

                            {/* Book cards mockup */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                                    <div className="flex h-14 w-10 items-center justify-center rounded bg-blue-500 text-white">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">Introduction to Computing</p>
                                        <p className="text-xs text-gray-500">Computer Science • Available</p>
                                    </div>
                                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">3 copies</span>
                                </div>

                                <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                                    <div className="flex h-14 w-10 items-center justify-center rounded bg-purple-500 text-white">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">Philippine Literature</p>
                                        <p className="text-xs text-gray-500">Literature • Borrowed</p>
                                    </div>
                                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">Due: Dec 20</span>
                                </div>

                                <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
                                    <div className="flex h-14 w-10 items-center justify-center rounded bg-emerald-500 text-white">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">Fundamentals of Accounting</p>
                                        <p className="text-xs text-gray-500">Business • Available</p>
                                    </div>
                                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">5 copies</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating stats card - top right */}
                        <div className="absolute -right-4 top-0 z-20 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-100 p-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">500+</p>
                                    <p className="text-xs text-gray-500">Active Members</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating notification card - bottom right */}
                        <div className="absolute -bottom-4 -right-8 z-20 w-64 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-green-100 p-1.5">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">Book Borrowed Successfully!</p>
                                    <p className="text-xs text-gray-500">Return by December 25, 2024</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating search result - left side */}
                        <div className="absolute -left-12 top-1/3 z-20 w-56 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                            <div className="mb-2 flex items-center gap-2">
                                <Search className="h-4 w-4 text-blue-500" />
                                <span className="text-xs font-medium text-gray-600">Quick Search</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                                    <div className="h-8 w-6 rounded bg-indigo-400" />
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-700">Research Methods</p>
                                        <p className="text-[10px] text-gray-400">2 copies available</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                                    <div className="h-8 w-6 rounded bg-rose-400" />
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-700">Data Structures</p>
                                        <p className="text-[10px] text-gray-400">5 copies available</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom wave decoration */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 100"
                    fill="none"
                    className="w-full text-white"
                >
                    <path
                        d="M0 50L48 45.8C96 41.7 192 33.3 288 35.2C384 37 480 49 576 54.2C672 59.3 768 57.7 864 52.5C960 47.3 1056 38.7 1152 38.3C1248 38 1344 46 1392 50L1440 54V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
                        fill="currentColor"
                    />
                </svg>
            </div>
        </section>
    );
}
