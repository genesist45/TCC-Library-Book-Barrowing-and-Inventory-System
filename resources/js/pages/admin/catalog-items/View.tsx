import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { Pencil } from "lucide-react";
import { PageProps, CatalogItem } from "@/types";
import RelatedCopiesTable from "@/components/catalog-items/RelatedCopiesTable";
import BorrowHistoryTable from "@/components/catalog-items/BorrowHistoryTable";
import CopyBookModal from "@/components/catalog-items/CopyBookModal";
import CopySuccessModal from "@/components/catalog-items/CopySuccessModal";
import AddMultipleCopiesModal from "@/components/catalog-items/AddMultipleCopiesModal";
import {
    CoverImageDisplay,
    CatalogItemDetailsGrid,
    ViewDetailsTabs,
    DetailViewContent,
    JournalViewContent,
    ThesisViewContent,
} from "@/components/catalog-items/view-sections";
import type { ViewTabType } from "@/components/catalog-items/view-sections";
import { toast } from "react-toastify";

interface BorrowRecord {
    id: number;
    member_id: number;
    member_name: string;
    member_no: string;
    member_type: string;
    email: string;
    phone: string | null;
    date_borrowed: string;
    date_returned: string | null;
    due_date: string;
    status: string;
    accession_no?: string;
    copy_no?: number;
}

interface Props extends PageProps {
    catalogItem: CatalogItem;
    borrowHistory?: BorrowRecord[];
}

export default function CatalogItemView({
    catalogItem,
    borrowHistory = [],
}: Props) {
    const [activeTab, setActiveTab] = useState<ViewTabType>("item-info");
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showMultipleCopiesModal, setShowMultipleCopiesModal] =
        useState(false);

    const handleBack = () => {
        router.visit(route("admin.catalog-items.index"));
    };

    const handleEdit = () => {
        router.visit(route("admin.catalog-items.edit", catalogItem.id));
    };

    const handleRefresh = () => {
        router.reload({ only: ["catalogItem", "borrowHistory"] });
    };

    const handleAddCopy = () => {
        setShowCopyModal(true);
    };

    const handleCopySuccess = () => {
        setShowCopyModal(false);
        setShowSuccessModal(true);
        toast.success("Copy added successfully");
        handleRefresh();
    };

    const handleCloseCopyModal = () => {
        setShowCopyModal(false);
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const handleAddAnotherCopy = () => {
        setShowSuccessModal(false);
        setShowCopyModal(true);
    };

    const handleAddMultipleCopies = () => {
        setShowMultipleCopiesModal(true);
    };

    const handleMultipleCopiesSuccess = () => {
        setShowMultipleCopiesModal(false);
        handleRefresh();
    };

    const handleCloseMultipleCopiesModal = () => {
        setShowMultipleCopiesModal(false);
    };

    const copiesCount = catalogItem.copies?.length || 0;
    const historyCount = borrowHistory.length;

    return (
        <AuthenticatedLayout>
            <Head title={`View: ${catalogItem.title}`} />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="border-b border-gray-200 p-4 dark:border-[#3a3a3a] sm:p-6">
                            <h2 className="text-xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                Catalog Item Details
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400">
                                View complete information about this catalog
                                item
                            </p>
                        </div>

                        <div className="p-4 sm:p-6">
                            <ViewDetailsTabs
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                copiesCount={copiesCount}
                                historyCount={historyCount}
                            >
                                {activeTab === "item-info" && (
                                    <div className="flex flex-col items-start gap-8 md:flex-row">
                                        <div className="w-full flex-shrink-0 md:w-auto">
                                            <CoverImageDisplay
                                                coverImage={catalogItem.cover_image}
                                                title={catalogItem.title}
                                            />
                                        </div>

                                        <div className="w-full flex-1">
                                            <CatalogItemDetailsGrid
                                                catalogItem={catalogItem}
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === "detail" && (
                                    <DetailViewContent
                                        catalogItem={catalogItem}
                                    />
                                )}

                                {activeTab === "journal" && (
                                    <JournalViewContent
                                        catalogItem={catalogItem}
                                    />
                                )}

                                {activeTab === "thesis" && (
                                    <ThesisViewContent
                                        catalogItem={catalogItem}
                                    />
                                )}

                                {activeTab === "related-copies" && (
                                    <RelatedCopiesTable
                                        copies={catalogItem.copies || []}
                                        catalogItemTitle={catalogItem.title}
                                        onRefresh={handleRefresh}
                                        onAddCopy={handleAddCopy}
                                        onAddMultipleCopies={
                                            handleAddMultipleCopies
                                        }
                                    />
                                )}

                                {activeTab === "borrow-history" && (
                                    <BorrowHistoryTable
                                        records={borrowHistory}
                                        title="Borrow History"
                                    />
                                )}
                            </ViewDetailsTabs>

                            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-[#3a3a3a]">
                                <SecondaryButton onClick={handleBack}>
                                    Close
                                </SecondaryButton>
                                <PrimaryButton
                                    onClick={handleEdit}
                                    className="flex items-center gap-2"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit Item
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CopyBookModal
                show={showCopyModal}
                item={catalogItem}
                onClose={handleCloseCopyModal}
                onSuccess={handleCopySuccess}
            />

            <CopySuccessModal
                show={showSuccessModal}
                catalogItemId={catalogItem.id}
                onClose={handleCloseSuccessModal}
                onAddAnother={handleAddAnotherCopy}
            />

            <AddMultipleCopiesModal
                show={showMultipleCopiesModal}
                item={catalogItem}
                onClose={handleCloseMultipleCopiesModal}
                onSuccess={handleMultipleCopiesSuccess}
            />
        </AuthenticatedLayout>
    );
}
