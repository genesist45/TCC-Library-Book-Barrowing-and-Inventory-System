import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useState } from "react";
import { BookOpen, User, Building2, Calendar, BookMarked, Hash, Layers, MapPin, Barcode } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { BorrowModal } from "../Components/borrow";
import type { CatalogItemFull, CatalogItemCopy } from "../types/borrow.d";

interface Props extends PageProps {
    catalogItem: CatalogItemFull;
}

type TabType = "info" | "copies";

export default function AvailableCopiesPage({ catalogItem }: Props) {
    const [activeTab, setActiveTab] = useState<TabType>("copies");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const [selectedCopy, setSelectedCopy] = useState<CatalogItemCopy | null>(null);

    const copies = catalogItem.copies || [];
    const totalItems = copies.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCopies = copies.slice(startIndex, startIndex + itemsPerPage);

    const available = catalogItem.available_copies_count ?? 0;
    const total = catalogItem.copies_count ?? 0;

    const handleBorrow = (copy: CatalogItemCopy) => {
        setSelectedCopy(copy);
        setShowBorrowModal(true);
    };

    const handleBorrowSuccess = () => {
        router.reload();
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${catalogItem.title} - Available Copies`} />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header with Book Info */}
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-[#3a3a3a] dark:bg-[#2a2a2a] sm:p-6">
                        <div className="flex items-start gap-4">
                            {/* Thumbnail */}
                            <div className="flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden bg-gray-100 dark:bg-[#3a3a3a] border border-gray-200 dark:border-[#4a4a4a]">
                                {catalogItem.cover_image ? (
                                    <img
                                        src={`/storage/${catalogItem.cover_image}`}
                                        alt={catalogItem.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <BookOpen className="h-10 w-10 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            {/* Title and Details */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                                    {catalogItem.title}
                                </h1>
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                                    {catalogItem.authors && catalogItem.authors.length > 0 && (
                                        <span className="flex items-center gap-1">
                                            <User className="h-3.5 w-3.5" />
                                            {catalogItem.authors.map((a) => a.name).join(", ")}
                                        </span>
                                    )}
                                    {catalogItem.publisher?.name && (
                                        <span className="flex items-center gap-1">
                                            <Building2 className="h-3.5 w-3.5" />
                                            {catalogItem.publisher.name}
                                        </span>
                                    )}
                                    {catalogItem.year && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {catalogItem.year}
                                        </span>
                                    )}
                                    {catalogItem.type && (
                                        <span className="flex items-center gap-1">
                                            <BookMarked className="h-3.5 w-3.5" />
                                            {catalogItem.type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        {/* Tab Headers */}
                        <div className="flex border-b border-gray-200 dark:border-[#3a3a3a] bg-gray-50 dark:bg-[#3a3a3a]">
                            <button
                                onClick={() => setActiveTab("info")}
                                className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "info"
                                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-[#2a2a2a]"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                    }`}
                            >
                                ITEM INFO
                            </button>
                            <div className="flex items-center text-gray-300 dark:text-gray-600 px-2">|</div>
                            <button
                                onClick={() => setActiveTab("copies")}
                                className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "copies"
                                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-[#2a2a2a]"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                    }`}
                            >
                                AVAILABLE COPIES{" "}
                                <span className="ml-1 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                    {available}/{total}
                                </span>
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === "info" && (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#3a3a3a] pb-2">
                                            Basic Information
                                        </h3>
                                        <div className="space-y-3">
                                            <InfoRow icon={BookOpen} label="Title" value={catalogItem.title} />
                                            <InfoRow icon={User} label="Author(s)" value={catalogItem.authors?.map(a => a.name).join(", ") || "-"} />
                                            <InfoRow icon={Building2} label="Publisher" value={catalogItem.publisher?.name || "-"} />
                                            <InfoRow icon={BookMarked} label="Type" value={catalogItem.type || "-"} />
                                            <InfoRow icon={Layers} label="Category" value={catalogItem.category?.name || "-"} />
                                        </div>
                                    </div>

                                    {/* Publication Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#3a3a3a] pb-2">
                                            Publication Details
                                        </h3>
                                        <div className="space-y-3">
                                            <InfoRow icon={Calendar} label="Year" value={catalogItem.year || "-"} />
                                            <InfoRow icon={Hash} label="Edition" value={catalogItem.edition || "-"} />
                                            <InfoRow icon={Layers} label="Volume" value={catalogItem.volume || "-"} />
                                            <InfoRow icon={Barcode} label="ISBN" value={catalogItem.isbn || catalogItem.isbn13 || "-"} />
                                            <InfoRow icon={MapPin} label="Call No." value={catalogItem.call_no || "-"} />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {catalogItem.description && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#3a3a3a] pb-2 mb-3">
                                            Description
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {catalogItem.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "copies" && (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-[#3a3a3a]">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                    Branch
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                    Accession No
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                    Call No
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                    Copy No
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                    Location
                                                </th>
                                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                    Availability
                                                </th>
                                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-[#3a3a3a]">
                                            {paginatedCopies.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                                                    >
                                                        No copies found for this catalog item
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedCopies.map((copy) => {
                                                    const isAvailable = copy.status === "Available";
                                                    return (
                                                        <tr
                                                            key={copy.id}
                                                            className="hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors"
                                                        >
                                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                                {copy.branch || "Main"}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {copy.accession_no}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                                {catalogItem.call_no || "-"}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                                                                {copy.copy_no}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                                {copy.location || "-"}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span
                                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${isAvailable
                                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                                        }`}
                                                                >
                                                                    {isAvailable ? "Yes" : "No"}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                {isAvailable ? (
                                                                    <button
                                                                        onClick={() => handleBorrow(copy)}
                                                                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                                                                    >
                                                                        Borrow
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

                                {/* Pagination */}
                                {totalItems > 0 && (
                                    <div className="border-t border-gray-200 dark:border-[#3a3a3a]">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalItems={totalItems}
                                            itemsPerPage={itemsPerPage}
                                            onPageChange={setCurrentPage}
                                            onItemsPerPageChange={setItemsPerPage}
                                            showRowsPerPage={true}
                                            itemsPerPageOptions={[10, 20, 30, 50]}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Borrow Modal */}
            {selectedCopy && (
                <BorrowModal
                    isOpen={showBorrowModal}
                    onClose={() => {
                        setShowBorrowModal(false);
                        setSelectedCopy(null);
                    }}
                    catalogItem={catalogItem}
                    copy={selectedCopy}
                    onSuccess={handleBorrowSuccess}
                />
            )}
        </AuthenticatedLayout>
    );
}

// Helper component for info rows
function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-500 dark:text-gray-500">{label}</span>
                <p className="text-sm text-gray-900 dark:text-gray-100">{value}</p>
            </div>
        </div>
    );
}
