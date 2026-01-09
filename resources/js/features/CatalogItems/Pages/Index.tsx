import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { CatalogItemTable } from "../Components/tables";
import { CatalogItemPageHeader } from "../Components/page";
import { CatalogItemDeleteModal, CopyBookModal, CopySuccessModal } from "../Components/modals";
import EntityManagementModal from "../Components/modals/EntityManagementModal";
import { toast } from "react-toastify";
import { PageProps, CatalogItem, Author, Publisher, Category } from "@/types";
import Pagination from "@/components/common/Pagination";

// Extended type to include available_copies_count from the backend
interface CatalogItemWithAvailability extends CatalogItem {
    available_copies_count?: number;
}

interface Props extends PageProps {
    catalogItems: CatalogItemWithAvailability[];
    authors: { id: number; name: string; country?: string; bio?: string; is_published: boolean; catalog_items_count?: number }[];
    publishers: { id: number; name: string; country?: string; description?: string; is_published: boolean; catalog_items_count?: number }[];
    categories: { id: number; name: string; description?: string; is_published: boolean; catalog_items_count?: number }[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Index({ catalogItems, authors, publishers, categories, flash }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter states
    const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
    const [selectedPublisherId, setSelectedPublisherId] = useState<number | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    // Entity management modal states
    const [showAuthorsModal, setShowAuthorsModal] = useState(false);
    const [showCategoriesModal, setShowCategoriesModal] = useState(false);
    const [showPublishersModal, setShowPublishersModal] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedAuthorId, selectedPublisherId, selectedCategoryId]);

    const handleAddItem = () => {
        router.visit(route("admin.catalog-items.create"));
    };

    const handleViewItem = (item: CatalogItem) => {
        router.visit(route("admin.catalog-items.show", item.id));
    };


    const handleCopyItem = (item: CatalogItem) => {
        setSelectedItem(item);
        setShowCopyModal(true);
    };

