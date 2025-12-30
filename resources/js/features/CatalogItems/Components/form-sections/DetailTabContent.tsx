import { useState, useRef, useEffect } from "react";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import { Branch } from "@/types";
import { Search, X, ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface DetailTabContentProps {
    data: {
        volume: string;
        page_duration: string;
        abstract: string;
        biblio_info: string;
        url_visibility: string;
        library_branch: string;
    };
    errors: {
        volume?: string;
        page_duration?: string;
        abstract?: string;
        biblio_info?: string;
        url_visibility?: string;
        library_branch?: string;
    };
    branches?: Branch[];
    onDataChange: (field: string, value: any) => void;
    onClearErrors: (field: string) => void;
    onShowBranchModal?: () => void;
}

const ITEMS_PER_PAGE = 5;

export default function DetailTabContent({
    data,
    errors,
    branches = [],
    onDataChange,
    onClearErrors,
    onShowBranchModal,
}: DetailTabContentProps) {
    // Branch dropdown state
    const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
    const [branchSearchTerm, setBranchSearchTerm] = useState("");
    const [branchCurrentPage, setBranchCurrentPage] = useState(1);
    const branchDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
                setBranchDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter branches based on search
    const filteredBranches = branches.filter((branch) =>
        branch.name.toLowerCase().includes(branchSearchTerm.toLowerCase())
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

    const handleBranchSelect = (branchName: string) => {
        onDataChange("library_branch", branchName);
        onClearErrors("library_branch");
        setBranchDropdownOpen(false);
        setBranchSearchTerm("");
    };

    const handleClearBranch = () => {
        onDataChange("library_branch", "");
        onClearErrors("library_branch");
    };

    const selectedBranch = branches.find((b) => b.name === data.library_branch);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Detail Information
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Additional details for general materials
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="volume" value="Volume" />
                    <TextInput
                        id="volume"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.volume}
                        onChange={(e) => {
                            onDataChange("volume", e.target.value);
                            onClearErrors("volume");
                        }}
                        placeholder="e.g., Vol. 1"
                    />
                    <InputError message={errors.volume} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="page_duration" value="Page / Duration" />
                    <TextInput
                        id="page_duration"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.page_duration}
                        onChange={(e) => {
                            onDataChange("page_duration", e.target.value);
                            onClearErrors("page_duration");
                        }}
                        placeholder="e.g., 320 pages or 90 minutes"
                    />
                    <InputError message={errors.page_duration} className="mt-1" />
                </div>

                <div className="sm:col-span-2">
                    <InputLabel htmlFor="abstract" value="Abstract" />
                    <textarea
                        id="abstract"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        value={data.abstract}
                        onChange={(e) => {
                            onDataChange("abstract", e.target.value);
                            onClearErrors("abstract");
                        }}
                        placeholder="Short summary of the content..."
                    />
                    <InputError message={errors.abstract} className="mt-1" />
                </div>

                <div className="sm:col-span-2">
                    <InputLabel htmlFor="biblio_info" value="Biblio Information" />
                    <textarea
                        id="biblio_info"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        value={data.biblio_info}
                        onChange={(e) => {
                            onDataChange("biblio_info", e.target.value);
                            onClearErrors("biblio_info");
                        }}
                        placeholder="Staff-only notes..."
                    />
                    <InputError message={errors.biblio_info} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="url_visibility" value="URL Visibility" />
                    <select
                        id="url_visibility"
                        value={data.url_visibility}
                        onChange={(e) => {
                            onDataChange("url_visibility", e.target.value);
                            onClearErrors("url_visibility");
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                        <option value="">Select Visibility</option>
                        <option value="Public">Public</option>
                        <option value="Staff Only">Staff Only</option>
                    </select>
                    <InputError message={errors.url_visibility} className="mt-1" />
                </div>

                {/* Branch Dropdown */}
                <div>
                    <InputLabel htmlFor="library_branch" value="Branch" required />
                    <div className="relative mt-1" ref={branchDropdownRef}>
                        <div
                            className={`flex items-center justify-between w-full rounded-md border shadow-sm transition-colors duration-200 cursor-pointer ${branchDropdownOpen
                                    ? "border-indigo-500 ring-1 ring-indigo-500"
                                    : "border-gray-300 dark:border-gray-700"
                                } bg-white dark:bg-gray-800`}
                            onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                        >
                            <div className="flex-1 px-3 py-2">
                                {selectedBranch ? (
                                    <span className="text-gray-900 dark:text-gray-100">
                                        {selectedBranch.name}
                                    </span>
                                ) : (
                                    <span className="text-gray-400 dark:text-gray-500">
                                        Select branch...
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center px-2 gap-1">
                                {data.library_branch && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClearBranch();
                                        }}
                                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-400 transition-transform ${branchDropdownOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        {branchDropdownOpen && (
                            <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                {/* Search Input */}
                                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search branches..."
                                            value={branchSearchTerm}
                                            onChange={(e) => setBranchSearchTerm(e.target.value)}
                                            className="w-full pl-8 pr-3 py-1.5 text-sm rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>

                                {/* Options List */}
                                <div className="max-h-48 overflow-y-auto">
                                    {branchPaginatedItems.length > 0 ? (
                                        branchPaginatedItems.map((branch) => (
                                            <div
                                                key={branch.id}
                                                onClick={() => handleBranchSelect(branch.name)}
                                                className={`px-3 py-2 cursor-pointer text-sm transition-colors ${data.library_branch === branch.name
                                                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    }`}
                                            >
                                                {branch.name}
                                                {branch.address && (
                                                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                                                        {branch.address}
                                                    </span>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No branches found
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {branchTotalPages > 1 && (
                                    <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setBranchCurrentPage((p) => Math.max(1, p - 1));
                                            }}
                                            disabled={branchCurrentPage === 1}
                                            className="p-1 disabled:opacity-50 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            <ChevronLeft size={14} />
                                        </button>
                                        <span>
                                            Page {branchCurrentPage} of {branchTotalPages}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setBranchCurrentPage((p) => Math.min(branchTotalPages, p + 1));
                                            }}
                                            disabled={branchCurrentPage === branchTotalPages}
                                            className="p-1 disabled:opacity-50 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quick Add Link */}
                    {onShowBranchModal && (
                        <button
                            type="button"
                            onClick={onShowBranchModal}
                            className="mt-1 inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            <Plus size={12} />
                            Branch not listed? Click here to add
                        </button>
                    )}
                    <InputError message={errors.library_branch} className="mt-1" />
                </div>
            </div>
        </div>
    );
}
