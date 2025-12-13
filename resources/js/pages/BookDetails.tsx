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

interface Props extends PageProps {
    catalogItem: CatalogItem & {
        copies?: CatalogItemCopy[];
        copies_count?: number;
        available_copies_count?: number;
    };
    hasAvailableCopies: boolean;
    hasCopies: boolean;
    allCopiesBorrowed: boolean;
    hasPendingOrActiveRequest: boolean;
}

export default function BookDetails({
    auth,
    catalogItem,
    allCopiesBorrowed,
    hasPendingOrActiveRequest,
}: Props) {
    const { flash } = usePage().props as any;
    const [activeTab, setActiveTab] = useState<BookDetailTab>("item-info");
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedCopyId, setSelectedCopyId] = useState<number | null>(null);

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

    const handleRequestCopy = (copy: CatalogItemCopy) => {
        setSelectedCopyId(copy.id);
        setShowRequestModal(true);
    };

    const handleCloseModal = () => {
        setShowRequestModal(false);
        setSelectedCopyId(null);
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

                            {/* Tabs Navigation */}
                            <BookDetailsTabs
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                copiesCount={catalogItem.copies?.length}
                                availableCopiesCount={catalogItem.available_copies_count ?? catalogItem.copies?.filter(c => c.status === 'Available').length}
                            />

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === "item-info" && (
                                    <ItemInfoTab catalogItem={catalogItem} />
                                )}

                                {activeTab === "available-copies" && (
                                    <AvailableCopiesTable
                                        copies={catalogItem.copies}
                                        callNo={catalogItem.call_no}
                                        allCopiesBorrowed={allCopiesBorrowed}
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
            />

            <Toast />
        </>
    );
}
