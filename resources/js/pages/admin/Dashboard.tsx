import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Users, BookMarked, Book, UserCheck } from "lucide-react";
import {
    StatCard,
    NewArrivalsCard,
    CheckoutsCard,
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

interface DashboardProps {
    stats: {
        titles: StatData;
        members: StatData;
        checkouts: StatData;
        users: StatData;
    };
    newArrivals: NewArrivalItem[];
    activeCheckouts: CheckoutItem[];
}

export default function Dashboard({
    stats,
    newArrivals,
    activeCheckouts,
}: DashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth.user.role === "admin";

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
