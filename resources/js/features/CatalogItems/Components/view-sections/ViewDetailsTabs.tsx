import { ReactNode } from "react";
import {
    Info,
    FileText,
    BookOpen,
    GraduationCap,
    Copy,
    History,
} from "lucide-react";

export type ViewTabType =
    | "item-info"
    | "detail"
    | "journal"
    | "thesis"
    | "related-copies"
    | "borrow-history";

interface Tab {
    id: ViewTabType;
    label: string;
    icon: typeof Info;
}

const TABS: Tab[] = [
    { id: "item-info", label: "ITEM INFO", icon: Info },
    { id: "detail", label: "DETAIL", icon: FileText },
    { id: "journal", label: "JOURNAL", icon: BookOpen },
    { id: "thesis", label: "THESIS", icon: GraduationCap },
    { id: "related-copies", label: "RELATED COPIES", icon: Copy },
    { id: "borrow-history", label: "BORROW HISTORY", icon: History },
];

interface ViewDetailsTabsProps {
    activeTab: ViewTabType;
    onTabChange: (tab: ViewTabType) => void;
    children: ReactNode;
    copiesCount?: number;
    availableCopiesCount?: number;
    historyCount?: number;
}

export default function ViewDetailsTabs({
    activeTab,
    onTabChange,
    children,
    copiesCount = 0,
    availableCopiesCount,
    historyCount = 0,
}: ViewDetailsTabsProps) {
    const getTabBadge = (tabId: ViewTabType): string | undefined => {
        if (tabId === "related-copies") {
            const available = availableCopiesCount ?? copiesCount;
            return `${available}/${copiesCount}`;
        }
        if (tabId === "borrow-history" && historyCount > 0) return String(historyCount);
        return undefined;
    };

    return (
        <div>
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-2 overflow-x-auto sm:space-x-6">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const badge = getTabBadge(tab.id);
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => onTabChange(tab.id)}
                                className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-1 py-3 text-xs font-medium transition-colors sm:gap-2 sm:text-sm ${activeTab === tab.id
                                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                            >
                                <Icon size={16} className="flex-shrink-0" />
                                <span className="hidden sm:inline">
                                    {tab.label}
                                </span>
                                <span className="sm:hidden">
                                    {tab.label.split(" ")[0]}
                                </span>
                                {badge !== undefined && (
                                    <span
                                        className={`ml-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium sm:ml-1 sm:px-2 ${activeTab === tab.id
                                                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                            }`}
                                    >
                                        {badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-6">{children}</div>
        </div>
    );
}
