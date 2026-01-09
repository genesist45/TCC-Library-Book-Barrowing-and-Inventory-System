import { ChevronDown } from 'lucide-react';

interface FilterOptionsProps {
    typeFilter: string;
    yearFilter: string;
    availabilityFilter: string;
    onTypeChange: (value: string) => void;
    onYearChange: (value: string) => void;
    onAvailabilityChange: (value: string) => void;
}

export default function FilterOptions({
    typeFilter,
    yearFilter,
    availabilityFilter,
    onTypeChange,
    onYearChange,
    onAvailabilityChange,
}: FilterOptionsProps) {
    // Mobile-friendly select with proper touch target (min 44px height)
    const selectClasses = "w-full appearance-none rounded-lg border border-pink-200 bg-white px-3 py-3 sm:py-2.5 pr-8 text-sm text-gray-700 transition-all hover:border-pink-300 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-pink-100 min-h-[44px]";

    return (
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Type Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[100px]">
                <select
                    value={typeFilter}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className={selectClasses}
                >
                    <option value="">All Types</option>
                    <option value="Book">Book</option>
                    <option value="Journal">Journal</option>
                    <option value="Magazine">Magazine</option>
                    <option value="Thesis">Thesis</option>
                    <option value="Reference">Reference</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
            </div>

            {/* Year Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[100px]">
                <select
                    value={yearFilter}
                    onChange={(e) => onYearChange(e.target.value)}
                    className={selectClasses}
                >
                    <option value="">All Years</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="older">2019 & Older</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
            </div>

            {/* Availability Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[100px]">
                <select
                    value={availabilityFilter}
                    onChange={(e) => onAvailabilityChange(e.target.value)}
                    className={selectClasses}
                >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="borrowed">Checked Out</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
            </div>
        </div>
    );
}
