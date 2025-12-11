import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Users, BookMarked } from "lucide-react";
import {
    StatCard,
    OpacStatsCard,
    NewArrivalsCard,
    CheckoutsCard,
} from "@/components/dashboard";

interface MonthlyData {
    month: string;
    titles: number;
    members: number;
}

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
    accession_no: string;
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
    accession_no: string;
    due_date: string;
    date_borrowed: string;
    is_overdue: boolean;
}

interface DashboardProps {
    stats: {
        members: { total: number; previous: number };
        checkouts: { total: number; previous: number };
        users: { total: number; previous: number };
    };
    opacStats: {
        titles: number;
        members: number;
        monthlyData: MonthlyData[];
    };
    newArrivals: NewArrivalItem[];
    activeCheckouts: CheckoutItem[];
}

export default function Dashboard({
    stats,
    opacStats,
    newArrivals,
    activeCheckouts,
}: DashboardProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <OpacStatsCard
                            titles={opacStats.titles}
                            members={opacStats.members}
                            monthlyData={opacStats.monthlyData}
                        />
                        <StatCard
                            title="Total Checkouts"
                            value={stats.checkouts.total}
                            previous={stats.checkouts.previous}
                            icon={BookMarked}
                            color="bg-purple-500"
                        />
                        <StatCard
                            title="Total Users"
                            value={stats.users.total}
                            previous={stats.users.previous}
                            icon={Users}
                            color="bg-emerald-500"
                        />
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
