import Modal from "@/components/modals/Modal";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Copy, Layers, Search, ChevronDown, ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import { PreviewCopy } from "../tables/RelatedCopiesPreview";
import { Branch, Location } from "@/types";
import LocationQuickAddModal from "./LocationQuickAddModal";
import { toast } from "react-toastify";

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

interface PreviewCopyBookModalProps {
    show: boolean;
    title: string;
    editingCopy?: PreviewCopy | null;
    branches?: Branch[];
    locations?: Location[];
    defaultBranch?: string;
    defaultLocation?: string;
    onClose: () => void;
    onSaveSingle: (copy: PreviewCopy) => void;
    onSaveMultiple: (copies: PreviewCopy[]) => void;
    existingCopies: PreviewCopy[];
    nextCopyId: number;
    onBranchesUpdate?: (branches: Branch[]) => void;
    onLocationsUpdate?: (locations: Location[]) => void;
}

export default function PreviewCopyBookModal({
    show,
    title,
    editingCopy,
    branches = [],
    locations = [],
    defaultBranch = "Main Library",
    defaultLocation = "",
    onClose,
    onSaveSingle,
    onSaveMultiple,
    existingCopies,
    nextCopyId,
    onBranchesUpdate,
    onLocationsUpdate,
}: PreviewCopyBookModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>("single");

    // Local state for branches and locations (for quick add)
    const [localBranches, setLocalBranches] = useState<Branch[]>(branches);
    const [localLocations, setLocalLocations] = useState<Location[]>(locations);

    // Single copy state
    const [accessionNo, setAccessionNo] = useState("");
    const [branch, setBranch] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Available");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Multiple copies state
    const [numberOfCopies, setNumberOfCopies] = useState(2);
    const [multiBranch, setMultiBranch] = useState("");
    const [multiLocation, setMultiLocation] = useState("");
    const [multiStatus, setMultiStatus] = useState("Available");
    const [baseAccessionNo, setBaseAccessionNo] = useState(0);

    // Branch dropdown state
    const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
    const [branchSearchTerm, setBranchSearchTerm] = useState("");
    const [branchCurrentPage, setBranchCurrentPage] = useState(1);
    const branchDropdownRef = useRef<HTMLDivElement>(null);

    // Location dropdown state
    const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
    const [locationSearchTerm, setLocationSearchTerm] = useState("");
    const [locationCurrentPage, setLocationCurrentPage] = useState(1);
    const locationDropdownRef = useRef<HTMLDivElement>(null);

    // Multi Branch dropdown state
    const [multiBranchDropdownOpen, setMultiBranchDropdownOpen] = useState(false);
    const [multiBranchSearchTerm, setMultiBranchSearchTerm] = useState("");
    const [multiBranchCurrentPage, setMultiBranchCurrentPage] = useState(1);
    const multiBranchDropdownRef = useRef<HTMLDivElement>(null);

    // Multi Location dropdown state
    const [multiLocationDropdownOpen, setMultiLocationDropdownOpen] = useState(false);
    const [multiLocationSearchTerm, setMultiLocationSearchTerm] = useState("");
    const [multiLocationCurrentPage, setMultiLocationCurrentPage] = useState(1);
    const multiLocationDropdownRef = useRef<HTMLDivElement>(null);

    // Location modal state
    const [showLocationModal, setShowLocationModal] = useState(false);

    // Sync local state with props
    useEffect(() => {
        setLocalBranches(branches);
    }, [branches]);

    useEffect(() => {
        setLocalLocations(locations);
    }, [locations]);

    useEffect(() => {
        if (show) {
            if (editingCopy) {
                // Editing mode - use the copy's values
                setActiveTab("single");
                setAccessionNo(editingCopy.accession_no);
                setBranch(editingCopy.branch || defaultBranch);
                setLocation(editingCopy.location || defaultLocation);
                setStatus(editingCopy.status);
            } else {
                // Adding mode - use defaults and fetch next accession number
                setBranch(defaultBranch);
                setLocation(defaultLocation);
                setMultiBranch(defaultBranch);
                setMultiLocation(defaultLocation);
                generateAccessionNo();
            }
        }
    }, [show, editingCopy, defaultBranch, defaultLocation]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
                setBranchDropdownOpen(false);
            }
            if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
                setLocationDropdownOpen(false);
            }
            if (multiBranchDropdownRef.current && !multiBranchDropdownRef.current.contains(event.target as Node)) {
                setMultiBranchDropdownOpen(false);
            }
            if (multiLocationDropdownRef.current && !multiLocationDropdownRef.current.contains(event.target as Node)) {
                setMultiLocationDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter and paginate branches
    const filteredBranches = localBranches.filter((b) =>
        b.name.toLowerCase().includes(branchSearchTerm.toLowerCase())
    );
    const branchTotalPages = Math.ceil(filteredBranches.length / ITEMS_PER_PAGE);
    const branchPaginatedItems = filteredBranches.slice(
        (branchCurrentPage - 1) * ITEMS_PER_PAGE,
        branchCurrentPage * ITEMS_PER_PAGE
    );

    // Filter and paginate locations
    const filteredLocations = localLocations.filter((l) =>
        l.name.toLowerCase().includes(locationSearchTerm.toLowerCase())
    );
    const locationTotalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE);
    const locationPaginatedItems = filteredLocations.slice(
        (locationCurrentPage - 1) * ITEMS_PER_PAGE,
        locationCurrentPage * ITEMS_PER_PAGE
    );

    // Filter and paginate multi branches
    const filteredMultiBranches = localBranches.filter((b) =>
        b.name.toLowerCase().includes(multiBranchSearchTerm.toLowerCase())
    );
    const multiBranchTotalPages = Math.ceil(filteredMultiBranches.length / ITEMS_PER_PAGE);
    const multiBranchPaginatedItems = filteredMultiBranches.slice(
        (multiBranchCurrentPage - 1) * ITEMS_PER_PAGE,
        multiBranchCurrentPage * ITEMS_PER_PAGE
    );

    // Filter and paginate multi locations
    const filteredMultiLocations = localLocations.filter((l) =>
        l.name.toLowerCase().includes(multiLocationSearchTerm.toLowerCase())
    );
    const multiLocationTotalPages = Math.ceil(filteredMultiLocations.length / ITEMS_PER_PAGE);
    const multiLocationPaginatedItems = filteredMultiLocations.slice(
        (multiLocationCurrentPage - 1) * ITEMS_PER_PAGE,
        multiLocationCurrentPage * ITEMS_PER_PAGE
    );

    // Reset pagination when search changes
    useEffect(() => { setBranchCurrentPage(1); }, [branchSearchTerm]);
    useEffect(() => { setLocationCurrentPage(1); }, [locationSearchTerm]);
    useEffect(() => { setMultiBranchCurrentPage(1); }, [multiBranchSearchTerm]);
    useEffect(() => { setMultiLocationCurrentPage(1); }, [multiLocationSearchTerm]);

    const generateAccessionNo = async () => {
        try {
            const response = await axios.get(
                route("admin.copies.generate-accession-no"),
            );
            let nextNo = parseInt(response.data.accession_no, 10);

            // Also check against existing preview copies and keep incrementing until unique
            const existingAccessionNos = new Set(existingCopies.map(c => c.accession_no));
            let maxAttempts = 1000;
            let attempts = 0;

            while (attempts < maxAttempts) {
                const candidate = String(nextNo).padStart(7, "0");
                if (!existingAccessionNos.has(candidate)) {
                    setAccessionNo(candidate);
                    setBaseAccessionNo(nextNo);
                    return;
                }
                nextNo++;
                attempts++;
            }

            // Fallback if all attempts exhausted
            const fallback = String(nextNo).padStart(7, "0");
            setAccessionNo(fallback);
            setBaseAccessionNo(nextNo);
        } catch (error) {
            console.error("Failed to generate accession number:", error);
            // Fallback to simple generation based on existing copies
            const maxExisting = Math.max(
                ...existingCopies.map(c => parseInt(c.accession_no) || 0),
                0
            );
            const nextNo = String(maxExisting + 1).padStart(7, "0");
            setAccessionNo(nextNo);
            setBaseAccessionNo(maxExisting + 1);
        }
    };

    const handleAccessionNoChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 7);
        setAccessionNo(value);

        // Clear error when user types
        if (errors.accession_no) {
            const { accession_no, ...rest } = errors;
            setErrors(rest);
        }
    };

    const handleLocationAdded = async (name: string) => {
        try {
            const response = await axios.post(route('admin.locations.store'), {
                name,
                is_published: true,
            });

            if (response.data) {
                const newLocation = response.data.location;
                const updatedLocations = [...localLocations, newLocation];
                setLocalLocations(updatedLocations);
                setLocation(newLocation.name);
                setShowLocationModal(false);
                toast.success('Location added successfully!');

                // Notify parent to update locations
                if (onLocationsUpdate) {
                    onLocationsUpdate(updatedLocations);
                }
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                toast.error(error.response.data.errors.name?.[0] || 'Failed to add location');
            }
        }
    };

    const validateSingle = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!accessionNo || accessionNo.length !== 7) {
            newErrors.accession_no = "Accession number must be 7 digits";
        }

        // Check for duplicates in existing copies (except if editing the same copy)
        const duplicate = existingCopies.find(
            c => c.accession_no === accessionNo && c.id !== editingCopy?.id
        );
        if (duplicate) {
            newErrors.accession_no = "This accession number already exists";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSingleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateSingle()) return;

        const copy: PreviewCopy = {
            id: editingCopy?.id || nextCopyId,
            copy_no: editingCopy?.copy_no || existingCopies.length + 1,
            accession_no: accessionNo,
            branch: branch || undefined,
            location: location || undefined,
            status: status,
        };

        onSaveSingle(copy);
        resetForm();
    };

    const handleMultipleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newCopies: PreviewCopy[] = [];
        let currentAccNo = baseAccessionNo;

        // Build set of existing accession numbers for fast lookup
        const existingAccessionNos = new Set(existingCopies.map(c => c.accession_no));

        for (let i = 0; i < numberOfCopies; i++) {
            // Find the next available accession number
            let candidate = String(currentAccNo).padStart(7, "0");
            while (existingAccessionNos.has(candidate)) {
                currentAccNo++;
                candidate = String(currentAccNo).padStart(7, "0");
            }

            newCopies.push({
                id: nextCopyId + i,
                copy_no: existingCopies.length + i + 1,
                accession_no: candidate,
                branch: multiBranch || undefined,
                location: multiLocation || undefined,
                status: multiStatus,
            });

            // Add to set so next iteration doesn't use the same number
            existingAccessionNos.add(candidate);
            currentAccNo++;
        }

        onSaveMultiple(newCopies);
        resetForm();
    };

    const resetForm = () => {
        setAccessionNo("");
        setBranch(defaultBranch);
        setLocation(defaultLocation);
        setStatus("Available");
        setErrors({});
        setNumberOfCopies(2);
        setMultiBranch(defaultBranch);
        setMultiLocation(defaultLocation);
        setMultiStatus("Available");
        setBranchSearchTerm("");
        setLocationSearchTerm("");
        setMultiBranchSearchTerm("");
        setMultiLocationSearchTerm("");
    };

    const handleClose = () => {
        resetForm();
        setActiveTab("single");
        onClose();
    };

    const handleTabChange = (tab: TabType) => {
        if (editingCopy) return; // Can't switch tabs when editing
        setActiveTab(tab);
        setErrors({});
    };

    const selectedBranch = localBranches.find((b) => b.name === branch);
    const selectedLocation = localLocations.find((l) => l.name === location);
    const selectedMultiBranch = localBranches.find((b) => b.name === multiBranch);
    const selectedMultiLocation = localLocations.find((l) => l.name === multiLocation);

    const renderDropdown = (
        type: 'branch' | 'location' | 'multiBranch' | 'multiLocation',
        label: string,
        required: boolean = false
    ) => {
        const configs = {
            branch: {
                value: branch,
                setValue: setBranch,
                dropdownOpen: branchDropdownOpen,
                setDropdownOpen: setBranchDropdownOpen,
                searchTerm: branchSearchTerm,
                setSearchTerm: setBranchSearchTerm,
                currentPage: branchCurrentPage,
                setCurrentPage: setBranchCurrentPage,
                items: branchPaginatedItems,
                totalPages: branchTotalPages,
                dropdownRef: branchDropdownRef,
                selected: selectedBranch,
                placeholder: "Select branch...",
                searchPlaceholder: "Search branches...",
                noItemsText: "No branches found",
                showQuickAdd: false,
            },
            location: {
                value: location,
                setValue: setLocation,
                dropdownOpen: locationDropdownOpen,
                setDropdownOpen: setLocationDropdownOpen,
                searchTerm: locationSearchTerm,
                setSearchTerm: setLocationSearchTerm,
                currentPage: locationCurrentPage,
                setCurrentPage: setLocationCurrentPage,
                items: locationPaginatedItems,
                totalPages: locationTotalPages,
                dropdownRef: locationDropdownRef,
                selected: selectedLocation,
                placeholder: "Select location...",
                searchPlaceholder: "Search locations...",
                noItemsText: "No locations found",
                showQuickAdd: true,
            },
            multiBranch: {
                value: multiBranch,
                setValue: setMultiBranch,
                dropdownOpen: multiBranchDropdownOpen,
                setDropdownOpen: setMultiBranchDropdownOpen,
                searchTerm: multiBranchSearchTerm,
                setSearchTerm: setMultiBranchSearchTerm,
                currentPage: multiBranchCurrentPage,
                setCurrentPage: setMultiBranchCurrentPage,
                items: multiBranchPaginatedItems,
                totalPages: multiBranchTotalPages,
                dropdownRef: multiBranchDropdownRef,
                selected: selectedMultiBranch,
                placeholder: "Select branch...",
                searchPlaceholder: "Search branches...",
                noItemsText: "No branches found",
                showQuickAdd: false,
            },
            multiLocation: {
                value: multiLocation,
                setValue: setMultiLocation,
                dropdownOpen: multiLocationDropdownOpen,
                setDropdownOpen: setMultiLocationDropdownOpen,
                searchTerm: multiLocationSearchTerm,
                setSearchTerm: setMultiLocationSearchTerm,
                currentPage: multiLocationCurrentPage,
                setCurrentPage: setMultiLocationCurrentPage,
                items: multiLocationPaginatedItems,
                totalPages: multiLocationTotalPages,
                dropdownRef: multiLocationDropdownRef,
                selected: selectedMultiLocation,
                placeholder: "Select location...",
                searchPlaceholder: "Search locations...",
                noItemsText: "No locations found",
                showQuickAdd: true,
            },
        };

        const config = configs[type];

        return (
            <div>
                <InputLabel value={label} required={required} />
                <div className="relative mt-1" ref={config.dropdownRef}>
                    <div
                        className={`flex items-center justify-between w-full rounded-md border shadow-sm transition-colors duration-200 cursor-pointer text-sm ${config.dropdownOpen
                            ? "border-indigo-500 ring-1 ring-indigo-500"
                            : "border-gray-300 dark:border-gray-700"
                            } bg-white dark:bg-gray-900`}
                        onClick={() => config.setDropdownOpen(!config.dropdownOpen)}
                    >
                        <div className="flex-1 px-3 py-1.5">
                            {config.selected ? (
                                <span className="text-gray-900 dark:text-gray-100">
                                    {config.selected.name}
                                </span>
                            ) : (
                                <span className="text-gray-400 dark:text-gray-500">
                                    {config.placeholder}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center px-2 gap-1">
                            {config.value && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        config.setValue("");
                                    }}
                                    className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X size={12} />
                                </button>
                            )}
                            <ChevronDown
                                size={14}
                                className={`text-gray-400 transition-transform ${config.dropdownOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {config.dropdownOpen && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                            {/* Search Input */}
                            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={config.searchPlaceholder}
                                        value={config.searchTerm}
                                        onChange={(e) => config.setSearchTerm(e.target.value)}
                                        className="w-full pl-7 pr-3 py-1 text-xs rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>

                            {/* Options */}
                            <div className="max-h-36 overflow-y-auto">
                                {config.items.length > 0 ? (
                                    config.items.map((item: any) => (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                config.setValue(item.name);
                                                config.setDropdownOpen(false);
                                                config.setSearchTerm("");
                                            }}
                                            className={`px-3 py-1.5 cursor-pointer text-xs transition-colors ${config.value === item.name
                                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            {item.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-3 py-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                        {config.noItemsText}
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {config.totalPages > 1 && (
                                <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            config.setCurrentPage(Math.max(1, config.currentPage - 1));
                                        }}
                                        disabled={config.currentPage === 1}
                                        className="p-0.5 disabled:opacity-50 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        <ChevronLeft size={12} />
                                    </button>
                                    <span className="text-[10px]">
                                        {config.currentPage} / {config.totalPages}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            config.setCurrentPage(Math.min(config.totalPages, config.currentPage + 1));
                                        }}
                                        disabled={config.currentPage === config.totalPages}
                                        className="p-0.5 disabled:opacity-50 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        <ChevronRight size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Add Link */}
                {config.showQuickAdd && (
                    <button
                        type="button"
                        onClick={() => setShowLocationModal(true)}
                        className="mt-1 inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        <Plus size={10} />
                        Location not listed? Click here to add
                    </button>
                )}
            </div>
        );
    };

    const renderSingleTab = () => (
        <form onSubmit={handleSingleSubmit} className="space-y-3">
            <div>
                <InputLabel htmlFor="accession_no" value="Accession No." />
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
                    Auto-generated. You can edit if needed (must be 7 digits and unique).
                </p>
                <InputError message={errors.accession_no} className="mt-1" />
            </div>

            {renderDropdown('branch', 'Branch', true)}
            {renderDropdown('location', 'Location (Optional)')}

            <div>
                <InputLabel htmlFor="status" value="Status" />
                <select
                    id="status"
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                >
                    <option value="Available">Available</option>
                    <option value="Borrowed">Checked Out</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Lost">Lost</option>
                    <option value="Under Repair">Under Repair</option>
                </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <SecondaryButton type="button" onClick={handleClose}>
                    Close
                </SecondaryButton>
                <PrimaryButton type="submit">
                    {editingCopy ? "Update Copy" : "Save Copy"}
                </PrimaryButton>
            </div>
        </form>
    );

    const renderMultipleTab = () => (
        <form onSubmit={handleMultipleSubmit} className="space-y-3">
            <div>
                <InputLabel htmlFor="number_of_copies" value="Number of Copies" />
                <TextInput
                    id="number_of_copies"
                    type="number"
                    className="mt-1 block w-full"
                    value={numberOfCopies}
                    onChange={(e) =>
                        setNumberOfCopies(
                            Math.max(2, Math.min(50, parseInt(e.target.value) || 2)),
                        )
                    }
                    min={2}
                    max={50}
                    required
                />
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Enter the number of copies to create (2-50). Accession numbers will be auto-generated.
                </p>
            </div>

            {renderDropdown('multiBranch', 'Branch', true)}

            <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-2">
                All copies will be assigned to this branch.
            </p>

            {renderDropdown('multiLocation', 'Location (Optional)')}

            <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-2">
                All copies will be assigned to this location.
            </p>

            <div>
                <InputLabel htmlFor="multi_status" value="Status" />
                <select
                    id="multi_status"
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                    value={multiStatus}
                    onChange={(e) => setMultiStatus(e.target.value)}
                    required
                >
                    <option value="Available">Available</option>
                    <option value="Borrowed">Checked Out</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Lost">Lost</option>
                    <option value="Under Repair">Under Repair</option>
                </select>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    All copies will have this status.
                </p>
            </div>

            <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-800 dark:bg-blue-900/20">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> This will create {numberOfCopies} copies with auto-generated accession numbers.
                </p>
            </div>

            <div className="flex justify-end gap-3 pt-1">
                <SecondaryButton type="button" onClick={handleClose}>
                    Close
                </SecondaryButton>
                <PrimaryButton type="submit">
                    Create {numberOfCopies} Copies
                </PrimaryButton>
            </div>
        </form>
    );

    return (
        <>
            <Modal show={show} onClose={handleClose} maxWidth="md">
                <div className="p-5">
                    <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">
                        {editingCopy ? "Edit Copy" : "Copy Book"}
                    </h2>
                    <p className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                        {editingCopy ? "Update copy details" : "Create new copies of"}{" "}
                        <strong className="dark:text-gray-200">{title}</strong>
                    </p>

                    {/* Tabs - Only show when not editing */}
                    {!editingCopy && (
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
                    )}

                    {/* Tab Content */}
                    <div className="mt-4">
                        {activeTab === "single" || editingCopy
                            ? renderSingleTab()
                            : renderMultipleTab()}
                    </div>
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
