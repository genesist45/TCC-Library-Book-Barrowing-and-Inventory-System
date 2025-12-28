import { Library, CheckCircle, BookOpen, ClipboardList } from 'lucide-react';
import type { CatalogSummary, BooksByType } from '../types/catalogReports.d';

interface SummaryCardsProps {
    summary: CatalogSummary;
}

/**
 * Formats books by type data for display
 */
function formatBooksByType(booksByType: BooksByType): string {
    if (!booksByType || Object.keys(booksByType).length === 0) {
        return 'No data';
    }
    return Object.entries(booksByType)
        .map(([type, count]) => `${type}: ${count}`)
        .join(', ');
}

/**
 * Summary cards component displaying key statistics
 */
export function SummaryCards({ summary }: SummaryCardsProps) {
    const cards = [
        {
            title: 'Total Books in Library',
            value: summary.totalBooks.toLocaleString(),
            icon: Library,
            iconBgClass: 'bg-blue-100 dark:bg-blue-900/30',
            iconClass: 'text-blue-600 dark:text-blue-400',
            isLargeText: true,
        },
        {
            title: 'Available Copies',
            value: summary.availableCopies.toLocaleString(),
            icon: CheckCircle,
            iconBgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
            iconClass: 'text-emerald-600 dark:text-emerald-400',
            isLargeText: true,
        },
        {
            title: 'Currently Borrowed',
            value: summary.borrowedBooks.toLocaleString(),
            icon: BookOpen,
            iconBgClass: 'bg-amber-100 dark:bg-amber-900/30',
            iconClass: 'text-amber-600 dark:text-amber-400',
            isLargeText: true,
        },
        {
            title: 'Books by Type',
            value: formatBooksByType(summary.booksByType),
            icon: ClipboardList,
            iconBgClass: 'bg-purple-100 dark:bg-purple-900/30',
            iconClass: 'text-purple-600 dark:text-purple-400',
            isLargeText: false,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]"
                >
                    <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.iconBgClass}`}>
                            <card.icon className={`h-6 w-6 ${card.iconClass}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`font-bold text-gray-900 dark:text-white ${card.isLargeText ? 'text-3xl' : 'text-lg'
                                }`}>
                                {card.value}
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                                {card.title}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
