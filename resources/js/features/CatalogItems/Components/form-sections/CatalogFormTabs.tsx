import { ReactNode } from "react";
import {
    Info,
    FileText,
    BookOpen,
    GraduationCap,
    Copy,
    History,
} from "lucide-react";

export type TabType =
    | "item-info"
    | "detail"
    | "journal"
    | "thesis"
    | "related-copies"
    | "borrow-history";

interface Tab {
    id: TabType;
    label: string;
    icon: typeof Info;
    isExtra?: boolean;
}

const BASE_TABS: Tab[] = [
    { id: "item-info", label: "ITEM INFO", icon: Info },
    { id: "detail", label: "DETAIL", icon: FileText },
    { id: "journal", label: "JOURNAL", icon: BookOpen },
    { id: "thesis", label: "THESIS", icon: GraduationCap },
];

const EXTRA_TABS: Tab[] = [
    {
        id: "related-copies",
        label: "RELATED COPIES",
        icon: Copy,
        isExtra: true,
    },
    {
        id: "borrow-history",
        label: "BORROW HISTORY",
        icon: History,
        isExtra: true,
    },
];

interface CatalogFormTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    children: ReactNode;
    showExtraTabs?: boolean;
    copiesCount?: number;
    availableCopiesCount?: number;
    historyCount?: number;
}

export default function CatalogFormTabs({
    activeTab,
    onTabChange,
    children,
    showExtraTabs = false,
    copiesCount = 0,
    availableCopiesCount,
    historyCount = 0,
}: CatalogFormTabsProps) {
    const tabs = showExtraTabs ? [...BASE_TABS, ...EXTRA_TABS] : BASE_TABS;

    const getTabBadge = (tabId: TabType): string | undefined => {
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
                    {tabs.map((tab) => {
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
                                {showExtraTabs && (
                                    <Icon size={16} className="flex-shrink-0" />
                                )}
                                <span
                                    className={
                                        showExtraTabs ? "hidden sm:inline" : ""
                                    }
                                >
                                    {tab.label}
                                </span>
                                {showExtraTabs && (
                                    <span className="sm:hidden">
                                        {tab.label.split(" ")[0]}
                                    </span>
                                )}
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
