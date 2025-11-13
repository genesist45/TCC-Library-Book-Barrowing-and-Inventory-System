import { Link } from '@inertiajs/react';
import { ChevronRight, LayoutDashboard } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    showHome?: boolean;
}

export default function Breadcrumbs({ items, showHome = true }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center space-x-1 text-sm" aria-label="Breadcrumb">
            {/* Dashboard icon */}
            {showHome && (
                <>
                    <Link
                        href={route('dashboard')}
                        className="flex items-center text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <LayoutDashboard size={16} />
                    </Link>
                    {items.length > 0 && (
                        <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
                    )}
                </>
            )}

            {/* Breadcrumb items */}
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isActive = item.active || isLast;

                return (
                    <div key={index} className="flex items-center space-x-1">
                        {item.href && !isActive ? (
                            <Link
                                href={item.href}
                                className="font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={
                                    isActive
                                        ? 'font-semibold text-gray-900 dark:text-gray-100'
                                        : 'font-medium text-gray-500 dark:text-gray-400'
                                }
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {item.label}
                            </span>
                        )}
                        {!isLast && <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />}
                    </div>
                );
            })}
        </nav>
    );
}

