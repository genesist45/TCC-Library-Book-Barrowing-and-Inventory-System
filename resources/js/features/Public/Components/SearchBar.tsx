import { Search } from 'lucide-react';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onFocus?: () => void;
}

export default function SearchBar({
    searchQuery,
    onSearchChange,
    onFocus,
}: SearchBarProps) {
    return (
        <div className="relative flex-1">
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-rose-400" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={onFocus}
                    placeholder="Search books by title or location..."
                    className="w-full rounded-lg border border-pink-200 bg-white py-3 sm:py-2.5 pl-10 pr-4 text-base sm:text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-pink-100 min-h-[44px]"
                />
            </div>
        </div>
    );
}
