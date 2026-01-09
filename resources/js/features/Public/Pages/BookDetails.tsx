import { PageProps, CatalogItem, CatalogItemCopy } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import PublicHeader from "@/components/common/PublicHeader";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import Toast from "@/components/common/Toast";

// Book detail components
import BookDetailsTabs, { BookDetailTab } from "@/components/books/BookDetailsTabs";
import ItemInfoTab from "@/components/books/ItemInfoTab";
import AvailableCopiesTable from "@/components/books/AvailableCopiesTable";
import BorrowRequestModal from "@/components/books/BorrowRequestModal";
import SuccessModal from "@/components/modals/SuccessModal";

interface Props extends PageProps {
    catalogItem: CatalogItem & {
        copies?: CatalogItemCopy[];
        copies_count?: number;
        available_copies_count?: number;
        likes_count?: number;
    };
    hasAvailableCopies: boolean;
    hasCopies: boolean;
    allCopiesCheckedOut: boolean;
    hasPendingOrActiveRequest: boolean;
}

export default function BookDetails({
    auth,
    catalogItem,
    allCopiesCheckedOut,
    hasPendingOrActiveRequest,
}: Props) {
    const { flash } = usePage().props as any;
    const [activeTab, setActiveTab] = useState<BookDetailTab>("item-info");
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedCopyId, setSelectedCopyId] = useState<number | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            // Only show toast if it's not the borrow request success message
            // which we now handle with a high-end modal
            if (!flash.success.toLowerCase().includes('submitted successfully')) {
                toast.success(flash.success);
            }
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.visit("/#catalogs-section");
        }
    };

    const handleRequestCopy = (copy: CatalogItemCopy) => {
        setSelectedCopyId(copy.id);
        setShowRequestModal(true);
    };

    const handleCloseModal = () => {
        setShowRequestModal(false);
        setSelectedCopyId(null);
    };

    const handleRequestSuccess = () => {
        setShowSuccessModal(true);
    };

    return (
        <>
            <Head title={catalogItem.title} />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-jakarta">
                <PublicHeader />

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
                            <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 sm:px-6 sm:py-4">
                                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight break-words">
                                    {catalogItem.title}
                                </h1>
                            </div>

                            {/* Tabs Navigation */}
                            <BookDetailsTabs
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                catalogItem={catalogItem}
                                copiesCount={catalogItem.copies?.length}
                                availableCopiesCount={catalogItem.available_copies_count ?? catalogItem.copies?.filter(c => c.status === 'Available').length}
                            />

                            {/* Tab Content */}
                            <div className="p-4 sm:p-6">
                                {activeTab === "item-info" && (
                                    <ItemInfoTab catalogItem={catalogItem} />
                                )}

                                {activeTab === "available-copies" && (
                                    <AvailableCopiesTable
                                        copies={catalogItem.copies}
                                        callNo={catalogItem.call_no}
                                        allCopiesBorrowed={allCopiesCheckedOut}
                                        hasPendingOrActiveRequest={hasPendingOrActiveRequest}
                                        onRequestCopy={handleRequestCopy}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Borrow Request Modal */}
            <BorrowRequestModal
                isOpen={showRequestModal}
                onClose={handleCloseModal}
                catalogItemId={catalogItem.id}
                catalogItemCopyId={selectedCopyId}
                onSuccess={handleRequestSuccess}
            />

            <SuccessModal
                show={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message="Your borrow request has been submitted successfully!"
            />

            <Toast />
        </>
    );
}
