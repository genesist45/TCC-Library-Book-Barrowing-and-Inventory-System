import { Head, Link } from "@inertiajs/react";
import { Search, Home, ArrowLeft, BookOpen, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface NotFoundProps {
    status?: number;
    message?: string;
}

/**
 * 404 Not Found Error Page
 * Displays when user navigates to a page that doesn't exist
 */
export default function NotFoundPage({
    status = 404,
    message = "The page you're looking for doesn't exist or has been moved.",
}: NotFoundProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to book search with query
            window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    // Quick links for navigation
    const quickLinks = [
        { href: "/", label: "Home", icon: Home },
        { href: "/books/search", label: "Browse Books", icon: BookOpen },
        { href: "/contact", label: "Get Help", icon: HelpCircle },
    ];

    return (
        <>
            <Head title="Page Not Found" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-20" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-xl w-full"
                >
                    {/* Main card */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                        {/* Header gradient */}
                        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />

                        <div className="p-8 sm:p-12 text-center">
                            {/* Animated 404 illustration */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    delay: 0.2,
                                    type: "spring",
                                    stiffness: 150,
                                }}
                                className="mb-8 relative"
                            >
                                {/* Main status code with floating animation */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="relative inline-block"
                                >
                                    <span className="text-[120px] sm:text-[150px] font-black leading-none bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent select-none">
                                        {status}
                                    </span>

                                    {/* Magnifying glass overlay */}
                                    <motion.div
                                        animate={{
                                            x: [0, 10, 0, -10, 0],
                                            y: [0, -5, 0, 5, 0],
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute -right-4 top-1/2 -translate-y-1/2"
                                    >
                                        <div className="w-16 h-16 bg-white/80 backdrop-blur rounded-full border-4 border-blue-400 flex items-center justify-center shadow-lg">
                                            <Search className="w-8 h-8 text-blue-500" />
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
                            >
                                Oops! Page Not Found
                            </motion.h1>

                            {/* Message */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-600 mb-8 max-w-sm mx-auto"
                            >
                                {message}
                            </motion.p>

                            {/* Search bar */}
                            <motion.form
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                onSubmit={handleSearch}
                                className="mb-8"
                            >
                                <div className="relative max-w-sm mx-auto">
                                    <input
                                        type="text"
                                        placeholder="Search for books..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full px-5 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-700"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        Search
                                    </button>
                                </div>
                            </motion.form>

                            {/* Action buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
                            >
                                <button
                                    onClick={() => window.history.back()}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 w-full sm:w-auto justify-center"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Go Back
                                </button>

                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 w-full sm:w-auto justify-center"
                                >
                                    <Home className="w-4 h-4" />
                                    Back to Home
                                </Link>
                            </motion.div>

                            {/* Quick links */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="pt-6 border-t border-gray-200"
                            >
                                <p className="text-sm text-gray-500 mb-4">
                                    Or try these quick links:
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    {quickLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                                        >
                                            <link.icon className="w-4 h-4" />
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Fun message */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center text-gray-500 text-sm mt-6"
                    >
                        Looks like this page went on vacation! 🏝️
                    </motion.p>
                </motion.div>
            </div>
        </>
    );
}