    const handleDeleteItem = (item: CatalogItem) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedItem) return;

        setProcessing(true);
        router.delete(route("admin.catalog-items.destroy", selectedItem.id), {
            onSuccess: () => {
                // Toast is handled by flash message in useEffect
                setShowDeleteModal(false);
                setSelectedItem(null);
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
                toast.error("Failed to delete catalog item");
            },
        });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => {
                setIsRefreshing(false);
            },
        });
    };

    const handleCopySuccess = (copy: any) => {
        setShowCopyModal(false);
        setShowSuccessModal(true);
    };

    const handleCloseCopyModal = () => {
        setShowCopyModal(false);
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setSelectedItem(null);
        handleRefresh();
    };

    const handleAddAnotherCopy = () => {
        setShowSuccessModal(false);
        setShowCopyModal(true);
    };

    const closeModal = () => {
        setShowDeleteModal(false);
        setSelectedItem(null);
    };

    // Entity management success handler
    const handleEntitySuccess = () => {
        handleRefresh();
    };

    // Filter items based on search term and selected filters
    const filteredItems = catalogItems.filter((item) => {
        const searchLower = searchTerm.toLowerCase();

        // Text search filter
        const matchesSearch =
            (item.title?.toLowerCase() || "").includes(searchLower) ||
            (item.type?.toLowerCase() || "").includes(searchLower) ||
            (item.category?.name?.toLowerCase() || "").includes(searchLower) ||
            (item.publisher?.name?.toLowerCase() || "").includes(searchLower) ||
            (item.isbn?.toLowerCase() || "").includes(searchLower) ||
            (item.isbn13?.toLowerCase() || "").includes(searchLower);

        // Author filter
        const matchesAuthor = !selectedAuthorId ||
            item.authors?.some(author => author.id === selectedAuthorId);

        // Publisher filter
        const matchesPublisher = !selectedPublisherId ||
            item.publisher?.id === selectedPublisherId;

        // Category filter
        const matchesCategory = !selectedCategoryId ||
            item.category?.id === selectedCategoryId;

        return matchesSearch && matchesAuthor && matchesPublisher && matchesCategory;
    });

    // Pagination
    const totalItems = filteredItems.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    return (
        <AuthenticatedLayout>
            <Head title="Catalog Items">
                <style>{`
                    @media print {
                        /* Hide everything except the print content */
                        body * {
                            visibility: hidden;
                        }

                        /* Show only the print container and its children */
                        #print-container,
                        #print-container * {
                            visibility: visible;
                        }

                        /* Position the print container at the top */
                        #print-container {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            padding: 20px;
                        }

                        /* Clean print styles */
                        @page {
                            margin: 1cm;
                        }

                        /* Remove backgrounds and borders for clean printing */
                        body {
                            background: white !important;
                        }

                        /* Table print styles */
                        table {
                            border-collapse: collapse;
                            width: 100%;
                            font-size: 10pt;
                        }

                        th, td {
                            border: 1px solid #000 !important;
                            padding: 8px !important;
                            text-align: left;
                        }

                        th {
                            background-color: #f0f0f0 !important;
                            font-weight: bold;
                        }

                        /* Ensure table doesn't break across pages awkwardly */
                        tr {
                            page-break-inside: avoid;
                        }
                    }
                `}</style>
            </Head>

            {/* Screen View - Normal UI */}
            <div className="print:hidden p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <CatalogItemPageHeader
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        onAddItem={handleAddItem}
                        onRefresh={handleRefresh}
                        isRefreshing={isRefreshing}
                        authors={authors}
                        publishers={publishers}
                        categories={categories}
                        selectedAuthorId={selectedAuthorId}
                        selectedPublisherId={selectedPublisherId}
                        selectedCategoryId={selectedCategoryId}
                        onAuthorChange={setSelectedAuthorId}
                        onPublisherChange={setSelectedPublisherId}
                        onCategoryChange={setSelectedCategoryId}
                        onManageAuthors={() => setShowAuthorsModal(true)}
                        onManageCategories={() => setShowCategoriesModal(true)}
                        onManagePublishers={() => setShowPublishersModal(true)}
                    />

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <CatalogItemTable
                            items={paginatedItems}
                            onView={handleViewItem}
                            onCopy={handleCopyItem}
                            onDelete={handleDeleteItem}
                            isLoading={isRefreshing}
                        />

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
                                    itemsPerPageOptions={[10, 25, 50, 100]}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Print View - Clean and Professional */}
            <div id="print-container" className="hidden print:block">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Catalog Inventory Report
                    </h1>
                    <p className="text-sm text-gray-600 mb-1">
                        Comprehensive list of all library catalog items and
                        media resources
                    </p>
                    <p className="text-xs text-gray-500">
                        Generated on:{" "}
                        {new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                    <p className="text-xs text-gray-500">
                        Total Items: {filteredItems.length}
                    </p>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                ID
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Title
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Material Type
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Authors
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Publication Details
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Year
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Availability
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                ISBN
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Category
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => (
                            <tr key={item.id}>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.id}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs font-medium">
                                    {item.title}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.type}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.authors && item.authors.length > 0
                                        ? item.authors
                                            .map((a) => a.name)
                                            .join(", ")
                                        : "-"}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.publisher?.name || "-"}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.year || "-"}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.available_copies_count ?? 0}/{item.copies_count ?? 0}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.isbn || item.isbn13 || "-"}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.category?.name || "-"}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.is_active ? "Active" : "Inactive"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CopyBookModal
                show={showCopyModal}
                item={selectedItem}
                onClose={handleCloseCopyModal}
                onSuccess={handleCopySuccess}
            />

            <CopySuccessModal
                show={showSuccessModal}
                catalogItemId={selectedItem?.id || null}
                onClose={handleCloseSuccessModal}
                onAddAnother={handleAddAnotherCopy}
            />

            <CatalogItemDeleteModal
                show={showDeleteModal}
                item={selectedItem}
                processing={processing}
                onConfirm={confirmDelete}
                onCancel={closeModal}
            />

            {/* Entity Management Modals */}
            <EntityManagementModal
                show={showAuthorsModal}
                entityType="authors"
                entities={authors}
                onClose={() => setShowAuthorsModal(false)}
                onSuccess={handleEntitySuccess}
            />

            <EntityManagementModal
                show={showCategoriesModal}
                entityType="categories"
                entities={categories}
                onClose={() => setShowCategoriesModal(false)}
                onSuccess={handleEntitySuccess}
            />

            <EntityManagementModal
                show={showPublishersModal}
                entityType="publishers"
                entities={publishers}
                onClose={() => setShowPublishersModal(false)}
                onSuccess={handleEntitySuccess}
            />
        </AuthenticatedLayout>
    );
}
