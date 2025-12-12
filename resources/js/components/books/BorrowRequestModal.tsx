import { useEffect, useState, ChangeEvent } from "react";
import { useForm } from "@inertiajs/react";
import { X, User, Calendar, Clock, MapPin, FileText } from "lucide-react";
import axios from "axios";
import FormInput from "@/components/books/FormInput";

interface BorrowRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    catalogItemId: number;
    catalogItemCopyId: number | null;
}

interface MemberValidation {
    isValid: boolean | null;
    isChecking: boolean;
    message: string;
}

export default function BorrowRequestModal({
    isOpen,
    onClose,
    catalogItemId,
    catalogItemCopyId,
}: BorrowRequestModalProps) {
    const [memberValidation, setMemberValidation] = useState<MemberValidation>({
        isValid: null,
        isChecking: false,
        message: "",
    });
    const [borrowerCategory, setBorrowerCategory] = useState<"Student" | "Faculty" | null>(null);
    const [dateError, setDateError] = useState<string>("");
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

    const getToday = () => new Date().toISOString().split("T")[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        member_id: "",
        catalog_item_id: catalogItemId,
        catalog_item_copy_id: catalogItemCopyId,
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

    // Reset form and sync IDs when modal opens
    useEffect(() => {
        if (isOpen) {
            const today = getToday();
            setData((prevData) => ({
                ...prevData,
                member_id: "",
                catalog_item_id: catalogItemId,
                catalog_item_copy_id: catalogItemCopyId,
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
            setDateError("");
        }
    }, [isOpen, catalogItemId, catalogItemCopyId]);

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
                            message: `Valid member (${category}) - Return date set to ${getMaxBorrowDays(category)} days`,
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("books.borrow-request.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                handleClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        setMemberValidation({ isValid: null, isChecking: false, message: "" });
        setBorrowerCategory(null);
        setDaysRemaining(null);
        setDateError("");
        onClose();
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
        return "border-gray-300 focus:ring-indigo-500";
    };

    const getValidationMessageClass = (): string => {
        if (memberValidation.isValid) return "text-green-600";
        if (memberValidation.isValid === false) return "text-red-600";
        return "text-gray-500";
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Modal Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Borrow Request</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Fill out the form to request borrowing this book
                    </p>
                </div>

                {/* Request Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Member Number */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Member Number <span className="text-red-500">*</span>
                        </label>
                        <FormInput
                            icon={User}
                            type="text"
                            value={data.member_id}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setData("member_id", e.target.value)}
                            className={getValidationBorderClass()}
                            placeholder="Enter member number"
                            required
                        />
                        {memberValidation.message && (
                            <p className={`mt-1 text-xs ${getValidationMessageClass()}`}>
                                {memberValidation.message}
                            </p>
                        )}
                        {errors.member_id && (
                            <p className="mt-1 text-xs text-red-600">{errors.member_id}</p>
                        )}
                    </div>

                    {/* Return Schedule */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Return Schedule
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-xs text-gray-500">
                                    Return Date <span className="text-red-500">*</span>
                                </label>
                                <FormInput
                                    icon={Calendar}
                                    type="date"
                                    value={data.return_date}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setData("return_date", e.target.value)}
                                    min={getToday()}
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-gray-500">
                                    Return Time <span className="text-red-500">*</span>
                                </label>
                                <FormInput
                                    icon={Clock}
                                    type="time"
                                    value={data.return_time}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setData("return_time", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {daysRemaining !== null && (
                            <p className="mt-1 text-xs text-indigo-600">{getDaysRemainingText()}</p>
                        )}
                        {dateError && (
                            <p className="mt-1 text-xs text-red-600">{dateError}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <FormInput
                            icon={MapPin}
                            type="text"
                            value={data.address}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setData("address", e.target.value)}
                            placeholder="Enter your address"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Notes / Message
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <textarea
                                value={data.notes}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData("notes", e.target.value)}
                                rows={2}
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Any additional notes..."
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={processing || memberValidation.isValid !== true}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? "Submitting..." : "Submit Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
