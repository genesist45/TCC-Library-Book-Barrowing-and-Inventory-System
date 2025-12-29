import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import type { FilterOption } from "../../types/borrow";

interface FilterDropdownProps {
    label: string;
    options: FilterOption[];
    selectedId: number | null;
    onChange: (id: number | null) => void;
}

export default function FilterDropdown({
    label,
    options,
    selectedId,
    onChange,
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const selectedOption = options.find((o) => o.id === selectedId);

    const filteredOptions = options.filter((option) =>
        option.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#3a3a3a]"
            >
                <span className="text-gray-500 dark:text-gray-400">{label}:</span>
                <span className="font-medium max-w-[80px] truncate">
                    {selectedOption?.name || "All"}
                </span>
                {selectedId ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange(null);
                        }}
                        className="ml-1 rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-[#4a4a4a]"
                    >
                        <X className="h-3 w-3" />
                    </button>
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="p-2 border-b border-gray-100 dark:border-[#3a3a3a]">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={`Search ${label.toLowerCase()}...`}
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#1a1a1a] dark:text-gray-100 dark:placeholder-gray-500"
                                autoFocus
                            />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(null);
                                    setIsOpen(false);
                                    setSearch("");
                                }}
                                className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#3a3a3a] ${!selectedId
                                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                    : "text-gray-700 dark:text-gray-300"
                                    }`}
                            >
                                All {label}
                            </button>
                            {filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.id);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                    className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#3a3a3a] ${selectedId === option.id
                                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                        : "text-gray-700 dark:text-gray-300"
                                        }`}
                                >
                                    {option.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
