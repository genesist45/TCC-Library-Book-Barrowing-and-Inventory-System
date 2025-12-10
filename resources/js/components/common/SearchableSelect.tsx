import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

interface Option {
    id: number | string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    error?: string;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    className = '',
    disabled = false,
    error,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get selected option
    const selectedOption = options.find(option => option.id.toString() === value.toString());

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Update search term when selected option changes
    useEffect(() => {
        if (selectedOption) {
            setSearchTerm(selectedOption.label);
        } else {
            setSearchTerm('');
        }
    }, [selectedOption]);

    const handleSelect = (option: Option) => {
        onChange(option.id.toString());
        setIsOpen(false);
        setSearchTerm(option.label);
    };

    const handleInputFocus = () => {
        if (!disabled) {
            setIsOpen(true);
            // Select all text on focus for easy replacement
            inputRef.current?.select();
            // If we want to show all options on focus, we might want to clear search term temporarily?
            // But if we clear it, we lose the current value display.
            // Better strategy: keep the value but show all options if the search term matches the selected value exactly.
            // Or just let the user type to filter.
            // Let's keep it simple: just open.
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (!isOpen) setIsOpen(true);

        // If user clears input, we might want to clear selection?
        if (e.target.value === '') {
            onChange('');
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`block w-full rounded-md border shadow-sm transition-colors focus:ring-1 focus:ring-opacity-50 sm:text-sm ${error
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:text-red-500'
                            : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                        } ${disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-[#2a2a2a]' : 'bg-white'}`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && !disabled && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-[#4a4a4a] dark:bg-[#3a3a3a]">
                    {filteredOptions.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No results found
                        </div>
                    ) : (
                        <ul className="py-1">
                            {filteredOptions.map(option => (
                                <li
                                    key={option.id}
                                    onClick={() => handleSelect(option)}
                                    className={`cursor-pointer px-3 py-2 text-sm transition-colors ${option.id.toString() === value.toString()
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                            : 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-[#4a4a4a]'
                                        }`}
                                >
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
