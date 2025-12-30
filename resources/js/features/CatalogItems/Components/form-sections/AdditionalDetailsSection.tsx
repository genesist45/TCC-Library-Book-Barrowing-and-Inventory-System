import { useState, useMemo } from "react";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import Modal from "@/components/modals/Modal";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { Location } from "@/types";
import { Search, ChevronDown, X, ChevronLeft, ChevronRight } from "lucide-react";

interface AdditionalDetailsSectionProps {
    data: {
        isbn: string;
        isbn13: string;
        call_no: string;
        subject: string;
        series: string;
        edition: string;
        url: string;
        description: string;
        location: string;
    };
    errors: {
        isbn?: string;
        isbn13?: string;
        call_no?: string;
        subject?: string;
        series?: string;
        edition?: string;
        url?: string;
        description?: string;
        location?: string;
    };
    locations?: Location[];
    onDataChange: (field: string, value: any) => void;
    onClearErrors: (field: string) => void;
    onShowLocationModal?: () => void;
}

const ITEMS_PER_PAGE = 6;

export default function AdditionalDetailsSection({
    data,
    errors,
    locations = [],
    onDataChange,
    onClearErrors,
    onShowLocationModal,
}: AdditionalDetailsSectionProps) {
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [locationSearch, setLocationSearch] = useState("");
    const [locationPage, setLocationPage] = useState(1);

    // Filter locations based on search
    const filteredLocations = useMemo(() => {
        return locations.filter((loc) =>
            loc.name.toLowerCase().includes(locationSearch.toLowerCase())
        );
    }, [locations, locationSearch]);

    // Paginate locations
    const totalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE);
    const paginatedLocations = useMemo(() => {
        const start = (locationPage - 1) * ITEMS_PER_PAGE;
        return filteredLocations.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredLocations, locationPage]);

    const handleLocationSelect = (locationName: string) => {
        onDataChange("location", locationName);
        onClearErrors("location");
        setIsLocationDropdownOpen(false);
        setLocationSearch("");
        setLocationPage(1);
    };

    const handleClearLocation = () => {
        onDataChange("location", "");
        onClearErrors("location");
    };

    const handleLocationSearchChange = (value: string) => {
        setLocationSearch(value);
        setLocationPage(1);
    };

    const selectedLocationName = data.location || "";

    return (
        <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Additional Details
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Optional metadata and cataloging information
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="isbn" value="ISBN" />
                    <TextInput
                        id="isbn"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.isbn}
                        onChange={(e) => {
                            onDataChange("isbn", e.target.value);
                            onClearErrors("isbn");
                        }}
                    />
                    <InputError message={errors.isbn} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="isbn13" value="ISBN-13" />
                    <TextInput
                        id="isbn13"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.isbn13}
                        onChange={(e) => {
                            onDataChange("isbn13", e.target.value);
                            onClearErrors("isbn13");
                        }}
                    />
                    <InputError message={errors.isbn13} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="call_no" value="Call Number" />
                    <TextInput
                        id="call_no"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.call_no}
                        onChange={(e) => {
                            onDataChange("call_no", e.target.value);
                            onClearErrors("call_no");
                        }}
                    />
                    <InputError message={errors.call_no} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="subject" value="Subject" />
                    <TextInput
                        id="subject"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.subject}
                        onChange={(e) => {
                            onDataChange("subject", e.target.value);
                            onClearErrors("subject");
                        }}
                    />
                    <InputError message={errors.subject} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="series" value="Series" />
                    <TextInput
                        id="series"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.series}
                        onChange={(e) => {
                            onDataChange("series", e.target.value);
                            onClearErrors("series");
                        }}
                    />
                    <InputError message={errors.series} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="edition" value="Edition" />
                    <TextInput
                        id="edition"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.edition}
                        onChange={(e) => {
                            onDataChange("edition", e.target.value);
                            onClearErrors("edition");
                        }}
                    />
                    <InputError message={errors.edition} className="mt-1" />
                </div>

                <div className="sm:col-span-2">
                    <InputLabel htmlFor="url" value="URL" />
                    <TextInput
                        id="url"
                        type="url"
                        className="mt-1 block w-full"
                        value={data.url}
                        onChange={(e) => {
                            onDataChange("url", e.target.value);
                            onClearErrors("url");
                        }}
                        placeholder="https://..."
                    />
                    <InputError message={errors.url} className="mt-1" />
                </div>

                <div className="sm:col-span-2">
                    <InputLabel htmlFor="description" value="Description" />
                    <textarea
                        id="description"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        value={data.description}
                        onChange={(e) => {
                            onDataChange("description", e.target.value);
                            onClearErrors("description");
                        }}
                        placeholder="Brief description of this item..."
                    />
                    <InputError message={errors.description} className="mt-1" />
                </div>

                {/* Location Dropdown with Search */}
                <div className="sm:col-span-2">
                    <InputLabel htmlFor="location" value="Location" />
                    <div className="relative mt-1">
                        <div
                            className="flex items-center justify-between w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm cursor-pointer focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800"
                            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                        >
                            <span className={`text-sm ${selectedLocationName ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
                                {selectedLocationName || "Select Location"}
                            </span>
                            <div className="flex items-center gap-1">
                                {selectedLocationName && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClearLocation();
                                        }}
                                        className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                    >
                                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                    </button>
                                )}
                                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isLocationDropdownOpen ? "rotate-180" : ""}`} />
                            </div>
                        </div>

                        {/* Dropdown Panel */}
                        {isLocationDropdownOpen && (
                            <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                {/* Search Input */}
                                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                                            placeholder="Search locations..."
                                            value={locationSearch}
                                            onChange={(e) => handleLocationSearchChange(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>

                                {/* Location List */}
                                <div className="max-h-[240px] overflow-y-auto">
                                    {paginatedLocations.length > 0 ? (
                                        paginatedLocations.map((location) => (
                                            <button
                                                key={location.id}
                                                type="button"
                                                onClick={() => handleLocationSelect(location.name)}
                                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${selectedLocationName === location.name
                                                    ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                                                    : "text-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                {location.name}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-6 text-center">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                No locations found
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-3 py-2">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {filteredLocations.length} location{filteredLocations.length !== 1 ? "s" : ""}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setLocationPage(locationPage - 1);
                                                }}
                                                disabled={locationPage === 1}
                                                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                            </button>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {locationPage} / {totalPages}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setLocationPage(locationPage + 1);
                                                }}
                                                disabled={locationPage === totalPages}
                                                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <InputError message={errors.location} className="mt-1" />

                    {/* Quick Add Link */}
                    {onShowLocationModal && (
                        <button
                            type="button"
                            onClick={onShowLocationModal}
                            className="mt-1.5 text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                        >
                            + Location not listed? Click here to add.
                        </button>
                    )}
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {isLocationDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setIsLocationDropdownOpen(false);
                        setLocationSearch("");
                        setLocationPage(1);
                    }}
                />
            )}
        </div>
    );
}
