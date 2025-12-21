import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { X, User, Calendar, Clock, MapPin, FileText, Search, Eye, Library, ArrowLeft, Check, BookOpen } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "@/components/common/Pagination";

export interface CatalogItemCopy {
    id: number;
    copy_no: number;
    accession_no: string;
    status: string;
    branch?: string;
    location?: string;
    call_no?: string;
}

export interface CatalogItemFull {
    id: number;
    title: string;
    type: string;
    category?: { name: string };
    publisher?: { name: string };
    authors?: Array<{ name: string }>;
    year?: string;
    isbn?: string;
    isbn13?: string;
    call_no?: string;
    series?: string;
    subject?: string;
    edition?: string;
    place_of_publication?: string;
    location?: string;
    description?: string;
    cover_image?: string;
    copies?: CatalogItemCopy[];
    copies_count?: number;
    available_copies_count?: number;
}

interface AddBorrowMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    catalogItems: CatalogItemFull[];
}

interface MemberValidation {
    isValid: boolean | null;
    isChecking: boolean;
    message: string;
}

type CatalogModalView = 'list' | 'details' | 'copies';

export default function AddBorrowMemberModal({
    isOpen,
    onClose,
    catalogItems,
}: AddBorrowMemberModalProps) {
    const [memberValidation, setMemberValidation] = useState<MemberValidation>({
        isValid: null,
        isChecking: false,
        message: "",
    });
    const [borrowerCategory, setBorrowerCategory] = useState<"Student" | "Faculty" | null>(null);
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

    // Catalog selection state
    const [showCatalogModal, setShowCatalogModal] = useState(false);
    const [catalogModalView, setCatalogModalView] = useState<CatalogModalView>('list');
    const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogItemFull | null>(null);
    const [selectedCopy, setSelectedCopy] = useState<CatalogItemCopy | null>(null);
    const [catalogSearchQuery, setCatalogSearchQuery] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    const getToday = () => new Date().toISOString().split("T")[0];

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        member_id: "",
        catalog_item_id: "",
        catalog_item_copy_id: "" as string | number,
        full_name: "",
        email: "",
        quota: "",
        phone: "",
        address: "",
        return_date: getToday(),
        return_time: "13:00",
        notes: "",
    });

    const getMaxBorrowDays = (category: "Student" | "Faculty" | null): number => {
        if (category === "Faculty") return 5;
        if (category === "Student") return 2;
        return 2;
    };

    const calculateReturnDate = (category: "Student" | "Faculty"): string => {
        const date = new Date();
        date.setDate(date.getDate() + getMaxBorrowDays(category));
        return date.toISOString().split("T")[0];
    };

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            const today = getToday();
            reset();
            setData((prevData) => ({
                ...prevData,
                member_id: "",
                catalog_item_id: "",
                catalog_item_copy_id: "",
                full_name: "",
                email: "",
                quota: "",
                phone: "",
                address: "",
                return_date: today,
                return_time: "13:00",
                notes: "",
            }));
            setMemberValidation({ isValid: null, isChecking: false, message: "" });
            setBorrowerCategory(null);
            setDaysRemaining(null);
            setSelectedCatalogItem(null);
            setSelectedCopy(null);
            setShowCatalogModal(false);
            setCatalogModalView('list');
            setCatalogSearchQuery("");
            setCurrentPage(1);
            clearErrors();
        }
    }, [isOpen]);

    // Validate member number and auto-fill form fields
    useEffect(() => {
        if (!isOpen) return;

        if (data.member_id) {
            setMemberValidation({
                isValid: null,
                isChecking: true,
                message: "Checking...",
            });

            const timer = setTimeout(() => {
                axios
                    .get(`/api/members/${data.member_id}`)
                    .then((response) => {
                        const memberData = response.data;
                        const category = memberData.borrower_category || "Student";
                        setBorrowerCategory(category);

                        setData((prevData) => ({
                            ...prevData,
                            full_name: memberData.name || "",
                            email: memberData.email || "",
                            quota: memberData.booking_quota?.toString() || "",
                            phone: memberData.phone || "",
                            return_date: calculateReturnDate(category),
                        }));

                        setMemberValidation({
                            isValid: true,
                            isChecking: false,
                            message: `Valid member (${category}) - ${memberData.name || ""} - Return date set to ${getMaxBorrowDays(category)} days`,
                        });
                    })
                    .catch(() => {
                        setBorrowerCategory(null);
                        setData((prevData) => ({
                            ...prevData,
                            full_name: "",
                            email: "",
                            quota: "",
                            phone: "",
                        }));

                        setMemberValidation({
                            isValid: false,
                            isChecking: false,
                            message: "Member number does not exist",
                        });
                    });
            }, 500);

            return () => clearTimeout(timer);
        } else {
            setBorrowerCategory(null);
            setData((prevData) => ({
                ...prevData,
                full_name: "",
                email: "",
                quota: "",
                phone: "",
            }));
            setMemberValidation({
                isValid: null,
                isChecking: false,
                message: "",
            });
        }
    }, [data.member_id, isOpen]);

    // Calculate days remaining when return_date changes
    useEffect(() => {
        if (data.return_date) {
            const returnDate = new Date(data.return_date);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            returnDate.setHours(0, 0, 0, 0);

            const diffTime = returnDate.getTime() - todayDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysRemaining(diffDays);
        } else {
            setDaysRemaining(null);
        }
    }, [data.return_date]);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [catalogSearchQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.book-requests.store-approved"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Borrow record added and approved successfully!");
                reset();
                handleClose();
            },
            onError: (errors) => {
                if (errors.catalog_item_copy_id) {
                    toast.error(errors.catalog_item_copy_id);
                }
            },
        });
    };

    const handleClose = () => {
        reset();
        setMemberValidation({ isValid: null, isChecking: false, message: "" });
        setBorrowerCategory(null);
        setDaysRemaining(null);
        setSelectedCatalogItem(null);
        setSelectedCopy(null);
        setShowCatalogModal(false);
        setCatalogModalView('list');
        setCatalogSearchQuery("");
        setCurrentPage(1);
        clearErrors();
        onClose();
    };

    const handleOpenCatalogModal = () => {
        setShowCatalogModal(true);
        setCatalogModalView('list');
        setCatalogSearchQuery("");
        setCurrentPage(1);
    };

    const handleViewCatalogDetails = (item: CatalogItemFull) => {
        setSelectedCatalogItem(item);
        setCatalogModalView('details');
    };

    const handleViewAvailableCopies = (item: CatalogItemFull) => {
        setSelectedCatalogItem(item);
        setCatalogModalView('copies');
    };

    const handleSelectCopy = (item: CatalogItemFull, copy: CatalogItemCopy) => {
        setSelectedCatalogItem(item);
        setSelectedCopy(copy);
        setData((prevData) => ({
            ...prevData,
            catalog_item_id: item.id.toString(),
            catalog_item_copy_id: copy.id,
        }));
        setShowCatalogModal(false);
        setCatalogModalView('list');
    };

    const handleBackToList = () => {
        setCatalogModalView('list');
        setSelectedCatalogItem(null);
    };

    const getDaysRemainingText = (): string => {
        if (daysRemaining === null) return "";
        if (daysRemaining === 0) return "Due today";
        if (daysRemaining === 1) return "Due tomorrow";
        return `Due in ${daysRemaining} days`;
    };

    const getValidationBorderClass = (): string => {
        if (memberValidation.isValid === true) return "border-green-300 focus:ring-green-500";
        if (memberValidation.isValid === false) return "border-red-300 focus:ring-red-500";
        return "border-gray-300 focus:ring-indigo-500 dark:border-[#4a4a4a]";
    };

    const getValidationMessageClass = (): string => {
        if (memberValidation.isValid) return "text-green-600";
        if (memberValidation.isValid === false) return "text-red-600";
        return "text-gray-500";
    };

    const isFormValid = memberValidation.isValid === true && data.catalog_item_id && data.catalog_item_copy_id;

    // Filter catalogs based on search
    const filteredCatalogs = catalogItems.filter((item) => {
        const query = catalogSearchQuery.toLowerCase();
        return (
            item.title.toLowerCase().includes(query) ||
            item.type?.toLowerCase().includes(query) ||
            item.category?.name?.toLowerCase().includes(query) ||
            item.publisher?.name?.toLowerCase().includes(query) ||
            item.year?.toLowerCase().includes(query) ||
            item.authors?.some(a => a.name.toLowerCase().includes(query))
        );
    });

    // Paginate filtered catalogs
    const totalItems = filteredCatalogs.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCatalogs = filteredCatalogs.slice(startIndex, endIndex);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/50 transition-opacity"
                onClick={handleClose}
            />

            {/* Modals Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
                <div className={`flex items-start gap-6 px-4 transition-all duration-300 ${showCatalogModal ? 'justify-center' : 'justify-center'}`}>

                    {/* Add Borrow Member Modal - Hidden when viewing details or copies */}
                    {(!showCatalogModal || catalogModalView === 'list') && (
                        <div
                            className={`relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-[#2a2a2a] transition-all duration-300 ${showCatalogModal ? 'ml-4' : ''
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#3a3a3a]"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Modal Header */}
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Add Borrow Member
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Fill out the form to borrow this book
                                </p>
                            </div>

                            {/* Request Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Member Number */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Member Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={data.member_id}
                                            onChange={(e) => setData("member_id", e.target.value)}
                                            className={`w-full rounded-lg border py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 dark:bg-[#3a3a3a] dark:text-white ${getValidationBorderClass()}`}
                                            placeholder="Enter member number"
                                            required
                                        />
                                    </div>
                                    {memberValidation.message && (
                                        <p className={`mt-1 text-xs ${getValidationMessageClass()}`}>
                                            {memberValidation.message}
                                        </p>
                                    )}
                                    {errors.member_id && (
                                        <p className="mt-1 text-xs text-red-600">{errors.member_id}</p>
                                    )}
                                </div>

                                {/* Search a Catalog - Click to open modal */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Search a Catalog <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleOpenCatalogModal}
                                        className={`w-full flex items-center gap-2 rounded-lg border py-2.5 px-3 text-sm text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${selectedCatalogItem
                                            ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                                            : 'border-gray-300 bg-white hover:bg-gray-50 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:hover:bg-[#4a4a4a]'
                                            }`}
                                    >
                                        <Search className="h-4 w-4 text-gray-400" />
                                        {selectedCatalogItem ? (
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 dark:text-white">{selectedCatalogItem.title}</p>
                                                {selectedCopy && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Copy #{selectedCopy.copy_no} - {selectedCopy.accession_no}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 dark:text-gray-400">Click to search and select a catalog...</span>
                                        )}
                                        {selectedCatalogItem && (
                                            <Check className="h-4 w-4 text-green-600" />
                                        )}
                                    </button>
                                    {errors.catalog_item_id && (
                                        <p className="mt-1 text-xs text-red-600">{errors.catalog_item_id}</p>
                                    )}
                                    {errors.catalog_item_copy_id && (
                                        <p className="mt-1 text-xs text-red-600">{errors.catalog_item_copy_id}</p>
                                    )}
                                </div>

                                {/* Return Schedule */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Return Schedule
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                                                Return Date <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="date"
                                                    value={data.return_date}
                                                    onChange={(e) => setData("return_date", e.target.value)}
                                                    min={getToday()}
                                                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                                                Return Time <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="time"
                                                    value={data.return_time}
                                                    onChange={(e) => setData("return_time", e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {daysRemaining !== null && (
                                        <p className="mt-1 text-xs text-indigo-600">{getDaysRemainingText()}</p>
                                    )}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Address
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => setData("address", e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white"
                                            placeholder="Enter your address"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Notes / Message
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) => setData("notes", e.target.value)}
                                            rows={2}
                                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white"
                                            placeholder="Any additional notes..."
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#3a3a3a]">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-gray-200 dark:hover:bg-[#4a4a4a]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing || !isFormValid}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing ? "Adding..." : "Add Record"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Catalog Selection Modal */}
                    {showCatalogModal && (
                        <div
                            className={`relative w-full rounded-xl bg-white shadow-xl dark:bg-[#2a2a2a] overflow-hidden flex flex-col ${catalogModalView === 'list' ? 'max-w-5xl' : 'max-w-7xl'
                                }`}
                            style={{ maxHeight: 'calc(100vh - 100px)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Catalog Modal Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-[#3a3a3a]">
                                <div className="flex items-center gap-3">
                                    {catalogModalView !== 'list' && (
                                        <button
                                            onClick={handleBackToList}
                                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#3a3a3a]"
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </button>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {catalogModalView === 'list' && 'Catalogs'}
                                            {catalogModalView === 'details' && 'Item Info'}
                                            {catalogModalView === 'copies' && `Available Copies ${selectedCatalogItem ? `${selectedCatalogItem.available_copies_count || 0}/${selectedCatalogItem.copies_count || 0}` : ''}`}
                                        </h3>
                                        {catalogModalView !== 'list' && selectedCatalogItem && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCatalogItem.title}</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowCatalogModal(false)}
                                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#3a3a3a]"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Search Bar - Only in list view */}
                            {catalogModalView === 'list' && (
                                <div className="border-b border-gray-200 p-4 dark:border-[#3a3a3a]">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={catalogSearchQuery}
                                            onChange={(e) => setCatalogSearchQuery(e.target.value)}
                                            placeholder="Search catalogs..."
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto">
                                {/* List View - New Design matching Image 2 */}
                                {catalogModalView === 'list' && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="sticky top-0 bg-white border-b border-gray-200 dark:bg-[#2a2a2a] dark:border-[#3a3a3a]">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Title</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Authors/Editors</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Publisher</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Type</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Copies</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-[#3a3a3a]">
                                                {paginatedCatalogs.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <BookOpen className="h-10 w-10 text-gray-300" />
                                                                <p>No catalogs found</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    paginatedCatalogs.map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors">
                                                            {/* Title Column with Cover Image */}
                                                            <td className="px-4 py-4">
                                                                <div className="flex items-start gap-3">
                                                                    {/* Cover Image */}
                                                                    <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden bg-gray-100 dark:bg-[#3a3a3a]">
                                                                        {item.cover_image ? (
                                                                            <img
                                                                                src={`/storage/${item.cover_image}`}
                                                                                alt={item.title}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <BookOpen className="h-6 w-6 text-gray-400" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {/* Title Info */}
                                                                    <div className="min-w-0">
                                                                        <p className="font-semibold text-indigo-600 dark:text-indigo-400 truncate">{item.title}</p>
                                                                        <div className="mt-1 space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                                            {item.edition && (
                                                                                <p>Edition: <span className="text-gray-700 dark:text-gray-300">{item.edition}</span></p>
                                                                            )}
                                                                            {item.year && (
                                                                                <p>Year: <span className="text-gray-700 dark:text-gray-300">{item.year}</span></p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Authors/Editors Column */}
                                                            <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                                {item.authors && item.authors.length > 0
                                                                    ? item.authors.map(a => a.name).join(', ')
                                                                    : '-'
                                                                }
                                                            </td>

                                                            {/* Publisher Column */}
                                                            <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                                {item.publisher?.name || '-'}
                                                            </td>

                                                            {/* Type Column */}
                                                            <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                                {item.type || '-'}
                                                            </td>

                                                            {/* Copies Column */}
                                                            <td className="px-4 py-4 text-center">
                                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                    {item.copies_count || 0}
                                                                </span>
                                                            </td>

                                                            {/* Actions Column */}
                                                            <td className="px-4 py-4">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button
                                                                        onClick={() => handleViewCatalogDetails(item)}
                                                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                                        title="View Details"
                                                                    >
                                                                        <Eye className="h-5 w-5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleViewAvailableCopies(item)}
                                                                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 transition dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                                                                        title="Available Copies"
                                                                    >
                                                                        <Library className="h-5 w-5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Details View */}
                                {catalogModalView === 'details' && selectedCatalogItem && (
                                    <div className="p-6 space-y-4">
                                        <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Item Info</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Type:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.type || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Authors:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">
                                                    {selectedCatalogItem.authors?.map(a => a.name).join(', ') || '-'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Category:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.category?.name || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Publication Year:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.year || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Publisher:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.publisher?.name || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Edition:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.edition || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">ISBN:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.isbn || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">ISBN 13:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.isbn13 || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Call No:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.call_no || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Series:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.series || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Subject:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.subject || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Place of Publication:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.place_of_publication || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Location:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.location || '-'}</span>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-gray-500 dark:text-gray-400">Description:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.description || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Number of Copies:</span>
                                                <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCatalogItem.copies_count || 0}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200 dark:border-[#3a3a3a]">
                                            <button
                                                onClick={() => handleViewAvailableCopies(selectedCatalogItem)}
                                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                            >
                                                View Available Copies
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Copies View */}
                                {catalogModalView === 'copies' && selectedCatalogItem && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-max">
                                            <thead className="sticky top-0 bg-gray-50 dark:bg-[#3a3a3a]">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 whitespace-nowrap">Branch</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 whitespace-nowrap">Accession No</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 whitespace-nowrap">Call No</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 whitespace-nowrap">Copy No</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 whitespace-nowrap">Location</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 whitespace-nowrap">Availability</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 whitespace-nowrap">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-[#3a3a3a]">
                                                {(!selectedCatalogItem.copies || selectedCatalogItem.copies.length === 0) ? (
                                                    <tr>
                                                        <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                                            No copies available
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    selectedCatalogItem.copies.map((copy) => {
                                                        const isAvailable = copy.status === 'Available';
                                                        return (
                                                            <tr key={copy.id} className="hover:bg-gray-50 dark:hover:bg-[#3a3a3a]">
                                                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{copy.branch || 'Main'}</td>
                                                                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{copy.accession_no}</td>
                                                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{selectedCatalogItem.call_no || '-'}</td>
                                                                <td className="px-4 py-3 text-sm text-indigo-600 whitespace-nowrap">{copy.copy_no}</td>
                                                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{copy.location || '-'}</td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${isAvailable
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-red-100 text-red-700'
                                                                        }`}>
                                                                        {isAvailable ? 'Yes' : 'No'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    {isAvailable ? (
                                                                        <button
                                                                            onClick={() => handleSelectCopy(selectedCatalogItem, copy)}
                                                                            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                                                                        >
                                                                            Select
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-xs text-gray-400">Unavailable</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Pagination - Only in list view */}
                            {catalogModalView === 'list' && totalItems > 0 && (
                                <div className="border-t border-gray-200 dark:border-[#3a3a3a]">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={setCurrentPage}
                                        onItemsPerPageChange={setItemsPerPage}
                                        showRowsPerPage={true}
                                        itemsPerPageOptions={[4, 8, 12, 20]}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
