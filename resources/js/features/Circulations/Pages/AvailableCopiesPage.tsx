import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useState } from "react";
import {
    BookOpen, User, Building2, Calendar, BookMarked, Hash, Layers,
    MapPin, Barcode, ChevronDown, ChevronUp, Globe, Info, Ruler,
    FileText, BookOpen as JournalIcon, GraduationCap
} from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { BorrowModal } from "../Components/borrow";
import SuccessModal from "@/components/modals/SuccessModal";
import type { CatalogItemFull, CatalogItemCopy } from "../types/borrow";

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
    const [showMore, setShowMore] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const copies = catalogItem.copies || [];
    const totalItems = copies.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCopies = copies.slice(startIndex, startIndex + itemsPerPage);

    const available = catalogItem.available_copies_count ?? 0;
    const total = catalogItem.copies_count ?? 0;

    const hasDetail = !!(catalogItem.volume || catalogItem.page_duration || catalogItem.abstract || catalogItem.biblio_info || catalogItem.url_visibility || catalogItem.library_branch);
    const hasJournal = !!(catalogItem.issn || catalogItem.frequency || catalogItem.journal_type || catalogItem.issue_type || catalogItem.issue_period);
    const hasThesis = !!(catalogItem.granting_institution || catalogItem.degree_qualification || catalogItem.supervisor || catalogItem.thesis_date || catalogItem.thesis_period || catalogItem.publication_type);
    const hasAnyMoreInfo = hasDetail || hasJournal || hasThesis;

    const handleBorrow = (copy: CatalogItemCopy) => {
        setSelectedCopy(copy);
        setShowBorrowModal(true);
    };

    const handleBorrowSuccess = () => {
        setShowSuccessModal(true);
        router.reload();
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${catalogItem.title} - Available Copies`} />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header with Book Info */}
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-[#3a3a3a] dark:bg-[#2a2a2a] sm:p-6 transition-colors duration-200">
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
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-[#3a3a3a] dark:bg-[#2a2a2a] transition-colors duration-200">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#3a3a3a] pb-2">
                                            Basic Information
                                        </h3>
                                        <div className="space-y-4">
                                            <InfoRow icon={BookOpen} label="Title" value={catalogItem.title} />
                                            <InfoRow icon={User} label="Authors" value={catalogItem.authors?.map(a => a.name).join(", ")} />
                                            <InfoRow icon={BookMarked} label="Material Type" value={catalogItem.type} />
                                            <InfoRow icon={Layers} label="Category" value={catalogItem.category?.name} />
                                            <InfoRow icon={Building2} label="Publisher" value={catalogItem.publisher?.name} />
                                            <InfoRow icon={Calendar} label="Year of Publication" value={catalogItem.year} />
                                            <InfoRow icon={MapPin} label="Place of Publication" value={catalogItem.place_of_publication} />
                                            <InfoRow icon={Hash} label="Edition" value={catalogItem.edition} />
                                            <InfoRow icon={Layers} label="Series" value={catalogItem.series} />
                                        </div>
                                    </div>

                                    {/* Publication Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#3a3a3a] pb-2">
                                            Physical & Additional Details
                                        </h3>
                                        <div className="space-y-4">
                                            <InfoRow icon={Barcode} label="ISBN" value={catalogItem.isbn} />
                                            <InfoRow icon={Barcode} label="ISBN-13" value={catalogItem.isbn13} />
                                            <InfoRow icon={MapPin} label="Call Number" value={catalogItem.call_no} />
                                            <InfoRow icon={Layers} label="Subject" value={catalogItem.subject} />
                                            <InfoRow icon={Ruler} label="Extent" value={catalogItem.extent} />
                                            <InfoRow icon={Info} label="Other Physical Details" value={catalogItem.other_physical_details} />
                                            <InfoRow icon={Ruler} label="Dimensions" value={catalogItem.dimensions} />
                                            <InfoRow icon={MapPin} label="Location" value={catalogItem.location} />
                                            <InfoRow icon={Globe} label="URL" value={catalogItem.url} />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {catalogItem.description && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#3a3a3a] pb-2 mb-3">
                                            Description
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                                            {catalogItem.description}
                                        </p>
                                    </div>
                                )}

                                {/* More Info Content */}
                                {showMore && (
                                    <div className="mt-8 space-y-10 animate-in fade-in slide-in-from-top-4 duration-300">
                                        {hasDetail && (
                                            <section>
                                                <h4 className="flex items-center gap-2 mb-4 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                                    <FileText className="h-4 w-4" />
                                                    DETAILS
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-gray-50 dark:bg-[#3a3a3a]/30">
                                                    <InfoRow icon={Layers} label="Volume" value={catalogItem.volume} />
                                                    <InfoRow icon={Info} label="Page / Duration" value={catalogItem.page_duration} />
                                                    <InfoRow icon={Info} label="URL Visibility" value={catalogItem.url_visibility} />
                                                    <InfoRow icon={Building2} label="Branch" value={catalogItem.library_branch} />
                                                    <div className="md:col-span-2">
                                                        <InfoRow icon={Info} label="Abstract" value={catalogItem.abstract} />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <InfoRow icon={Info} label="Biblio Information" value={catalogItem.biblio_info} />
                                                    </div>
                                                </div>
                                                <hr className="mt-8 border-gray-200 dark:border-[#3a3a3a]" />
                                            </section>
                                        )}

                                        {hasJournal && (
                                            <section>
                                                <h4 className="flex items-center gap-2 mb-4 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                                    <JournalIcon className="h-4 w-4" />
                                                    JOURNAL
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-gray-50 dark:bg-[#3a3a3a]/30">
                                                    <InfoRow icon={Barcode} label="ISSN" value={catalogItem.issn} />
                                                    <InfoRow icon={Layers} label="Frequency" value={catalogItem.frequency} />
                                                    <InfoRow icon={Info} label="Journal Type" value={catalogItem.journal_type} />
                                                    <InfoRow icon={Info} label="Issue Type" value={catalogItem.issue_type} />
                                                    <InfoRow icon={Calendar} label="Issue Period" value={catalogItem.issue_period} />
                                                </div>
                                                <hr className="mt-8 border-gray-200 dark:border-[#3a3a3a]" />
                                            </section>
                                        )}

                                        {hasThesis && (
                                            <section>
                                                <h4 className="flex items-center gap-2 mb-4 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                                    <GraduationCap className="h-4 w-4" />
                                                    THESIS
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-gray-50 dark:bg-[#3a3a3a]/30">
                                                    <InfoRow icon={Building2} label="Granting Institution" value={catalogItem.granting_institution} />
                                                    <InfoRow icon={User} label="Supervisor" value={catalogItem.supervisor} />
                                                    <InfoRow icon={Info} label="Degree / Qualification" value={catalogItem.degree_qualification} />
                                                    <InfoRow icon={Calendar} label="Date" value={catalogItem.thesis_date} />
                                                    <InfoRow icon={Layers} label="Period" value={catalogItem.thesis_period} />
                                                    <InfoRow icon={Info} label="Publication Type" value={catalogItem.publication_type} />
                                                </div>
                                                <hr className="mt-8 border-gray-200 dark:border-[#3a3a3a]" />
                                            </section>
                                        )}
                                    </div>
                                )}

                                {/* More Info Button */}
                                {hasAnyMoreInfo && (
                                    <div className="mt-6 flex justify-start">
                                        <button
                                            onClick={() => setShowMore(!showMore)}
                                            className="group flex items-center gap-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/40 active:scale-95"
                                        >
                                            {showMore ? (
                                                <>
                                                    SHOW LESS
                                                    <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                                                </>
                                            ) : (
                                                <>
                                                    MORE INFO
                                                    <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                                                </>
                                            )}
                                        </button>
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

            <SuccessModal
                show={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message="Borrow record added and approved successfully!"
            />
        </AuthenticatedLayout>
    );
}

// Helper component for info rows
function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string | undefined | null }) {
    if (!value || value === "-" || value === "") return null;

    return (
        <div className="flex items-start gap-4">
            <div className="mt-0.5 rounded bg-gray-100 dark:bg-gray-800 p-1">
                <Icon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-tight">{label}</span>
                <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{value}</p>
            </div>
        </div>
    );
}
