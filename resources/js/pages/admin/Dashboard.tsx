import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Users, BookMarked, Book, UserCheck } from "lucide-react";
import {
    StatCard,
    NewArrivalsCard,
    CheckoutsCard,
    ComparisonChart,
} from "@/components/dashboard";
import { PageProps } from "@/types";

interface Author {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface NewArrivalItem {
    id: number;
    title: string;
    accession_no?: string;
    isbn?: string;
    isbn13?: string;
    cover_image?: string;
    type?: string;
    created_at: string;
    authors?: Author[];
    category?: Category;
}

interface CheckoutItem {
    id: number;
    member_id: number;
    member_name: string;
    member_no: string;
    catalog_item_id: number;
    book_title: string;
    cover_image?: string;
    accession_no?: string;
    due_date: string;
    date_borrowed: string;
    is_overdue: boolean;
}

interface PeriodData {
    current: number;
    previous: number;
}

interface GraphDataPoint {
    label: string;
    date: string;
    value: number;
}

interface FullPeriodData {
    current: number;
    previous: number;
    graphData: GraphDataPoint[];
}

interface StatData {
    total: number;
    periodData: {
        current: FullPeriodData;
        day: FullPeriodData;
        week: FullPeriodData;
        month: FullPeriodData;
        year: FullPeriodData;
    };
}

interface ChartDataPoint {
    label: string;
    titles: number;
    members: number;
    checkouts: number;
}

interface DashboardProps {
    stats: {
        titles: StatData;
        members: StatData;
        checkouts: StatData;
        users: StatData;
    };
    newArrivals: NewArrivalItem[];
    activeCheckouts: CheckoutItem[];
    comparisonChartData?: ChartDataPoint[];
}

export default function Dashboard({
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
                        {/* Titles Card */}
                        <StatCard
                            title="Total Titles"
                            value={stats.titles.total}
                            periodData={stats.titles.periodData}
                            icon={Book}
                            color="bg-teal-500"
                            defaultPeriod="current"
                        />
                        {/* Members Card */}
                        <StatCard
                            title="Total Members"
                            value={stats.members.total}
                            periodData={stats.members.periodData}
                            icon={UserCheck}
                            color="bg-amber-500"
                            defaultPeriod="current"
                        />
                        {/* Checkouts Card */}
                        <StatCard
                            title="Total Checkouts"
                            value={stats.checkouts.total}
                            periodData={stats.checkouts.periodData}
                            icon={BookMarked}
                            color="bg-purple-500"
                            defaultPeriod="current"
                        />
                        {/* Only show Total Users card for Admin users */}
                        {isAdmin && (
                            <StatCard
                                title="Total Users"
                                value={stats.users.total}
                                periodData={stats.users.periodData}
                                icon={Users}
                                color="bg-emerald-500"
                                defaultPeriod="current"
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
