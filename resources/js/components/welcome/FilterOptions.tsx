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
    return (
        <div className="flex gap-3 lg:w-auto">
            {/* Type Filter */}
            <div className="relative flex-1 lg:w-40">
                <select
                    value={typeFilter}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm text-gray-700 shadow-sm transition hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                    <option value="">All Types</option>
                    <option value="Book">Book</option>
                    <option value="Journal">Journal</option>
                    <option value="Magazine">Magazine</option>
                    <option value="Thesis">Thesis</option>
                    <option value="Reference">Reference</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Year Filter */}
            <div className="relative flex-1 lg:w-40">
                <select
                    value={yearFilter}
                    onChange={(e) => onYearChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm text-gray-700 shadow-sm transition hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                    <option value="">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="older">2019 & Older</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Availability Filter */}
            <div className="relative flex-1 lg:w-40">
                <select
                    value={availabilityFilter}
                    onChange={(e) => onAvailabilityChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm text-gray-700 shadow-sm transition hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="borrowed">Borrowed</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
