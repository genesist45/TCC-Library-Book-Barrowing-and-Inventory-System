import { AlertTriangle, Users, Clock, CheckCircle } from 'lucide-react';
import type { OverdueSummary } from '../../types/overdueReports.d';

interface OverdueSummaryCardsProps {
    data: OverdueSummary;
}

/**
 * Summary cards component for Overdue Reports
 * Displays 3 key metrics with ALERT-themed coloring
 * 
 * Note: These cards always use red/orange colors because they represent
 * alert/problem-tracking metrics, regardless of current values.
 * The color represents the METRIC TYPE (alerts), not the current state.
 */
export function OverdueSummaryCards({ data }: OverdueSummaryCardsProps) {
    const hasOverdue = data.totalOverdueBooks > 0;

    // Alert-themed cards - always use red/orange backgrounds
    // because this page tracks problems/alerts
    const cards = [
        {
            title: 'Total Overdue Books',
            value: data.totalOverdueBooks,
            icon: AlertTriangle,
            // Always use red theme - this is an alert metric
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            iconColor: 'text-red-600 dark:text-red-400',
            valueColor: hasOverdue
                ? 'text-red-700 dark:text-red-400'
                : 'text-gray-900 dark:text-white',
        },
        {
            title: 'Members with Overdue',
            value: data.membersWithOverdue,
            icon: Users,
            // Always use orange theme - this is an alert metric
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            iconColor: 'text-orange-600 dark:text-orange-400',
            valueColor: hasOverdue
                ? 'text-orange-700 dark:text-orange-400'
                : 'text-gray-900 dark:text-white',
        },
        {
            title: 'Average Days Overdue',
            value: `${data.avgDaysOverdue} days`,
            icon: Clock,
            // Always use amber/red theme - this is an alert metric
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
            iconColor: 'text-amber-600 dark:text-amber-400',
            valueColor: hasOverdue
                ? 'text-amber-700 dark:text-amber-400'
                : 'text-gray-900 dark:text-white',
        },
    ];

    return (
        <div className="mb-6">
            {/* Success banner when no overdue - remove party emoji, use checkmark icon */}
            {!hasOverdue && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-100 px-4 py-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Excellent! No overdue books at this time. All loans are current!</span>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]"
                    >
                        <div className={`rounded-xl p-3 ${card.bgColor}`}>
                            <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${card.valueColor}`}>
                                {card.value}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {card.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
