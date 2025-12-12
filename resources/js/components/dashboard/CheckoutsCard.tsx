import { Link } from "@inertiajs/react";
import { BookCheck, ExternalLink, BookOpen, Clock, User } from "lucide-react";

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

interface CheckoutsCardProps {
    items: CheckoutItem[];
}

export default function CheckoutsCard({ items }: CheckoutsCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const getDaysRemaining = (dueDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatusText = (dueDate: string, isOverdue: boolean) => {
        const daysRemaining = getDaysRemaining(dueDate);

        if (isOverdue || daysRemaining < 0) {
            const daysOverdue = Math.abs(daysRemaining);
            return {
                text: `${daysOverdue} day${daysOverdue !== 1 ? "s" : ""} overdue`,
                className: "text-gray-400 dark:text-gray-500",
            };
        }

        if (daysRemaining === 0) {
            return {
                text: "Due today",
                className: "text-gray-400 dark:text-gray-500",
            };
        }

        if (daysRemaining <= 2) {
            return {
                text: `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} left`,
                className: "text-gray-400 dark:text-gray-500",
            };
        }

        return {
            text: `${daysRemaining} days left`,
            className: "text-gray-400 dark:text-gray-500",
        };
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-[#3a3a3a]">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-500 bg-opacity-10 p-1.5 dark:bg-opacity-20">
                        <BookCheck className="h-4 w-4 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        Active Checkouts
                    </h3>
                    {items.length > 0 && (
                        <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {items.length}
                        </span>
                    )}
                </div>
                <Link
                    href={route("admin.book-requests.index")}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
                >
                    View All
                    <ExternalLink className="h-3 w-3" />
                </Link>
            </div>

            {/* Content */}
            <div className="max-h-[320px] overflow-y-auto">
                {items.length > 0 ? (
                    <ul className="divide-y divide-gray-100 dark:divide-[#3a3a3a]">
                        {items.map((item) => {
                            const status = getStatusText(
                                item.due_date,
                                item.is_overdue,
                            );

                            return (
                                <li key={item.id}>
                                    <Link
                                        href={route(
                                            "admin.book-requests.show",
                                            item.id,
                                        )}
                                        className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-[#3a3a3a]"
                                    >
                                        {/* Book Cover */}
                                        <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
                                            {item.cover_image ? (
                                                <img
                                                    src={`/storage/${item.cover_image}`}
                                                    alt={item.book_title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <BookOpen className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Book Info */}
                                        <div className="min-w-0 flex-1">
                                            <h4
                                                className="truncate text-sm font-medium text-gray-900 dark:text-white"
                                                title={item.book_title}
                                            >
                                                {item.book_title}
                                            </h4>
                                            <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                <User className="h-3 w-3" />
                                                <span className="truncate">
                                                    {item.member_name}
                                                </span>
                                            </div>
                                            <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                    Due:{" "}
                                                    {formatDate(item.due_date)}
                                                </span>
                                            </div>
                                            {/* Status Text at Bottom Left */}
                                            <p
                                                className={`mt-1 text-xs font-medium ${status.className}`}
                                            >
                                                {status.text}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                        <BookCheck className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            No active checkouts
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
