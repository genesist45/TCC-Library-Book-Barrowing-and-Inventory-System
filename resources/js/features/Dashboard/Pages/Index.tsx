import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Users, BookMarked, Book, UserCheck } from "lucide-react";
import {
    StatCard,
    NewArrivalsCard,
    CheckoutsCard,
    ComparisonChart,
} from "../Components";
import { PageProps } from "@/types";
import type { DashboardProps, ChartDataPoint } from "../types/dashboard";

export default function Index({
    stats,
    newArrivals,
    activeCheckouts,
    comparisonChartData,
}: DashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth.user.role === "admin";

    // Generate chart data from stats if not provided by backend
    const chartData: ChartDataPoint[] = comparisonChartData || (() => {
        // Use the month graphData from stats to generate comparison data
        const titlesData = stats.titles.periodData.month.graphData || [];
        const membersData = stats.members.periodData.month.graphData || [];
        const checkoutsData = stats.checkouts.periodData.month.graphData || [];

        // Create a map to combine data by label
        const dataMap = new Map<string, ChartDataPoint>();

        titlesData.forEach((point) => {
            if (!dataMap.has(point.label)) {
                dataMap.set(point.label, {
                    label: point.label,
                    titles: 0,
                    members: 0,
                    checkouts: 0,
                });
            }
            dataMap.get(point.label)!.titles = point.value;
        });

        membersData.forEach((point) => {
            if (!dataMap.has(point.label)) {
                dataMap.set(point.label, {
                    label: point.label,
                    titles: 0,
                    members: 0,
                    checkouts: 0,
                });
            }
            dataMap.get(point.label)!.members = point.value;
        });

        checkoutsData.forEach((point) => {
            if (!dataMap.has(point.label)) {
                dataMap.set(point.label, {
                    label: point.label,
                    titles: 0,
                    members: 0,
                    checkouts: 0,
                });
            }
            dataMap.get(point.label)!.checkouts = point.value;
        });

        return Array.from(dataMap.values());
    })();

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Stats Row - 4 cards for Admin, 3 cards for Staff */}
                    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                        <StatCard
                            title="Total Titles"
                            value={stats.titles.total}
                            icon={Book}
                            color="bg-teal-500"
                            viewAllHref={route('admin.catalog-items.index')}
                        />
                        {/* Members Card */}
                        <StatCard
                            title="Total Members"
                            value={stats.members.total}
                            icon={UserCheck}
                            color="bg-amber-500"
                            viewAllHref={route('admin.members.index')}
                        />
                        {/* Checkouts Card */}
                        <StatCard
                            title="Total Checkouts"
                            value={stats.checkouts.total}
                            icon={BookMarked}
                            color="bg-purple-500"
                            viewAllHref={route('admin.book-requests.index')}
                        />
                        {/* Only show Total Users card for Admin users */}
                        {isAdmin && (
                            <StatCard
                                title="Total Users"
                                value={stats.users.total}
                                icon={Users}
                                color="bg-emerald-500"
                                viewAllHref={route('users.index')}
                            />
                        )}
                    </div>

                    {/* Comparison Chart - Full Width */}
                    {chartData.length > 0 && (
                        <div className="mt-6">
                            <ComparisonChart data={chartData} />
                        </div>
                    )}

                    {/* New Arrivals and Checkouts Row */}
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <NewArrivalsCard items={newArrivals} />
                        <CheckoutsCard items={activeCheckouts} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
