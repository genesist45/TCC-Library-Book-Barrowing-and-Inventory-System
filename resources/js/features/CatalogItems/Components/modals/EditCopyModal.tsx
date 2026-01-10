import Modal from "@/components/modals/Modal";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import { useState, useEffect, useRef } from "react";
import { X, Search, User, ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Branch, Location } from "@/types";
import LocationQuickAddModal from "./LocationQuickAddModal";

interface Member {
    id: number;
    member_no: string;
    name: string;
    type?: string;
    borrower_category?: string;
    status?: string;
}

interface CopyItem {
    id: number;
    accession_no: string;
    copy_no: number;
    branch?: string;
    location?: string;
    status: string;
    reserved_by_member_id?: number | null;
    reserved_by_member?: {
        id: number;
        name: string;
        member_no: string;
        type?: string;
    } | null;
}

interface EditCopyModalProps {
    show: boolean;
    copy: CopyItem | null;
    branches?: Branch[];
    locations?: Location[];
    onClose: () => void;
    onSuccess: () => void;
}

const ITEMS_PER_PAGE = 5;

export default function EditCopyModal({
    show,
    copy,
    branches = [],
    locations = [],
    onClose,
    onSuccess,
}: EditCopyModalProps) {
    const [accessionNo, setAccessionNo] = useState("");
    const [branch, setBranch] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Available");
    const [reservedByMemberId, setReservedByMemberId] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Local branches and locations state (for quick add)
    const [localBranches, setLocalBranches] = useState<Branch[]>(branches);
    const [localLocations, setLocalLocations] = useState<Location[]>(locations);

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

    // Location modal state
    const [showLocationModal, setShowLocationModal] = useState(false);

    // Member search state
    const [memberSearch, setMemberSearch] = useState("");
    const [memberSearchResults, setMemberSearchResults] = useState<Member[]>([]);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);

    // List fetching logic
    const fetchBranches = async () => {
        setLoadingBranches(true);
        try {
            const response = await axios.get(route("admin.branches.index"));
            setLocalBranches(response.data.branches || []);
        } catch (error) {
            console.error("Failed to fetch branches:", error);
        } finally {
            setLoadingBranches(false);
        }
    };

    const fetchLocations = async () => {
        setLoadingLocations(true);
        try {
            const response = await axios.get(route("admin.locations.list"));
            setLocalLocations(response.data.locations || response.data || []);
        } catch (error) {
            console.error("Failed to fetch locations:", error);
        } finally {
            setLoadingLocations(false);
        }
    };

    // Update local state when props change or fetch if empty
    useEffect(() => {
        if (show) {
            if (branches.length > 0) {
                setLocalBranches(branches);
            } else {
                fetchBranches();
            }
        }
    }, [branches, show]);

    useEffect(() => {
        if (show) {
            if (locations.length > 0) {
                setLocalLocations(locations);
            } else {
                fetchLocations();
            }
        }
    }, [locations, show]);

    useEffect(() => {
        if (show && copy) {
            setAccessionNo(copy.accession_no || "");
            setBranch(copy.branch || "");
            setLocation(copy.location || "");
            setStatus(copy.status || "Available");
            setReservedByMemberId(copy.reserved_by_member_id || null);
            if (copy.reserved_by_member) {
                setSelectedMember({
                    id: copy.reserved_by_member.id,
                    member_no: copy.reserved_by_member.member_no,
                    name: copy.reserved_by_member.name,
                    type: copy.reserved_by_member.type || '',
                    borrower_category: '',
                    status: '',
                });
                setMemberSearch(copy.reserved_by_member.name);
            } else {
                setSelectedMember(null);
                setMemberSearch("");
            }
            setErrors({});
        }
    }, [show, copy]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
                setBranchDropdownOpen(false);
            }
            if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
                setLocationDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter branches based on search
    const filteredBranches = localBranches.filter((b) =>
        b.name.toLowerCase().includes(branchSearchTerm.toLowerCase())
    );

    // Pagination for branches
    const branchTotalPages = Math.ceil(filteredBranches.length / ITEMS_PER_PAGE);
    const branchPaginatedItems = filteredBranches.slice(
        (branchCurrentPage - 1) * ITEMS_PER_PAGE,
        branchCurrentPage * ITEMS_PER_PAGE
    );

    // Reset pagination when search changes
    useEffect(() => {
        setBranchCurrentPage(1);
    }, [branchSearchTerm]);

    // Filter locations based on search
    const filteredLocations = localLocations.filter((l) =>
        l.name.toLowerCase().includes(locationSearchTerm.toLowerCase())
    );

    // Pagination for locations
    const locationTotalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE);
    const locationPaginatedItems = filteredLocations.slice(
        (locationCurrentPage - 1) * ITEMS_PER_PAGE,
        locationCurrentPage * ITEMS_PER_PAGE
    );

    // Reset pagination when search changes
    useEffect(() => {
        setLocationCurrentPage(1);
    }, [locationSearchTerm]);

    // Search members when typing
    useEffect(() => {
        const searchMembers = async () => {
            if (memberSearch.length < 2) {
                setMemberSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const response = await axios.get(route("admin.members.search"), {
                    params: { query: memberSearch }
                });
                setMemberSearchResults(response.data);
                setShowMemberDropdown(true);
            } catch (error) {
                console.error("Failed to search members:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounce = setTimeout(searchMembers, 300);
        return () => clearTimeout(debounce);
    }, [memberSearch]);

    const validateAccessionNo = async (value: string) => {
        if (value.length !== 7) return;
        if (value === copy?.accession_no) {
            const { accession_no, ...rest } = errors;
            setErrors(rest);
            return;
        }

        try {
            const response = await axios.post(
                route("admin.copies.validate-accession-no"),
                { accession_no: value },
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

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        // Clear member selection if status is not Reserved
        if (newStatus !== "Reserved") {
            setSelectedMember(null);
            setReservedByMemberId(null);
            setMemberSearch("");
        }
    };

    const handleSelectMember = (member: Member) => {
        setSelectedMember(member);
        setReservedByMemberId(member.id);
        setMemberSearch(member.name);
        setShowMemberDropdown(false);
    };

    const handleClearMember = () => {
        setSelectedMember(null);
        setReservedByMemberId(null);
        setMemberSearch("");
    };

    const handleBranchSelect = (branchName: string) => {
        setBranch(branchName);
        setBranchDropdownOpen(false);
        setBranchSearchTerm("");
    };

    const handleLocationSelect = (locationName: string) => {
        setLocation(locationName);
        setLocationDropdownOpen(false);
        setLocationSearchTerm("");
    };

    const handleLocationAdded = async (name: string) => {
        try {
            const response = await axios.post(route('admin.locations.store'), {
                name,
                is_published: true,
            });

            if (response.data) {
                const newLocation = response.data.location;
                setLocalLocations([...localLocations, newLocation]);
                setLocation(newLocation.name);
                setShowLocationModal(false);
                toast.success('Location added successfully!');
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                toast.error(error.response.data.errors.name?.[0] || 'Failed to add location');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!copy) return;

        // Validate member selection for Reserved status
        if (status === "Reserved" && !reservedByMemberId) {
            setErrors({ ...errors, reserved_by_member_id: "Please select a member for the reservation" });
            return;
        }

        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.put(
                route("admin.copies.update", copy.id),
                {
                    accession_no: accessionNo,
                    branch: branch || null,
                    location: location || null,
                    status,
                    reserved_by_member_id: status === "Reserved" ? reservedByMemberId : null,
                },
            );

            if (response.data.success) {
                toast.success("Copy updated successfully");
                onSuccess();
                handleClose();
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error("Failed to update copy");
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        setAccessionNo("");
        setBranch("");
        setLocation("");
        setStatus("Available");
        setReservedByMemberId(null);
        setSelectedMember(null);
        setMemberSearch("");
        setMemberSearchResults([]);
        setShowMemberDropdown(false);
        setBranchDropdownOpen(false);
        setLocationDropdownOpen(false);
        setBranchSearchTerm("");
        setLocationSearchTerm("");
        setErrors({});
        onClose();
    };


    return (
        <>
            <Modal show={show} onClose={handleClose} maxWidth="sm">
                <div className="p-4">
                    {/* Header */}
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
                                Edit Copy #{copy?.copy_no}
                            </h2>
                            <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                                Update copy details
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Accession No */}
                        <div>
                            <InputLabel
                                htmlFor="edit_accession_no"
                                value="Accession No."
                                className="text-xs"
                                required
                            />
                            <TextInput
                                id="edit_accession_no"
                                type="text"
                                className="mt-1 block w-full text-sm"
                                value={accessionNo}
                                onChange={handleAccessionNoChange}
                                placeholder="0000000"
                                maxLength={7}
                                required
                            />
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                Must be 7 digits and unique.
                            </p>
                            <InputError
                                message={errors.accession_no}
                                className="mt-1"
                            />
                        </div>

                        {/* Branch Dropdown */}
                        <div>
                            <InputLabel
                                htmlFor="edit_branch"
                                value="Branch"
                                className="text-xs"
                                required
                            />
                            <div className="relative mt-1" ref={branchDropdownRef}>
                                <div
                                    className={`flex items-center justify-between w-full rounded-md border shadow-sm transition-colors duration-200 cursor-pointer text-sm ${branchDropdownOpen
                                        ? "border-indigo-500 ring-1 ring-indigo-500"
                                        : "border-gray-300 dark:border-gray-700"
                                        } bg-white dark:bg-gray-900`}
                                    onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                                >
                                    <div className="flex-1 px-3 py-1.5">
                                        {branch ? (
                                            <span className="text-gray-900 dark:text-gray-100">
                                                {branch}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500">
                                                Select branch...
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center px-2 gap-1">
                                        {branch && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setBranch("");
                                                }}
                                                className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                        <ChevronDown
                                            size={14}
                                            className={`text-gray-400 transition-transform ${branchDropdownOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* Branch Dropdown Menu */}
                                {branchDropdownOpen && (
                                    <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                        {/* Search Input */}
                                        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                            <div className="relative">
                                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search branches..."
                                                    value={branchSearchTerm}
                                                    onChange={(e) => setBranchSearchTerm(e.target.value)}
                                                    className="w-full pl-7 pr-3 py-1 text-xs rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        </div>

                                        {/* Options */}
                                        <div className="max-h-36 overflow-y-auto">
                                            {loadingBranches ? (
                                                <div className="px-3 py-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                                    Loading...
                                                </div>
                                            ) : branchPaginatedItems.length > 0 ? (
                                                branchPaginatedItems.map((b) => (
                                                    <div
                                                        key={b.id}
                                                        onClick={() => handleBranchSelect(b.name)}
                                                        className={`px-3 py-1.5 cursor-pointer text-xs transition-colors ${branch === b.name
                                                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                                            }`}
                                                    >
                                                        {b.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-3 py-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                                    No branches found
                                                </div>
                                            )}
                                        </div>

                                        {/* Pagination */}
                                        {branchTotalPages > 1 && (
                                            <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setBranchCurrentPage((p) => Math.max(1, p - 1));
                                                    }}
                                                    disabled={branchCurrentPage === 1}
                                                    className="p-0.5 disabled:opacity-50 hover:text-gray-700 dark:hover:text-gray-300"
                                                >
                                                    <ChevronLeft size={12} />
                                                </button>
                                                <span className="text-[10px]">
                                                    {branchCurrentPage} / {branchTotalPages}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setBranchCurrentPage((p) => Math.min(branchTotalPages, p + 1));
                                                    }}
                                                    disabled={branchCurrentPage === branchTotalPages}
                                                    className="p-0.5 disabled:opacity-50 hover:text-gray-700 dark:hover:text-gray-300"
                                                >
                                                    <ChevronRight size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <InputError message={errors.branch} className="mt-1" />
                        </div>

                        {/* Location Dropdown */}
                        <div>
                            <InputLabel
                                htmlFor="edit_location"
                                value="Location (Optional)"
                                className="text-xs"
                            />
                            <div className="relative mt-1" ref={locationDropdownRef}>
                                <div
                                    className={`flex items-center justify-between w-full rounded-md border shadow-sm transition-colors duration-200 cursor-pointer text-sm ${locationDropdownOpen
                                        ? "border-indigo-500 ring-1 ring-indigo-500"
                                        : "border-gray-300 dark:border-gray-700"
                                        } bg-white dark:bg-gray-900`}
                                    onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                                >
                                    <div className="flex-1 px-3 py-1.5">
                                        {location ? (
                                            <span className="text-gray-900 dark:text-gray-100">
                                                {location}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500">
                                                Select location...
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center px-2 gap-1">
                                        {location && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setLocation("");
                                                }}
                                                className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                        <ChevronDown
                                            size={14}
                                            className={`text-gray-400 transition-transform ${locationDropdownOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* Location Dropdown Menu */}
                                {locationDropdownOpen && (
                                    <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                        {/* Search Input */}
                                        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                            <div className="relative">
                                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search locations..."
                                                    value={locationSearchTerm}
                                                    onChange={(e) => setLocationSearchTerm(e.target.value)}
                                                    className="w-full pl-7 pr-3 py-1 text-xs rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        </div>

                                        {/* Options */}
                                        <div className="max-h-36 overflow-y-auto">
                                            {loadingLocations ? (
                                                <div className="px-3 py-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                                    Loading...
                                                </div>
                                            ) : locationPaginatedItems.length > 0 ? (
                                                locationPaginatedItems.map((l) => (
                                                    <div
                                                        key={l.id}
                                                        onClick={() => handleLocationSelect(l.name)}
                                                        className={`px-3 py-1.5 cursor-pointer text-xs transition-colors ${location === l.name
                                                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                                            }`}
                                                    >
                                                        {l.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-3 py-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                                    No locations found
                                                </div>
                                            )}
                                        </div>

                                        {/* Pagination */}
                                        {locationTotalPages > 1 && (
                                            <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setLocationCurrentPage((p) => Math.max(1, p - 1));
                                                    }}
                                                    disabled={locationCurrentPage === 1}
                                                    className="p-0.5 disabled:opacity-50 hover:text-gray-700 dark:hover:text-gray-300"
                                                >
                                                    <ChevronLeft size={12} />
                                                </button>
                                                <span className="text-[10px]">
                                                    {locationCurrentPage} / {locationTotalPages}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setLocationCurrentPage((p) => Math.min(locationTotalPages, p + 1));
                                                    }}
                                                    disabled={locationCurrentPage === locationTotalPages}
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
                            <button
                                type="button"
                                onClick={() => setShowLocationModal(true)}
                                className="mt-1 inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                <Plus size={10} />
                                Location not listed? Click here to add
                            </button>
                            <InputError message={errors.location} className="mt-1" />
                        </div>

                        {/* Status */}
                        <div>
                            <InputLabel
                                htmlFor="edit_status"
                                value="Status"
                                className="text-xs"
                            />
                            <select
                                id="edit_status"
                                className={`mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 ${copy?.status === 'Paid'
                                    ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                                    : ''
                                    }`}
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                required
                                disabled={copy?.status === 'Paid'}
                            >
                                <option value="Available">Available</option>
                                <option value="Borrowed">Checked Out</option>
                                <option value="Reserved">Reserved</option>
                                <option value="Lost">Lost</option>
                                <option value="Under Repair">Under Repair</option>
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                            </select>
                            {copy?.status === 'Paid' && (
                                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                    Status cannot be changed for copies with payment-related status.
                                </p>
                            )}
                            <InputError message={errors.status} className="mt-1" />
                        </div>

                        {/* Member Selection - Only show when Reserved is selected */}
                        {status === "Reserved" && (
                            <div>
                                <InputLabel
                                    htmlFor="edit_member"
                                    value="Select Member"
                                    className="text-xs"
                                />
                                <div className="relative mt-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            id="edit_member"
                                            type="text"
                                            className="block w-full rounded-md border-gray-300 py-1.5 pl-9 pr-10 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                            placeholder="Search by name or member no..."
                                            value={memberSearch}
                                            onChange={(e) => {
                                                setMemberSearch(e.target.value);
                                                if (selectedMember) {
                                                    setSelectedMember(null);
                                                    setReservedByMemberId(null);
                                                }
                                            }}
                                            onFocus={() => memberSearchResults.length > 0 && setShowMemberDropdown(true)}
                                        />
                                        {selectedMember && (
                                            <button
                                                type="button"
                                                onClick={handleClearMember}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Dropdown Results */}
                                    {showMemberDropdown && memberSearchResults.length > 0 && (
                                        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                            {memberSearchResults.map((member) => (
                                                <button
                                                    key={member.id}
                                                    type="button"
                                                    onClick={() => handleSelectMember(member)}
                                                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                                            {member.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {member.member_no} • {member.borrower_category}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {isSearching && (
                                        <p className="mt-1 text-xs text-gray-500">Searching...</p>
                                    )}
                                </div>

                                {/* Selected Member Display */}
                                {selectedMember && (
                                    <div className="mt-2 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 dark:border-green-800 dark:bg-green-900/20">
                                        <User size={16} className="text-green-600 dark:text-green-400" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                                {selectedMember.name}
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-400">
                                                {selectedMember.member_no}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <InputError
                                    message={errors.reserved_by_member_id}
                                    className="mt-1"
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <SecondaryButton
                                type="button"
                                onClick={handleClose}
                                disabled={processing}
                                className="text-sm"
                            >
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="text-sm"
                            >
                                {processing ? "Saving..." : "Save"}
                            </PrimaryButton>
                        </div>
                    </form>
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
