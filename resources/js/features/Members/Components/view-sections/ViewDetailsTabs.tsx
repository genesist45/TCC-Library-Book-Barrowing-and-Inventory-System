import { ReactNode } from "react";
import { User, History } from "lucide-react";

export type MemberViewTabType = "member-info" | "borrow-history";

interface Tab {
    id: MemberViewTabType;
    label: string;
    icon: typeof User;
}

const TABS: Tab[] = [
    { id: "member-info", label: "MEMBER INFO", icon: User },
    { id: "borrow-history", label: "BORROW HISTORY", icon: History },
];

interface ViewDetailsTabsProps {
    activeTab: MemberViewTabType;
    onTabChange: (tab: MemberViewTabType) => void;
    children: ReactNode;
    historyCount?: number;
}

export default function ViewDetailsTabs({
    activeTab,
    onTabChange,
    children,
    historyCount = 0,
}: ViewDetailsTabsProps) {
    const getTabCount = (tabId: MemberViewTabType): number | undefined => {
        if (tabId === "borrow-history") return historyCount;
        return undefined;
    };

    return (
        <div>
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-2 overflow-x-auto sm:space-x-6">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const count = getTabCount(tab.id);
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => onTabChange(tab.id)}
                                className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-1 py-3 text-xs font-medium transition-colors sm:gap-2 sm:text-sm ${
                                    activeTab === tab.id
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
                                {count !== undefined && count > 0 && (
                                    <span
                                        className={`ml-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium sm:ml-1 sm:px-2 ${
                                            activeTab === tab.id
                                                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                        }`}
                                    >
                                        {count}
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
