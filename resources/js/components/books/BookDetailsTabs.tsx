import { Info, Copy } from "lucide-react";
import { CatalogItem } from "@/types";

export type BookDetailTab = "item-info" | "available-copies";

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    badge?: string;
}

function TabButton({ active, onClick, icon, label, badge }: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-1.5 sm:gap-2 border-b-2 px-1 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors min-h-[48px] ${active
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
        >
            {icon}
            <span className="whitespace-nowrap">{label}</span>
            {badge !== undefined && (
                <span
                    className={`ml-0.5 sm:ml-1 rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium ${active
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-600"
                        }`}
                >
                    {badge}
                </span>
            )}
        </button>
    );
}

interface BookDetailsTabsProps {
    activeTab: BookDetailTab;
    onTabChange: (tab: BookDetailTab) => void;
    catalogItem: CatalogItem;
    copiesCount?: number;
    availableCopiesCount?: number;
}

export default function BookDetailsTabs({
    activeTab,
    onTabChange,
    catalogItem,
    copiesCount,
    availableCopiesCount,
}: BookDetailsTabsProps) {
    const availableCount = availableCopiesCount ?? copiesCount ?? 0;
    const totalCount = copiesCount ?? 0;
    const badge = `${availableCount}/${totalCount}`;

    return (
        <div className="border-b border-gray-200 px-4 sm:px-6 overflow-x-auto">
            <nav className="-mb-px flex space-x-4 sm:space-x-6">
                <TabButton
                    active={activeTab === "item-info"}
                    onClick={() => onTabChange("item-info")}
                    icon={<Info className="h-4 w-4" />}
                    label="ITEM INFO"
                />

                <TabButton
                    active={activeTab === "available-copies"}
                    onClick={() => onTabChange("available-copies")}
                    icon={<Copy className="h-4 w-4" />}
                    label="AVAILABLE COPIES"
                    badge={badge}
                />
            </nav>
        </div>
    );
}
