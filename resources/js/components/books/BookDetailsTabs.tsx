import { Info, Copy } from "lucide-react";

export type BookDetailTab = "item-info" | "available-copies";

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    badge?: number;
}

function TabButton({ active, onClick, icon, label, badge }: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${active
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
        >
            {icon}
            {label}
            {badge !== undefined && badge > 0 && (
                <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${active
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
    copiesCount?: number;
}

export default function BookDetailsTabs({
    activeTab,
    onTabChange,
    copiesCount,
}: BookDetailsTabsProps) {
    return (
        <div className="border-b border-gray-200 px-6">
            <nav className="-mb-px flex space-x-6">
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
                    badge={copiesCount}
                />
            </nav>
        </div>
    );
}
