import { ReactNode } from "react";

export type TabType = "item-info" | "detail" | "journal" | "thesis";

interface Tab {
    id: TabType;
    label: string;
}

const TABS: Tab[] = [
    { id: "item-info", label: "ITEM INFO" },
    { id: "detail", label: "DETAIL" },
    { id: "journal", label: "JOURNAL" },
    { id: "thesis", label: "THESIS" },
];

interface CatalogFormTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    children: ReactNode;
}

export default function CatalogFormTabs({
    activeTab,
    onTabChange,
    children,
}: CatalogFormTabsProps) {
    return (
        <div>
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onTabChange(tab.id)}
                            className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-6">{children}</div>
        </div>
    );
}
