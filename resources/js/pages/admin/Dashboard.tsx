import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Users, BookOpen, Library } from 'lucide-react';

interface DashboardProps {
    stats: {
        members: { total: number; previous: number };
        bookRequests: { total: number; previous: number };
        catalogItems: { total: number; previous: number };
    };
}

// Graph paths for different trends
const GRAPH_PATHS = {
    increasing: "M0 35 C 20 35, 40 10, 60 25 S 80 5, 100 0", // Ends at top (0)
    decreasing: "M0 5 C 20 5, 40 30, 60 15 S 80 35, 100 40", // Ends at bottom (40)
    neutral: "M0 20 C 20 25, 40 15, 60 25 S 80 15, 100 20",   // Stays middle
};

const StatCard = ({ title, value, previous, icon: Icon, color }: { title: string, value: number, previous: number, icon: any, color: string }) => {
    // Calculate trend
    const diff = value - previous;
    let percentage = '0';
    let isPositive = true;
    let trendLabel = '0%';

    if (previous > 0) {
        const pct = ((diff / previous) * 100);
        percentage = pct.toFixed(1);
        isPositive = diff >= 0;
        trendLabel = `${isPositive ? '+' : ''}${percentage}%`;
    } else if (value > 0) {
        // If previous is 0 but we have values now, it's technically 100% new, 
        // but mathematically undefined growth. User requested "valid percentage".
        // We'll show "N/A" to indicate no previous data to compare against.
        percentage = '100'; // Keep for graph logic (upward trend)
        isPositive = true;
        trendLabel = 'N/A';
    } else {
        // Both are 0
        percentage = '0';
        isPositive = true;
        trendLabel = '0%';
    }

    // Select graph path based on trend
    let pathData = GRAPH_PATHS.neutral;
    if (parseFloat(percentage) > 5) pathData = GRAPH_PATHS.increasing;
    if (parseFloat(percentage) < -5) pathData = GRAPH_PATHS.decreasing;

    return (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
                    <div className={`mt-2 flex items-center text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        <span className="font-medium">{trendLabel}</span>
                        <span className="ml-1 text-gray-500 dark:text-gray-400">last month</span>
                    </div>
                </div>
                <div className={`rounded-lg p-2 ${color} bg-opacity-10 dark:bg-opacity-20`}>
                    <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>

            {/* SVG Sparkline */}
            <div className="absolute bottom-0 right-0 h-16 w-32 opacity-20">
                <svg viewBox="0 0 100 40" className="h-full w-full" preserveAspectRatio="none">
                    <path
                        d={pathData}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={color.replace('bg-', 'text-')}
                    />
                    <path
                        d={`${pathData} V 40 H 0 Z`}
                        fill="currentColor"
                        className={color.replace('bg-', 'text-')}
                        fillOpacity="0.2"
                    />
                </svg>
            </div>
        </div>
    );
};

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Analytics Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <StatCard
                            title="Total Members"
                            value={stats.members.total}
                            previous={stats.members.previous}
                            icon={Users}
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="Total Book Requests"
                            value={stats.bookRequests.total}
                            previous={stats.bookRequests.previous}
                            icon={BookOpen}
                            color="bg-purple-500"
                        />
                        <StatCard
                            title="Total Catalog Items"
                            value={stats.catalogItems.total}
                            previous={stats.catalogItems.previous}
                            icon={Library}
                            color="bg-emerald-500"
                        />
                    </div>

                    {/* Placeholder for future content */}
                    <div className="mt-8 h-[400px] overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">
                            <p>Additional analytics coming soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
