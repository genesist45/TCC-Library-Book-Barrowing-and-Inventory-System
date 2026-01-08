import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { X, User, Calendar, Clock, MapPin, FileText, Check, BookOpen } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import type { CatalogItemFull, CatalogItemCopy, MemberValidation } from "../../types/borrow";

interface BorrowModalProps {
    isOpen: boolean;
    onClose: () => void;
    catalogItem: CatalogItemFull;
    copy: CatalogItemCopy;
    onSuccess?: () => void;
}

export default function BorrowModal({
    isOpen,
    onClose,
    catalogItem,
    copy,
    onSuccess,
}: BorrowModalProps) {
    const [memberValidation, setMemberValidation] = useState<MemberValidation>({
        isValid: null,
        isChecking: false,
        message: "",
    });
    const [borrowerCategory, setBorrowerCategory] = useState<"Student" | "Faculty" | null>(null);
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

    const getToday = () => new Date().toISOString().split("T")[0];

    const { data, setData, post, processing, reset } = useForm({
        member_id: "",
        catalog_item_id: catalogItem.id.toString(),
        catalog_item_copy_id: copy.id,
        full_name: "",
        email: "",
        quota: "",
        phone: "",
        address: "",
        return_date: getToday(),
        return_time: "13:00",
        notes: "",
    });

    // Helper functions
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

    const getMaxDate = (): string | undefined => {
        if (!borrowerCategory) return undefined;
        return calculateReturnDate(borrowerCategory);
    };

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            reset();
            setData({
                member_id: "",
                catalog_item_id: catalogItem.id.toString(),
                catalog_item_copy_id: copy.id,
                full_name: "",
                email: "",
                quota: "",
                phone: "",
                address: "",
                return_date: getToday(),
                return_time: "13:00",
                notes: "",
            });
            setMemberValidation({ isValid: null, isChecking: false, message: "" });
            setBorrowerCategory(null);
        }
    }, [isOpen, catalogItem.id, copy.id]);

    // Validate member number
    useEffect(() => {
        if (!isOpen) return;

        if (data.member_id) {
            setMemberValidation({ isValid: null, isChecking: true, message: "Checking..." });

            const timer = setTimeout(() => {
                axios
                    .get(`/api/members/${data.member_id}`)
                    .then((response) => {
                        const memberData = response.data;
                        const category = memberData.borrower_category || "Student";
                        setBorrowerCategory(category);

                        setData((prev) => ({
                            ...prev,
                            full_name: memberData.name || "",
                            email: memberData.email || "",
                            quota: memberData.booking_quota?.toString() || "",
                            phone: memberData.phone || "",
                            return_date: calculateReturnDate(category),
                        }));

                        setMemberValidation({
                            isValid: true,
                            isChecking: false,
                            message: `Valid member (${category}) - ${memberData.name || ""}`,
                        });
                    })
                    .catch(() => {
                        setBorrowerCategory(null);
                        setData((prev) => ({
                            ...prev,
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
            setMemberValidation({ isValid: null, isChecking: false, message: "" });
        }
    }, [data.member_id, isOpen]);

    // Calculate days remaining
    useEffect(() => {
        if (data.return_date) {
            const returnDate = new Date(data.return_date);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            returnDate.setHours(0, 0, 0, 0);
            const diffTime = returnDate.getTime() - todayDate.getTime();
            setDaysRemaining(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        } else {
            setDaysRemaining(null);
        }
    }, [data.return_date]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.book-requests.store-approved"), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                onSuccess?.();
            },
            onError: (errors) => {
                console.error('Borrow errors:', errors);
                // Show the first specific error or a generic message
                const errorMessage = errors.catalog_item_copy_id
                    || errors.member_id
                    || errors.return_date
                    || errors.error
                    || Object.values(errors)[0]
                    || "Failed to create borrow record";
                toast.error(errorMessage);
            },
        });
    };

    const getValidationBorderClass = () => {
        if (memberValidation.isValid === true) return "border-green-300 focus:ring-green-500";
        if (memberValidation.isValid === false) return "border-red-300 focus:ring-red-500";
        return "border-gray-300 focus:ring-indigo-500 dark:border-[#4a4a4a]";
    };

    const getValidationMessageClass = () => {
        if (memberValidation.isValid) return "text-green-600";
        if (memberValidation.isValid === false) return "text-red-600";
        return "text-gray-500";
    };

    const getDaysRemainingText = () => {
        if (daysRemaining === null) return "";
        if (daysRemaining === 0) return "Due today";
        if (daysRemaining === 1) return "Due tomorrow";
        return `Due in ${daysRemaining} days`;
    };

    const isFormValid = memberValidation.isValid === true;

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
                <div
                    className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-[#2a2a2a] mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#3a3a3a]"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Modal Header */}
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Borrow Book
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Fill in the borrower details for this book
                        </p>
                    </div>

                    {/* Selected Book Info */}
                    <div className="mb-5 rounded-lg border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-800 dark:bg-indigo-900/20">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                    {catalogItem.title}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Copy #{copy.copy_no} • Accession: {copy.accession_no}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
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
                                    autoFocus
                                    required
                                />
                            </div>
                            {memberValidation.message && (
                                <p className={`mt-1 text-xs ${getValidationMessageClass()}`}>
                                    {memberValidation.message}
                                </p>
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
                                            max={getMaxDate()}
                                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white"
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
                                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white"
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
                                    placeholder="Enter address"
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
                                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white resize-none"
                                    placeholder="Any additional notes..."
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-[#3a3a3a]">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-gray-200 dark:hover:bg-[#4a4a4a]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing || !isFormValid}
                                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? "Adding..." : "Add Record"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
