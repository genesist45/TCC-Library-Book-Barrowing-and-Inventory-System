import Modal from "@/components/modals/Modal";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { CatalogItem, Location } from "@/types";
import { Copy, Layers, Search, ChevronDown, ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import { toast } from "react-toastify";
import LocationQuickAddModal from "./LocationQuickAddModal";

type TabType = "single" | "multiple";

interface Tab {
    id: TabType;
    label: string;
    icon: typeof Copy;
}

const TABS: Tab[] = [
    { id: "single", label: "Single Copy", icon: Copy },
    { id: "multiple", label: "Multiple Copies", icon: Layers },
];

const ITEMS_PER_PAGE = 5;

interface CopyBookModalProps {
    show: boolean;
    item: CatalogItem | null;
    onClose: () => void;
    onSuccess: (copy: any) => void;
}

export default function CopyBookModal({
    show,
    item,
    onClose,
    onSuccess,
}: CopyBookModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>("single");

    // Locations state
    const [locations, setLocations] = useState<Location[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(false);

    // Single copy state
    const [accessionNo, setAccessionNo] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Available");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Multiple copies state
    const [numberOfCopies, setNumberOfCopies] = useState("2");
    const [multiLocation, setMultiLocation] = useState("");
    const [multiStatus, setMultiStatus] = useState("Available");
    const [multiProcessing, setMultiProcessing] = useState(false);
    const [multiErrors, setMultiErrors] = useState<Record<string, string>>({});
    const [createdCopies, setCreatedCopies] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);

    // Single Location dropdown state
    const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
    const [locationSearchTerm, setLocationSearchTerm] = useState("");
    const [locationCurrentPage, setLocationCurrentPage] = useState(1);
    const locationDropdownRef = useRef<HTMLDivElement>(null);
    const locationTriggerRef = useRef<HTMLDivElement>(null);
    const [locationDropdownPos, setLocationDropdownPos] = useState({ top: 0, left: 0, width: 0 });

    // Multi Location dropdown state
    const [multiLocationDropdownOpen, setMultiLocationDropdownOpen] = useState(false);
    const [multiLocationSearchTerm, setMultiLocationSearchTerm] = useState("");
    const [multiLocationCurrentPage, setMultiLocationCurrentPage] = useState(1);
    const multiLocationDropdownRef = useRef<HTMLDivElement>(null);
    const multiLocationTriggerRef = useRef<HTMLDivElement>(null);
    const [multiLocationDropdownPos, setMultiLocationDropdownPos] = useState({ top: 0, left: 0, width: 0 });

    // Location modal state
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationModalContext, setLocationModalContext] = useState<"single" | "multiple">("single");

    useEffect(() => {
        if (show && item) {
            generateAccessionNo();
            fetchLocations();
            // Set defaults from catalog item
            setLocation(item.location || "");
            setMultiLocation(item.location || "");
        }
    }, [show, item]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
                setLocationDropdownOpen(false);
            }
            if (multiLocationDropdownRef.current && !multiLocationDropdownRef.current.contains(event.target as Node)) {
                setMultiLocationDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset pagination when search changes
    useEffect(() => { setLocationCurrentPage(1); }, [locationSearchTerm]);
    useEffect(() => { setMultiLocationCurrentPage(1); }, [multiLocationSearchTerm]);

    const fetchLocations = async () => {
        setLoadingLocations(true);
        try {
            const response = await axios.get(route("admin.locations.list"));
            setLocations(response.data.locations || response.data || []);
        } catch (error) {
            console.error("Failed to fetch locations:", error);
        } finally {
            setLoadingLocations(false);
        }
    };

    const generateAccessionNo = async () => {
        try {
            const response = await axios.get(
                route("admin.copies.generate-accession-no"),
            );
            setAccessionNo(response.data.accession_no);
        } catch (error) {
            console.error("Failed to generate accession number:", error);
        }
    };

    const validateAccessionNo = async (value: string) => {
        if (value.length !== 7) return;

        try {
            const response = await axios.post(
                route("admin.copies.validate-accession-no"),
                {
                    accession_no: value,
                },
            );

            if (!response.data.valid) {
                setErrors({ ...errors, accession_no: response.data.message });
            } else {
                const { accession_no, ...rest } = errors;
                setErrors(rest);
            }
        } catch (error) {
            console.error("Failed to validate accession number:", error);
        }
    };

    const handleAccessionNoChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 7);
        setAccessionNo(value);

        if (value.length === 7) {
            validateAccessionNo(value);
        }
    };

    const handleLocationSelect = (locationName: string) => {
        setLocation(locationName);
        setLocationDropdownOpen(false);
        setLocationSearchTerm("");
    };

    const handleMultiLocationSelect = (locationName: string) => {
        setMultiLocation(locationName);
        setMultiLocationDropdownOpen(false);
        setMultiLocationSearchTerm("");
    };

    const handleLocationAdded = async (name: string) => {
        try {
            const response = await axios.post(route('admin.locations.store'), {
                name,
                is_published: true,
            });

            if (response.data) {
                const newLocation = response.data.location;
                setLocations([...locations, newLocation]);

                // Set the new location based on context
                if (locationModalContext === "single") {
                    setLocation(newLocation.name);
                } else {
                    setMultiLocation(newLocation.name);
                }

                setShowLocationModal(false);
                toast.success('Location added successfully!');
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                toast.error(error.response.data.errors.name?.[0] || 'Failed to add location');
            }
        }
    };

    const openLocationModal = (context: "single" | "multiple") => {
        setLocationModalContext(context);
        setShowLocationModal(true);
    };

    // Filter and paginate locations for single copy
    const filteredLocations = locations.filter((l) =>
        l.name.toLowerCase().includes(locationSearchTerm.toLowerCase())
    );
    const locationTotalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE);
    const locationPaginatedItems = filteredLocations.slice(
        (locationCurrentPage - 1) * ITEMS_PER_PAGE,
        locationCurrentPage * ITEMS_PER_PAGE
    );

    // Filter and paginate locations for multiple copies
    const multiFilteredLocations = locations.filter((l) =>
        l.name.toLowerCase().includes(multiLocationSearchTerm.toLowerCase())
    );
    const multiLocationTotalPages = Math.ceil(multiFilteredLocations.length / ITEMS_PER_PAGE);
    const multiLocationPaginatedItems = multiFilteredLocations.slice(
        (multiLocationCurrentPage - 1) * ITEMS_PER_PAGE,
        multiLocationCurrentPage * ITEMS_PER_PAGE
    );

    const selectedLocation = locations.find((l) => l.name === location);
    const selectedMultiLocation = locations.find((l) => l.name === multiLocation);

    const handleSingleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!item) return;

        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.post(
                route("admin.catalog-items.copies.store", item.id),
                {
                    accession_no: accessionNo,
                    branch: item.library_branch || "Main Library",
                    location: location || null,
                    status,
                },
            );

            if (response.data.success) {
                onSuccess(response.data.copy);
                resetForm();
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleMultipleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!item) return;

        // Parse and validate number of copies
        const copies = parseInt(numberOfCopies) || 2;
        if (copies < 2 || copies > 50) {
            setMultiErrors({ number_of_copies: "Number of copies must be between 2 and 50" });
            return;
        }

        setMultiProcessing(true);
        setMultiErrors({});
        setCreatedCopies([]);

        try {
            const response = await axios.post(
                route("admin.catalog-items.copies.store-bulk", item.id),
                {
                    number_of_copies: copies,
                    branch: item.library_branch || "Main Library",
                    location: multiLocation || null,
                    status: multiStatus,
                },
            );

            if (response.data.success) {
                setCreatedCopies(response.data.copies);
                setShowResults(true);
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setMultiErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setMultiErrors({ general: error.response.data.message });
            }
        } finally {
            setMultiProcessing(false);
        }
    };

    const resetForm = () => {
        setAccessionNo("");
        setLocation(item?.location || "");
        setStatus("Available");
        setErrors({});
        setNumberOfCopies("2");
        setMultiLocation(item?.location || "");
        setMultiStatus("Available");
        setMultiErrors({});
        setCreatedCopies([]);
        setShowResults(false);
        setLocationSearchTerm("");
        setMultiLocationSearchTerm("");
    };

    const handleClose = () => {
        resetForm();
        setActiveTab("single");
        onClose();
    };

    const handleResultsClose = () => {
        onSuccess(createdCopies);
        resetForm();
    };

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setErrors({});
        setMultiErrors({});
    };

    // Searchable dropdown component with fixed positioning
    const renderLocationDropdown = (
        type: "single" | "multiple",
        value: string,
        onSelect: (name: string) => void,
        onClear: () => void,
        dropdownOpen: boolean,
        setDropdownOpen: (open: boolean) => void,
        searchTerm: string,
        setSearchTerm: (term: string) => void,
        currentPage: number,
        setCurrentPage: (page: number) => void,
        dropdownRef: React.RefObject<HTMLDivElement>,
        filteredItems: Location[],
        paginatedItems: Location[],
        totalPages: number,
        selectedItem: Location | undefined,
        triggerRef: React.RefObject<HTMLDivElement>,
        dropdownPos: { top: number; left: number; width: number },
        setDropdownPos: (pos: { top: number; left: number; width: number }) => void
    ) => {
        const handleToggle = () => {
            if (!dropdownOpen && triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                setDropdownPos({
                    top: rect.bottom + 4,
                    left: rect.left,
                    width: rect.width,
                });
            }
            setDropdownOpen(!dropdownOpen);
        };

        return (
            <div className="relative mt-1" ref={dropdownRef}>
                <div
                    ref={triggerRef}
                    className={`flex items-center justify-between w-full rounded-md border shadow-sm transition-colors duration-200 cursor-pointer text-sm ${dropdownOpen
                        ? "border-indigo-500 ring-1 ring-indigo-500"
                        : "border-gray-300 dark:border-gray-700"
                        } bg-white dark:bg-gray-900`}
                    onClick={handleToggle}
                >
                    <div className="flex-1 px-3 py-2">
                        {selectedItem ? (
                            <span className="text-gray-900 dark:text-gray-100">
                                {selectedItem.name}
                            </span>
                        ) : (
                            <span className="text-gray-400 dark:text-gray-500">
                                Search locations...
                            </span>
                        )}
                    </div>
                    <div className="flex items-center px-2 gap-1">
                        {value && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClear();
                                }}
                                className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={14} />
                            </button>
                        )}
                        <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""
                                }`}
                        />
                    </div>
                </div>

                {/* Dropdown Menu - Using Portal to render outside modal */}
                {dropdownOpen && createPortal(
                    <div
                        className="fixed z-[9999] rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                        style={{
                            top: `${dropdownPos.top}px`,
                            left: `${dropdownPos.left}px`,
                            width: `${dropdownPos.width}px`,
                        }}
                    >
                        {/* Search Input */}
                        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search locations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 text-sm rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        {/* Options */}
                        <div className="max-h-32 overflow-y-auto">
                            {loadingLocations ? (
                                <div className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                                    Loading...
                                </div>
                            ) : paginatedItems.length > 0 ? (
                                paginatedItems.map((loc) => (
                                    <div
                                        key={loc.id}
                                        onClick={() => onSelect(loc.name)}
                                        className={`px-3 py-1.5 cursor-pointer text-sm transition-colors ${value === loc.name
                                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        {loc.name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No locations found
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentPage(Math.max(1, currentPage - 1));
                                    }}
                                    disabled={currentPage === 1}
                                    className="p-0.5 disabled:opacity-50 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                <span className="text-xs">
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentPage(Math.min(totalPages, currentPage + 1));
                                    }}
                                    disabled={currentPage === totalPages}
                                    className="p-0.5 disabled:opacity-50 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>,
                    document.body
                )}
            </div>
        );
    };

    const renderTabContent = () => {
        if (activeTab === "single") {
            return (
                <form onSubmit={handleSingleSubmit} className="space-y-3">
                    <div>
                        <InputLabel
                            htmlFor="accession_no"
                            value="Accession No."
                        />
                        <TextInput
                            id="accession_no"
                            type="text"
                            className="mt-1 block w-full"
                            value={accessionNo}
                            onChange={handleAccessionNoChange}
                            placeholder="0000000"
                            maxLength={7}
                            required
                        />
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            Auto-generated. You can edit if needed (must be 7
                            digits and unique).
                        </p>
                        <InputError
                            message={errors.accession_no}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="location"
                            value="Location (Optional)"
                        />
                        {renderLocationDropdown(
                            "single",
                            location,
                            handleLocationSelect,
                            () => setLocation(""),
                            locationDropdownOpen,
                            setLocationDropdownOpen,
                            locationSearchTerm,
                            setLocationSearchTerm,
                            locationCurrentPage,
                            setLocationCurrentPage,
                            locationDropdownRef,
                            filteredLocations,
                            locationPaginatedItems,
                            locationTotalPages,
                            selectedLocation,
                            locationTriggerRef,
                            locationDropdownPos,
                            setLocationDropdownPos
                        )}
                        {/* Quick Add Link */}
                        <button
                            type="button"
                            onClick={() => openLocationModal("single")}
                            className="mt-1 inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            <Plus size={12} />
                            Location not listed? Click here to add
                        </button>
                        <InputError
                            message={errors.location}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="status" value="Status" />
                        <select
                            id="status"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <option value="Available">Available</option>
                            <option value="Borrowed">Borrowed</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Lost">Lost</option>
                            <option value="Under Repair">Under Repair</option>
                        </select>
                        <InputError message={errors.status} className="mt-1" />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <SecondaryButton
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Close
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? "Saving..." : "Save Copy"}
                        </PrimaryButton>
                    </div>
                </form>
            );
        }

        // Multiple copies tab - results view
        if (showResults) {
            return (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 dark:border-green-800 dark:bg-green-900/20">
                        <svg
                            className="h-4 w-4 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            Successfully created {createdCopies.length} copies!
                        </span>
                    </div>

                    <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                        Copy No.
                                    </th>
                                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                        Accession No.
                                    </th>
                                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                        Location
                                    </th>
                                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {createdCopies.map((copy, index) => (
                                    <tr key={copy.id || index}>
                                        <td className="whitespace-nowrap px-3 py-1.5 text-xs text-gray-900 dark:text-gray-100">
                                            {copy.copy_no}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-1.5 text-xs font-medium text-gray-900 dark:text-gray-100">
                                            {copy.accession_no}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400">
                                            {copy.location || "-"}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-1.5 text-xs">
                                            <span
                                                className={`inline-flex rounded-full px-1.5 py-0.5 text-xs font-medium ${copy.status === "Available"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                {copy.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-3 pt-1">
                        <SecondaryButton
                            type="button"
                            onClick={() => setShowResults(false)}
                        >
                            Add More
                        </SecondaryButton>
                        <PrimaryButton
                            type="button"
                            onClick={handleResultsClose}
                        >
                            Done
                        </PrimaryButton>
                    </div>
                </div>
            );
        }

        // Multiple copies tab - form view
        return (
            <form onSubmit={handleMultipleSubmit} className="space-y-3">
                {multiErrors.general && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 dark:border-red-800 dark:bg-red-900/20">
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {multiErrors.general}
                        </p>
                    </div>
                )}

                <div>
                    <InputLabel
                        htmlFor="number_of_copies"
                        value="Number of Copies"
                    />
                    <TextInput
                        id="number_of_copies"
                        type="number"
                        className="mt-1 block w-full"
                        value={numberOfCopies}
                        onChange={(e) => setNumberOfCopies(e.target.value)}
                        onBlur={(e) => {
                            const value = parseInt(e.target.value) || 2;
                            const clamped = Math.max(2, Math.min(50, value));
                            setNumberOfCopies(clamped.toString());
                        }}
                        min={2}
                        max={50}
                        required
                    />
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        Enter the number of copies to create (2-50). Accession
                        numbers will be auto-generated.
                    </p>
                    <InputError
                        message={multiErrors.number_of_copies}
                        className="mt-1"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="multi_location"
                        value="Location (Optional)"
                    />
                    {renderLocationDropdown(
                        "multiple",
                        multiLocation,
                        handleMultiLocationSelect,
                        () => setMultiLocation(""),
                        multiLocationDropdownOpen,
                        setMultiLocationDropdownOpen,
                        multiLocationSearchTerm,
                        setMultiLocationSearchTerm,
                        multiLocationCurrentPage,
                        setMultiLocationCurrentPage,
                        multiLocationDropdownRef,
                        multiFilteredLocations,
                        multiLocationPaginatedItems,
                        multiLocationTotalPages,
                        selectedMultiLocation,
                        multiLocationTriggerRef,
                        multiLocationDropdownPos,
                        setMultiLocationDropdownPos
                    )}
                    {/* Quick Add Link */}
                    <button
                        type="button"
                        onClick={() => openLocationModal("multiple")}
                        className="mt-1 inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        <Plus size={12} />
                        Location not listed? Click here to add
                    </button>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        All copies will be assigned to this location.
                    </p>
                    <InputError
                        message={multiErrors.location}
                        className="mt-1"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="multi_status" value="Status" />
                    <select
                        id="multi_status"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                        value={multiStatus}
                        onChange={(e) => setMultiStatus(e.target.value)}
                        required
                    >
                        <option value="Available">Available</option>
                        <option value="Borrowed">Borrowed</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Lost">Lost</option>
                        <option value="Under Repair">Under Repair</option>
                    </select>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        All copies will have this status.
                    </p>
                    <InputError message={multiErrors.status} className="mt-1" />
                </div>

                <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-800 dark:bg-blue-900/20">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong>Note:</strong> This will create {numberOfCopies}{" "}
                        copies with auto-generated accession numbers.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-1">
                    <SecondaryButton
                        type="button"
                        onClick={handleClose}
                        disabled={multiProcessing}
                    >
                        Close
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={multiProcessing}>
                        {multiProcessing
                            ? "Creating..."
                            : `Create ${numberOfCopies} Copies`}
                    </PrimaryButton>
                </div>
            </form>
        );
    };

    return (
        <>
            <Modal show={show} onClose={handleClose} maxWidth="md">
                <div className="p-5">
                    <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">
                        Copy Book
                    </h2>
                    <p className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                        Create new copies of{" "}
                        <strong className="dark:text-gray-200">
                            {item?.title}
                        </strong>
                    </p>

                    {/* Tabs */}
                    <div className="mt-3 border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-4">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                            }`}
                                    >
                                        <Icon size={15} className="flex-shrink-0" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-4">{renderTabContent()}</div>
                </div>
            </Modal>

            {/* Location Quick Add Modal */}
            <LocationQuickAddModal
                show={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onLocationAdded={handleLocationAdded}
            />
        </>
    );
}
