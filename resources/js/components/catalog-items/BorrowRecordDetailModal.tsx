import Modal from "@/components/modals/Modal";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import {
    User,
    Calendar,
    BookOpen,
    Mail,
    Phone,
    MapPin,
    Clock,
    FileText,
    X,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

interface BorrowRecord {
    id: number;
    member_id: number;
    member_name: string;
    member_no: string;
    member_type: string;
    email: string;
    phone: string | null;
    address?: string | null;
    date_borrowed: string;
    date_returned: string | null;
    due_date: string;
    status: string;
    book_title?: string;
    accession_no?: string;
    copy_no?: number;
    notes?: string | null;
}

interface BorrowRecordDetailModalProps {
    show: boolean;
    record: BorrowRecord | null;
    onClose: () => void;
}

export default function BorrowRecordDetailModal({
    show,
    record,
    onClose,
}: BorrowRecordDetailModalProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusInfo = (status: string, dateReturned: string | null) => {
        if (status === "Returned" || dateReturned) {
            return {
                label: "Returned",
                color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                icon: CheckCircle,
                iconColor: "text-green-500",
            };
        }
        if (status === "Approved") {
            return {
                label: "Borrowed",
                color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                icon: BookOpen,
                iconColor: "text-blue-500",
            };
        }
        if (status === "Pending") {
            return {
                label: "Pending",
                color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
                icon: Clock,
                iconColor: "text-yellow-500",
            };
        }
        return {
            label: status,
            color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
            icon: AlertCircle,
            iconColor: "text-gray-500",
        };
    };

    if (!record) return null;

    const statusInfo = getStatusInfo(record.status, record.date_returned);
    const StatusIcon = statusInfo.icon;

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="max-h-[85vh] overflow-y-auto p-4">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${statusInfo.color}`}
                        >
                            <StatusIcon size={16} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                Borrow Record #{record.id}
                            </h2>
                            <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}
                            >
                                {statusInfo.label}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* 2x2 Grid Layout for Cards */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {/* Row 1: Book Information (Left) */}
                    {(record.book_title || record.accession_no) && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                                <BookOpen size={14} />
                                Book Information
                            </h3>
                            <div className="space-y-1.5 text-sm">
                                {record.book_title && (
                                    <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Title
                                        </span>
                                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {record.book_title}
                                        </p>
                                    </div>
                                )}
                                <div className="flex gap-4">
                                    {record.accession_no && (
                                        <div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Accession No.
                                            </span>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {record.accession_no}
                                            </p>
                                        </div>
                                    )}
                                    {record.copy_no && (
                                        <div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Copy No.
                                            </span>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                #{record.copy_no}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Row 1: Member Information (Right) */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                            <User size={14} />
                            Member Information
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Name
                                </span>
                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {record.member_name}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Member No.
                                </span>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {record.member_no}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Type
                                </span>
                                <p>
                                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                        {record.member_type}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ID
                                </span>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {record.member_id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Contact Information (Left) */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                            <Mail size={14} />
                            Contact
                        </h3>
                        <div className="space-y-1.5 text-sm">
                            <div className="flex items-center gap-1.5">
                                <Mail
                                    size={12}
                                    className="flex-shrink-0 text-gray-400 dark:text-gray-500"
                                />
                                <span className="text-gray-900 dark:text-gray-100 truncate">
                                    {record.email}
                                </span>
                            </div>
                            {record.phone && (
                                <div className="flex items-center gap-1.5">
                                    <Phone
                                        size={12}
                                        className="flex-shrink-0 text-gray-400 dark:text-gray-500"
                                    />
                                    <span className="text-gray-900 dark:text-gray-100">
                                        {record.phone}
                                    </span>
                                </div>
                            )}
                            {record.address && (
                                <div className="flex items-start gap-1.5">
                                    <MapPin
                                        size={12}
                                        className="mt-0.5 flex-shrink-0 text-gray-400 dark:text-gray-500"
                                    />
                                    <span className="text-gray-900 dark:text-gray-100">
                                        {record.address}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Borrowing Dates (Right) */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                            <Calendar size={14} />
                            Borrowing Dates
                        </h3>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Borrowed
                                </span>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {formatDate(record.date_borrowed)}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Due Date
                                </span>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {formatDate(record.due_date)}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Returned
                                </span>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {formatDate(record.date_returned)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes - Full Width Below Grid */}
                {record.notes && (
                    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                            <FileText size={14} />
                            Notes
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {record.notes}
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-4 flex justify-end">
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
