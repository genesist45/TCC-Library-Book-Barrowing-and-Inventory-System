import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { FormEventHandler, useState, useEffect } from "react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { PageProps, Category, Publisher, Author, CatalogItem } from "@/types";
import { toast } from "react-toastify";
import axios from "axios";
import {
    CatalogFormTabs,
    ItemInfoTabContent,
    DetailTabContent,
    JournalTabContent,
    ThesisTabContent,
    CoverImageSection,
    StatusToggleSection,
    QuickAddModals,
} from "../Components/form-sections";
import type { TabType } from "../Components/form-sections";
import { RelatedCopiesTable, BorrowHistoryTable } from "../Components/tables";
import { CopyBookModal, CopySuccessModal, AddMultipleCopiesModal } from "../Components/modals";

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
    categories: Category[];
    publishers: Publisher[];
    authors: Author[];
    borrowHistory?: BorrowRecord[];
}

export default function Edit({
    catalogItem,
    categories,
    publishers,
    authors,
    borrowHistory = [],
}: Props) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        title: catalogItem.title || "",
        type: catalogItem.type || "",
        category_id: catalogItem.category_id?.toString() || "",
        publisher_id: catalogItem.publisher_id?.toString() || "",
        author_ids: catalogItem.authors?.map((a) => a.id) || ([] as number[]),
        isbn: catalogItem.isbn || "",
        isbn13: catalogItem.isbn13 || "",
        call_no: catalogItem.call_no || "",
        subject: catalogItem.subject || "",
        series: catalogItem.series || "",
        edition: catalogItem.edition || "",
        year: catalogItem.year || "",
        place_of_publication: catalogItem.place_of_publication || "",
        extent: catalogItem.extent || "",
        other_physical_details: catalogItem.other_physical_details || "",
        dimensions: catalogItem.dimensions || "",
        url: catalogItem.url || "",
        description: catalogItem.description || "",
        location: catalogItem.location || "",
        cover_image: null as File | null,
        is_active: catalogItem.is_active ?? true,
        volume: catalogItem.volume || "",
        page_duration: catalogItem.page_duration || "",
        abstract: catalogItem.abstract || "",
        biblio_info: catalogItem.biblio_info || "",
        url_visibility: catalogItem.url_visibility || "",
        library_branch: catalogItem.library_branch || "",
        issn: catalogItem.issn || "",
        frequency: catalogItem.frequency || "",
        journal_type: catalogItem.journal_type || "",
        issue_type: catalogItem.issue_type || "",
        issue_period: catalogItem.issue_period || "",
        granting_institution: catalogItem.granting_institution || "",
        degree_qualification: catalogItem.degree_qualification || "",
        supervisor: catalogItem.supervisor || "",
        thesis_date: catalogItem.thesis_date || "",
        thesis_period: catalogItem.thesis_period || "",
        publication_type: catalogItem.publication_type || "",
        _method: "PATCH",
    });

    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
        null,
    );
    const [coverImageName, setCoverImageName] = useState<string>("");

    const [localCategories, setLocalCategories] =
        useState<Category[]>(categories);
    const [localPublishers, setLocalPublishers] =
        useState<Publisher[]>(publishers);
    const [localAuthors, setLocalAuthors] = useState<Author[]>(authors);

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showPublisherModal, setShowPublisherModal] = useState(false);
    const [showAuthorModal, setShowAuthorModal] = useState(false);

    const [activeTab, setActiveTab] = useState<TabType>("item-info");

    // Copy modal states
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showMultipleCopiesModal, setShowMultipleCopiesModal] =
        useState(false);

    useEffect(() => {
        if (catalogItem.cover_image) {
            setCoverImagePreview(`/storage/${catalogItem.cover_image}`);
        }
    }, [catalogItem.cover_image]);

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

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.catalog-items.update", catalogItem.id), {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Catalog item updated successfully!");
            },
        });
    };

    const handleCancel = () => {
        router.visit(route("admin.catalog-items.index"));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("cover_image", file);
            setCoverImageName(file.name);
            clearErrors("cover_image");

            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setData("cover_image", null);
        setCoverImageName("");
        setCoverImagePreview(
            catalogItem.cover_image
                ? `/storage/${catalogItem.cover_image}`
                : null,
        );
    };

    const handleCategoryAdded = async (name: string) => {
        try {
            const response = await axios.post(route("admin.categories.store"), {
                name,
                is_published: true,
            });

            if (response.data) {
                const newCategory = response.data.category;
                setLocalCategories([...localCategories, newCategory]);
                setData("category_id", newCategory.id.toString());
                setShowCategoryModal(false);
                toast.success("Category added successfully!");
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                toast.error(
                    error.response.data.errors.name?.[0] ||
                    "Failed to add category",
                );
            }
        }
    };

    const handlePublisherAdded = async (name: string, country: string) => {
        try {
            const response = await axios.post(route("admin.publishers.store"), {
                name,
                country,
                is_published: true,
            });

            if (response.data) {
                const newPublisher = response.data.publisher;
                setLocalPublishers([...localPublishers, newPublisher]);
                setData("publisher_id", newPublisher.id.toString());
                setShowPublisherModal(false);
                toast.success("Publisher added successfully!");
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const errorMsg =
                    error.response.data.errors.name?.[0] ||
                    error.response.data.errors.country?.[0] ||
                    "Failed to add publisher";
                toast.error(errorMsg);
            }
        }
    };

    const handleAuthorAdded = async (name: string, country: string) => {
        try {
            const response = await axios.post(route("admin.authors.store"), {
                name,
                country,
                is_published: true,
            });

            if (response.data) {
                const newAuthor = response.data.author;
                setLocalAuthors([...localAuthors, newAuthor]);
                setData("author_ids", [...data.author_ids, newAuthor.id]);
                setShowAuthorModal(false);
                toast.success("Author added successfully!");
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const errorMsg =
                    error.response.data.errors.name?.[0] ||
                    error.response.data.errors.country?.[0] ||
                    "Failed to add author";
                toast.error(errorMsg);
            }
        }
    };

    const handleDataChange = (field: string, value: any) => {
        setData(field as keyof typeof data, value);
    };

    const handleClearErrors = (field: string) => {
        clearErrors(field as keyof typeof errors);
    };

    const copiesCount = catalogItem.copies?.length || 0;
    const availableCopiesCount = catalogItem.copies?.filter(c => c.status === 'Available').length || 0;
    const historyCount = borrowHistory.length;

    // Check if current tab is a form tab (needs form wrapper)
    const isFormTab = ["item-info", "detail", "journal", "thesis"].includes(
        activeTab,
    );

    return (
        <AuthenticatedLayout>
            <Head title={`Edit: ${data.title}`} />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="border-b border-gray-200 p-4 dark:border-[#3a3a3a] sm:p-6">
                            <h2 className="text-xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                Edit Catalog Item
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400">
                                Update the catalog item information below
                            </p>
                        </div>

                        <div className="p-4 sm:p-6">
                            <CatalogFormTabs
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                showExtraTabs={true}
                                copiesCount={copiesCount}
                                availableCopiesCount={availableCopiesCount}
                                historyCount={historyCount}
                            >
                                {isFormTab ? (
                                    <form onSubmit={handleSubmit}>
                                        {activeTab === "item-info" && (
                                            <ItemInfoTabContent
                                                data={data}
                                                errors={errors}
                                                categories={localCategories}
                                                authors={localAuthors}
                                                publishers={localPublishers}
                                                onDataChange={handleDataChange}
                                                onClearErrors={
                                                    handleClearErrors
                                                }
                                                onShowCategoryModal={() =>
                                                    setShowCategoryModal(true)
                                                }
                                                onShowAuthorModal={() =>
                                                    setShowAuthorModal(true)
                                                }
                                                onShowPublisherModal={() =>
                                                    setShowPublisherModal(true)
                                                }
                                            />
                                        )}

                                        {activeTab === "detail" && (
                                            <DetailTabContent
                                                data={data}
                                                errors={errors}
                                                onDataChange={handleDataChange}
                                                onClearErrors={
                                                    handleClearErrors
                                                }
                                            />
                                        )}

                                        {activeTab === "journal" && (
                                            <JournalTabContent
                                                data={data}
                                                errors={errors}
                                                onDataChange={handleDataChange}
                                                onClearErrors={
                                                    handleClearErrors
                                                }
                                            />
                                        )}

                                        {activeTab === "thesis" && (
                                            <ThesisTabContent
                                                data={data}
                                                errors={errors}
                                                onDataChange={handleDataChange}
                                                onClearErrors={
                                                    handleClearErrors
                                                }
                                            />
                                        )}

                                        <div className="mt-8 space-y-8">
                                            <CoverImageSection
                                                coverImagePreview={
                                                    coverImagePreview
                                                }
                                                coverImageName={
                                                    coverImageName ||
                                                    (catalogItem.cover_image
                                                        ? "Current cover"
                                                        : "")
                                                }
                                                error={errors.cover_image}
                                                onImageChange={
                                                    handleImageChange
                                                }
                                                onRemoveImage={
                                                    handleRemoveImage
                                                }
                                            />

                                            <StatusToggleSection
                                                isActive={data.is_active}
                                                onToggle={() =>
                                                    setData(
                                                        "is_active",
                                                        !data.is_active,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-[#3a3a3a]">
                                            <SecondaryButton
                                                type="button"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </SecondaryButton>
                                            <PrimaryButton
                                                disabled={processing}
                                            >
                                                Update Catalog Item
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        {activeTab === "related-copies" && (
                                            <RelatedCopiesTable
                                                copies={
                                                    catalogItem.copies || []
                                                }
                                                catalogItemTitle={
                                                    catalogItem.title
                                                }
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
                                    </>
                                )}
                            </CatalogFormTabs>
                        </div>
                    </div>
                </div>
            </div>

            <QuickAddModals
                mode="simple"
                showCategoryModal={showCategoryModal}
                showPublisherModal={showPublisherModal}
                showAuthorModal={showAuthorModal}
                onCloseCategoryModal={() => setShowCategoryModal(false)}
                onClosePublisherModal={() => setShowPublisherModal(false)}
                onCloseAuthorModal={() => setShowAuthorModal(false)}
                onCategoryAdded={handleCategoryAdded}
                onPublisherAdded={handlePublisherAdded}
                onAuthorAdded={handleAuthorAdded}
            />

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
