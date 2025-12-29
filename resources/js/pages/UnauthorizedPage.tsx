import { Head, Link, usePage } from "@inertiajs/react";
import { ShieldX, Home, ArrowLeft, LogIn } from "lucide-react";
import { motion } from "framer-motion";

interface UnauthorizedProps {
    status?: number;
    message?: string;
}

/**
 * 403 Unauthorized Error Page
 * Displays when user tries to access a resource they don't have permission for
 */
export default function UnauthorizedPage({
    status = 403,
    message = "You don't have permission to access this resource.",
}: UnauthorizedProps) {
    const { auth } = usePage().props;
    const isAuthenticated = !!(auth as any)?.user;

    return (
        <>
            <Head title="Access Denied" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center px-4 py-12">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-40" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-40" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-lg w-full"
                >
                    {/* Main card */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                        {/* Header gradient */}
                        <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />

                        <div className="p-8 sm:p-12 text-center">
                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.2,
                                    type: "spring",
                                    stiffness: 200,
                                }}
                                className="mx-auto mb-8 relative"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
                                    <ShieldX className="w-12 h-12 text-red-500" />
                                </div>
                                {/* Pulse effect */}
                                <div className="absolute inset-0 animate-ping">
                                    <div className="w-24 h-24 bg-red-200 rounded-full opacity-30 mx-auto" />
                                </div>
                            </motion.div>

                            {/* Status code */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mb-4"
                            >
                                <span className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                    {status}
                                </span>
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
                            >
                                Access Denied
                            </motion.h1>

                            {/* Message */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-gray-600 mb-8 max-w-sm mx-auto"
                            >
                                {message}
                            </motion.p>

                            {/* Action buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-3"
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
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:from-red-600 hover:to-orange-600 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-200 w-full sm:w-auto justify-center"
                                >
                                    <Home className="w-4 h-4" />
                                    Back to Home
                                </Link>
                            </motion.div>

                            {/* Login suggestion for unauthenticated users */}
                            {!isAuthenticated && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="mt-8 pt-6 border-t border-gray-200"
                                >
                                    <p className="text-sm text-gray-500 mb-3">
                                        Need to access this page?
                                    </p>
                                    <Link
                                        href={route("login")}
                                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Sign in to your account
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Footer text */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center text-gray-500 text-sm mt-6"
                    >
                        If you believe this is a mistake, please contact the
                        administrator.
                    </motion.p>
                </motion.div>
            </div>
        </>
    );
}
