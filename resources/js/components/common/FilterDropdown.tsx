import { ChevronDown, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export interface FilterOption {
    id: string | number;
    name: string;
}

interface FilterDropdownProps {
    label: string;
    options: FilterOption[];
    selectedId: string | number | null;
    onChange: (id: string | number | null) => void;
    placeholder?: string;
}

export default function FilterDropdown({
    label,
    options,
    selectedId,
    onChange,
    placeholder = "All"
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(o => String(o.id) === String(selectedId));

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex items-center rounded-lg border border-gray-300 bg-white shadow-sm transition-colors dark:border-[#3a3a3a] dark:bg-[#2a2a2a] overflow-hidden">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-[#3a3a3a] transition-colors"
                >
                    <span className="text-gray-500 dark:text-gray-400">{label}:</span>
                    <span className="font-medium max-w-[120px] truncate">{selectedOption?.name || placeholder}</span>
                    {!selectedId && <ChevronDown className="h-4 w-4 text-gray-400" />}
                </button>

                {selectedId && (
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="flex items-center border-l border-gray-200 px-2 py-[11px] text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:border-[#3a3a3a] dark:hover:bg-[#3a3a3a] transition-colors"
                        title={`Clear ${label} filter`}
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-[#3a3a3a] dark:bg-[#2a2a2a] py-1">
                    <button
                        type="button"
                        onClick={() => {
                            onChange(null);
                            setIsOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#3a3a3a] ${!selectedId ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        All {label}
                    </button>
                    <div className="max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => {
                                    onChange(option.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#3a3a3a] ${String(selectedId) === String(option.id) ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {option.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
