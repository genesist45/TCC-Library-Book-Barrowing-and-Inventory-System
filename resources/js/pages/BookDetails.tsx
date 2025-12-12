import { PageProps, CatalogItem, CatalogItemCopy } from "@/types";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import PublicHeader from "@/components/common/PublicHeader";
import { useEffect, useState } from "react";
import {
    BookOpen,
    ArrowLeft,
    Calendar,
    Clock,
    X,
    User,
    Mail,
    Phone,
    MapPin,
    FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import Toast from "@/components/common/Toast";
import axios from "axios";

interface Props extends PageProps {
    catalogItem: CatalogItem & {
        copies?: CatalogItemCopy[];
        copies_count?: number;
    };
}

export default function BookDetails({ auth, catalogItem }: Props) {
    const { flash } = usePage().props as any;
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedCopy, setSelectedCopy] = useState<CatalogItemCopy | null>(
        null,
    );
    const [memberValidation, setMemberValidation] = useState<{
        isValid: boolean | null;
        isChecking: boolean;
        message: string;
    }>({ isValid: null, isChecking: false, message: "" });
    const [borrowerCategory, setBorrowerCategory] = useState<
        "Student" | "Faculty" | null
    >(null);
    const [dateError, setDateError] = useState<string>("");
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

    const getMaxBorrowDays = (
        category: "Student" | "Faculty" | null,
    ): number => {
        if (category === "Faculty") return 5;
        if (category === "Student") return 2;
        return 2;
    };

    const calculateReturnDate = (category: "Student" | "Faculty"): string => {
        const date = new Date();
        date.setDate(date.getDate() + getMaxBorrowDays(category));
        return date.toISOString().split("T")[0];
    };

    const today = new Date().toISOString().split("T")[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        member_id: "",
        catalog_item_id: catalogItem.id,
        catalog_item_copy_id: null as number | null,
        full_name: "",
        email: "",
        quota: "",
        phone: "",
        address: "",
        return_date: today,
        return_time: "13:00",
        notes: "",
    });

    // Validate member number and auto-fill form fields
    useEffect(() => {
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
                        const category =
                            memberData.borrower_category || "Student";
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
    }, [data.member_id]);

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
                toast.success("Book request submitted successfully!");
                reset();
                setShowRequestModal(false);
                setBorrowerCategory(null);
                setDateError("");
                setSelectedCopy(null);
            },
        });
    };

    const openRequestModal = (copy?: CatalogItemCopy) => {
        setSelectedCopy(copy || null);
        if (copy) {
            setData("catalog_item_copy_id", copy.id);
        }
        setShowRequestModal(true);
    };

    const closeRequestModal = () => {
        setShowRequestModal(false);
        reset();
        setData("catalog_item_copy_id", null);
        setMemberValidation({ isValid: null, isChecking: false, message: "" });
        setBorrowerCategory(null);
        setDaysRemaining(null);
        setDateError("");
        setSelectedCopy(null);
    };

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleGoBack = () => {
        router.visit("/");
    };

    // Detail row component for consistent styling
    const DetailRow = ({
        label,
        value,
        isLink = false,
    }: {
        label: string;
        value: string | undefined | null;
        isLink?: boolean;
    }) => {
        if (!value) return null;
        return (
            <div className="grid grid-cols-3 gap-4 border-b border-gray-100 py-3">
                <dt className="text-sm font-medium text-gray-500">{label}</dt>
                <dd
                    className={`col-span-2 text-sm ${isLink ? "font-semibold text-indigo-600" : "text-gray-900"}`}
                >
                    {value}
                </dd>
            </div>
        );
    };

    return (
        <>
            <Head title={catalogItem.title} />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-jakarta">
                <PublicHeader user={auth.user} />

                <main className="container mx-auto px-4 py-24 sm:px-6 lg:px-12">
                    <div className="mx-auto max-w-6xl">
                        {/* Back Button */}
                        <button
                            onClick={handleGoBack}
                            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-indigo-600"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Catalog
                        </button>

                        {/* Main Content Card */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                            {/* Header */}
                            <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                                <h1 className="text-2xl font-bold text-white">
                                    {catalogItem.title}
                                </h1>
                            </div>

                            {/* Book Details Section */}
                            <div className="p-6">
                                <div className="flex flex-col gap-8 lg:flex-row">
                                    {/* Left Side - Book Information */}
                                    <div className="flex-1">
                                        <dl className="divide-y divide-gray-100">
                                            <DetailRow
                                                label="Type"
                                                value={catalogItem.type}
                                            />
                                            <DetailRow
                                                label="Authors"
                                                value={
                                                    catalogItem.authors &&
                                                        catalogItem.authors.length >
                                                        0
                                                        ? catalogItem.authors
                                                            .map(
                                                                (a) => a.name,
                                                            )
                                                            .join(", ")
                                                        : undefined
                                                }
                                                isLink
                                            />
                                            <DetailRow
                                                label="Category"
                                                value={
                                                    catalogItem.category?.name
                                                }
                                            />
                                            <DetailRow
                                                label="Publication Year"
                                                value={catalogItem.year}
                                            />
                                            <DetailRow
                                                label="Publisher"
                                                value={
                                                    catalogItem.publisher?.name
                                                }
                                                isLink
                                            />
                                            <DetailRow
                                                label="Edition"
                                                value={catalogItem.edition}
                                            />
                                            <DetailRow
                                                label="Volume"
                                                value={catalogItem.volume}
                                            />
                                            <DetailRow
                                                label="ISBN"
                                                value={catalogItem.isbn}
                                            />
                                            <DetailRow
                                                label="ISBN 13"
                                                value={catalogItem.isbn13}
                                            />
                                            <DetailRow
                                                label="ISSN"
                                                value={catalogItem.issn}
                                            />
                                            <DetailRow
                                                label="Call No"
                                                value={catalogItem.call_no}
                                            />
                                            <DetailRow
                                                label="Accession No"
                                                value={catalogItem.accession_no}
                                            />
                                            <DetailRow
                                                label="Series"
                                                value={catalogItem.series}
                                            />
                                            <DetailRow
                                                label="Subject"
                                                value={catalogItem.subject}
                                            />
                                            <DetailRow
                                                label="Place of Publication"
                                                value={
                                                    catalogItem.place_of_publication
                                                }
                                            />
                                            <DetailRow
                                                label="Location"
                                                value={catalogItem.location}
                                            />
                                            <DetailRow
                                                label="Abstract"
                                                value={catalogItem.abstract}
                                            />
                                            <DetailRow
                                                label="Description"
                                                value={catalogItem.description}
                                            />
                                            <DetailRow
                                                label="Biblio Notes"
                                                value={catalogItem.biblio_info}
                                            />
                                            <div className="grid grid-cols-3 gap-4 border-b border-gray-100 py-3">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Number of Copies
                                                </dt>
                                                <dd className="col-span-2 text-sm font-semibold text-gray-900">
                                                    {catalogItem.copies_count ??
                                                        catalogItem.copies
                                                            ?.length ??
                                                        0}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Right Side - Cover Image */}
                                    <div className="flex justify-center lg:w-72 lg:flex-shrink-0">
                                        {catalogItem.cover_image ? (
                                            <img
                                                src={`/storage/${catalogItem.cover_image}`}
                                                alt={catalogItem.title}
                                                className="h-auto max-h-96 w-full rounded-lg border border-gray-200 object-cover shadow-md lg:w-64"
                                            />
                                        ) : (
                                            <div className="flex h-80 w-56 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                                <BookOpen className="h-16 w-16 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Copies Table Section */}
                            {catalogItem.copies &&
                                catalogItem.copies.length > 0 && (
                                    <div className="border-t border-gray-200 p-6">
                                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                            Available Copies
                                        </h2>
                                        <div className="overflow-hidden rounded-lg border border-gray-200">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-200 bg-gray-50">
                                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                                Branch
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                                Accession No
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                                Call No
                                                            </th>
                                                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                                Copy No
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                                Location
                                                            </th>
                                                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                                Availability
                                                            </th>
                                                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 bg-white">
                                                        {catalogItem.copies.map(
                                                            (copy) => (
                                                                <tr
                                                                    key={
                                                                        copy.id
                                                                    }
                                                                    className="transition-colors hover:bg-gray-50"
                                                                >
                                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                                                        {copy.branch ||
                                                                            "Main"}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                                                                        {
                                                                            copy.accession_no
                                                                        }
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                                        {catalogItem.call_no ||
                                                                            "—"}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-600">
                                                                        {
                                                                            copy.copy_no
                                                                        }
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                                        {copy.location ||
                                                                            "—"}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-3 text-center">
                                                                        <span
                                                                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${copy.status ===
                                                                                    "Available"
                                                                                    ? "bg-green-100 text-green-800"
                                                                                    : "bg-red-100 text-red-800"
                                                                                }`}
                                                                        >
                                                                            {copy.status ===
                                                                                "Available"
                                                                                ? "Yes"
                                                                                : "No"}
                                                                        </span>
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-3 text-center">
                                                                        {copy.status ===
                                                                            "Available" ? (
                                                                            <button
                                                                                onClick={() =>
                                                                                    openRequestModal(
                                                                                        copy,
                                                                                    )
                                                                                }
                                                                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                            >
                                                                                Request
                                                                            </button>
                                                                        ) : (
                                                                            <span className="text-xs text-gray-400">
                                                                                Unavailable
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* No Copies Message */}
                            {(!catalogItem.copies ||
                                catalogItem.copies.length === 0) && (
                                    <div className="border-t border-gray-200 p-6">
                                        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                                            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">
                                                No copies available for this item
                                            </p>
                                            <button
                                                onClick={() => openRequestModal()}
                                                className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                                            >
                                                Request This Book
                                            </button>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Borrow Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 transition-opacity"
                        onClick={closeRequestModal}
                    />

                    {/* Modal */}
                    <div className="relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        {/* Close Button */}
                        <button
                            onClick={closeRequestModal}
                            className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Modal Header */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Borrow Request
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Fill out the form to request borrowing this book
                            </p>
                        </div>

                        {/* Request Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Member Number */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Member Number{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.member_id}
                                        onChange={(e) =>
                                            setData("member_id", e.target.value)
                                        }
                                        className={`w-full rounded-lg border py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 ${memberValidation.isValid === true
                                                ? "border-green-300 focus:ring-green-500"
                                                : memberValidation.isValid ===
                                                    false
                                                    ? "border-red-300 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-indigo-500"
                                            }`}
                                        placeholder="Enter member number"
                                        required
                                    />
                                </div>
                                {memberValidation.message && (
                                    <p
                                        className={`mt-1 text-xs ${memberValidation.isValid
                                                ? "text-green-600"
                                                : memberValidation.isValid ===
                                                    false
                                                    ? "text-red-600"
                                                    : "text-gray-500"
                                            }`}
                                    >
                                        {memberValidation.message}
                                    </p>
                                )}
                                {errors.member_id && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.member_id}
                                    </p>
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
                                            Return Date{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="date"
                                                value={data.return_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "return_date",
                                                        e.target.value,
                                                    )
                                                }
                                                min={today}
                                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs text-gray-500">
                                            Return Time{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="time"
                                                value={data.return_time}
                                                onChange={(e) =>
                                                    setData(
                                                        "return_time",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                {daysRemaining !== null && (
                                    <p className="mt-1 text-xs text-indigo-600">
                                        {daysRemaining === 0
                                            ? "Due today"
                                            : daysRemaining === 1
                                                ? "Due tomorrow"
                                                : `Due in ${daysRemaining} days`}
                                    </p>
                                )}
                                {dateError && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {dateError}
                                    </p>
                                )}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData("address", e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter your address"
                                    />
                                </div>
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
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
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
                                    onClick={closeRequestModal}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        memberValidation.isValid !== true
                                    }
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? "Submitting..."
                                        : "Submit Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Toast />
        </>
    );
}
