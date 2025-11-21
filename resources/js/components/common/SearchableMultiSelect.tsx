import { useState, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';

interface Option {
    id: number;
    name: string;
}

interface SearchableMultiSelectProps {
    options: Option[];
    selectedIds: number[];
    onChange: (selectedIds: number[]) => void;
    placeholder?: string;
    className?: string;
}

export default function SearchableMultiSelect({
    options,
    selectedIds,
    onChange,
    placeholder = 'Search authors...',
    className = '',
}: SearchableMultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get selected options
    const selectedOptions = options.filter(option => selectedIds.includes(option.id));

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedIds.includes(option.id)
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionId: number) => {
        onChange([...selectedIds, optionId]);
        setSearchTerm('');
        inputRef.current?.focus();
    };

    const handleRemove = (optionId: number) => {
        onChange(selectedIds.filter(id => id !== optionId));
    };

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    return (
        <div className={className}>
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Left Column: Search Bar */}
                <div className="relative" ref={dropdownRef}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={handleInputFocus}
                            placeholder={placeholder}
                            className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                        />
                    </div>

                    {/* Dropdown */}
                    {isOpen && (
                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                    {searchTerm ? 'No results found' : 'All options selected'}
                                </div>
                            ) : (
                                <ul className="py-1">
                                    {filteredOptions.map(option => (
                                        <li
                                            key={option.id}
                                            onClick={() => handleSelect(option.id)}
                                            className="cursor-pointer px-3 py-2 text-sm text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {option.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: Selected Authors */}
                <div className="min-h-[36px]">
                    {selectedOptions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {selectedOptions.map(option => (
                                <span
                                    key={option.id}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 transition-colors dark:bg-indigo-900/20 dark:text-indigo-400 dark:ring-indigo-400/30"
                                >
                                    {option.name}
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(option.id)}
                                        className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm hover:bg-indigo-200 dark:hover:bg-indigo-800"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500">No authors selected</p>
                    )}
                </div>
            </div>
        </div>
    );
}
