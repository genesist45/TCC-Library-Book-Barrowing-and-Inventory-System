import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Users, BookMarked } from "lucide-react";
import { StatCard, OpacStatsCard } from "@/components/dashboard";

interface MonthlyData {
    month: string;
    titles: number;
    members: number;
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
}

export default function Dashboard({ stats, opacStats }: DashboardProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
