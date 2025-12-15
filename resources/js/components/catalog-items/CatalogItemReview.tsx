import { Category, Publisher, Author } from "@/types";
import { ArrowLeft, Plus } from "lucide-react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { CatalogFormTabs, TabType, CoverImageSection } from "./form-sections";
import RelatedCopiesPreview, { PreviewCopy } from "./RelatedCopiesPreview";

interface ReviewData {
    title: string;
    type: string;
    category_id: string;
    publisher_id: string;
    author_ids: number[];
    isbn: string;
    isbn13: string;
    call_no: string;
    subject: string;
    series: string;
    edition: string;
    year: string;
    place_of_publication: string;
    extent: string;
    other_physical_details: string;
    dimensions: string;
    url: string;
    description: string;
    location: string;
    cover_image: File | null;
    is_active: boolean;
    volume: string;
    page_duration: string;
    abstract: string;
    biblio_info: string;
    url_visibility: string;
    library_branch: string;
    issn: string;
    frequency: string;
    journal_type: string;
    issue_type: string;
    issue_period: string;
    granting_institution: string;
    degree_qualification: string;
    supervisor: string;
    thesis_date: string;
    thesis_period: string;
    publication_type: string;
}

interface CatalogItemReviewProps {
    data: ReviewData;
    categories: Category[];
    authors: Author[];
    publishers: Publisher[];
    coverImagePreview: string | null;
    coverImageName: string;
    error?: string;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    onBack: () => void;
    onConfirm: () => void;
    processing: boolean;
    onShowCategoryModal: () => void;
    onShowAuthorModal: () => void;
    onShowPublisherModal: () => void;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
    // Related Copies Preview props
    previewCopies: PreviewCopy[];
    onAddPreviewCopy: () => void;
    onAddMultiplePreviewCopies: () => void;
    onEditPreviewCopy: (copy: PreviewCopy) => void;
    onDeletePreviewCopy: (id: number) => void;
}

const DisplayValue = ({ value, label }: { value: string | number | undefined | null; label: string }) => (
    <div className="rounded-lg bg-gray-50 p-3 dark:bg-[#1a1a1a]">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
            {value || <span className="text-gray-400 italic">—</span>}
        </p>
    </div>
);

export default function CatalogItemReview({
    data,
    categories,
    authors,
    publishers,
    coverImagePreview,
    coverImageName,
    error,
    activeTab,
    onTabChange,
    onBack,
    onConfirm,
    processing,
    onShowCategoryModal,
    onShowAuthorModal,
    onShowPublisherModal,
    onImageChange,
    onRemoveImage,
    previewCopies,
    onAddPreviewCopy,
    onAddMultiplePreviewCopies,
    onEditPreviewCopy,
    onDeletePreviewCopy,
}: CatalogItemReviewProps) {
    const getCategoryName = () => {
        const cat = categories.find((c) => c.id.toString() === data.category_id);
        return cat?.name || "";
    };

    const getPublisherName = () => {
        const pub = publishers.find((p) => p.id.toString() === data.publisher_id);
        return pub?.name || "";
    };

    const getAuthorNames = () => {
        return authors
            .filter((a) => data.author_ids.includes(a.id))
            .map((a) => a.name)
            .join(", ");
    };

    const getMaterialTypeName = () => {
        const types: Record<string, string> = {
            book: "Book",
            ebook: "E-Book",
            journal: "Journal",
            thesis: "Thesis/Dissertation",
            magazine: "Magazine",
            newspaper: "Newspaper",
            audio: "Audio Material",
            video: "Video Material",
            map: "Map",
            other: "Other",
        };
        return types[data.type] || data.type;
    };

    return (
        <div>
            {/* Back Button and Header */}
            <div className="mb-6 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Form
                </button>

            </div>

            {/* Tabs Navigation - Content separated to allow sidebar alignment */}
            <CatalogFormTabs activeTab={activeTab} onTabChange={onTabChange}>
                {null}
            </CatalogFormTabs>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-3">
                    {/* ITEM INFO Tab */}
                    {activeTab === "item-info" && (
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Basic Information
                                </h3>
                                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                    Essential details about the catalog item
                                </p>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <DisplayValue label="Title" value={data.title} />
                                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-[#1a1a1a]">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Authors</p>
                                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {getAuthorNames() || <span className="text-gray-400 italic">—</span>}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={onShowAuthorModal}
                                            className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                        >
                                            <Plus className="h-3 w-3" />
                                            Author not listed? Click here to add.
                                        </button>
                                    </div>
                                    <DisplayValue label="Material Type" value={getMaterialTypeName()} />
                                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-[#1a1a1a]">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Category</p>
                                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {getCategoryName() || <span className="text-gray-400 italic">—</span>}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={onShowCategoryModal}
                                            className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                        >
                                            <Plus className="h-3 w-3" />
                                            Category not listed? Click here to add.
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Publication Details */}
                            <div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Publication Details
                                </h3>
                                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                    Information about the publication
                                </p>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <DisplayValue label="Place of Publication" value={data.place_of_publication} />
                                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-[#1a1a1a]">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Publisher</p>
                                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {getPublisherName() || <span className="text-gray-400 italic">—</span>}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={onShowPublisherModal}
                                            className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                        >
                                            <Plus className="h-3 w-3" />
                                            Publisher not listed? Click here to add.
                                        </button>
                                    </div>
                                    <DisplayValue label="Year of Publication" value={data.year} />
                                </div>
                            </div>

                            {/* Physical Description */}
                            <div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Physical Description
                                </h3>
                                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                    Physical characteristics of the item
                                </p>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <DisplayValue label="Extent" value={data.extent} />
                                    <DisplayValue label="Other Physical Details" value={data.other_physical_details} />
                                    <DisplayValue label="Dimensions" value={data.dimensions} />
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Additional Details
                                </h3>
                                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                    Optional metadata and cataloging information
                                </p>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <DisplayValue label="ISBN" value={data.isbn} />
                                    <DisplayValue label="ISBN-13" value={data.isbn13} />
                                    <DisplayValue label="Call Number" value={data.call_no} />
                                    <DisplayValue label="Subject" value={data.subject} />
                                    <DisplayValue label="Series" value={data.series} />
                                    <DisplayValue label="Edition" value={data.edition} />
                                    <DisplayValue label="Location" value={data.location} />
                                    <DisplayValue label="URL" value={data.url} />
                                </div>
                                <div className="mt-4">
                                    <DisplayValue label="Description" value={data.description} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DETAIL Tab */}
                    {activeTab === "detail" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Detail Information
                                </h3>
                                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                    Additional details for general materials
                                </p>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <DisplayValue label="Volume" value={data.volume} />
                                    <DisplayValue label="Page / Duration" value={data.page_duration} />
                                </div>
                                <div className="mt-4 grid grid-cols-1 gap-4">
                                    <DisplayValue label="Abstract" value={data.abstract} />
                                    <DisplayValue label="Biblio Information" value={data.biblio_info} />
                                </div>
                                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <DisplayValue label="URL Visibility" value={data.url_visibility} />
                                    <DisplayValue label="Library Branch" value={data.library_branch} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* JOURNAL Tab */}
                    {activeTab === "journal" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Journal Information
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <DisplayValue label="ISSN" value={data.issn} />
                                    <DisplayValue label="Frequency" value={data.frequency} />
                                    <DisplayValue label="Journal Type" value={data.journal_type} />
                                    <DisplayValue label="Issue Type" value={data.issue_type} />
                                    <DisplayValue label="Issue Period" value={data.issue_period} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* THESIS Tab */}
                    {activeTab === "thesis" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Thesis / Dissertation Information
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <DisplayValue label="Granting Institution" value={data.granting_institution} />
                                    <DisplayValue label="Degree / Qualification" value={data.degree_qualification} />
                                    <DisplayValue label="Supervisor" value={data.supervisor} />
                                    <DisplayValue label="Thesis Date" value={data.thesis_date} />
                                    <DisplayValue label="Thesis Period" value={data.thesis_period} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Right Column */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Cover Image Section */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#3a3a3a] dark:bg-[#1a1a1a]">
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Cover Image
                        </h3>
                        <CoverImageSection
                            coverImagePreview={coverImagePreview}
                            coverImageName={coverImageName}
                            error={error}
                            onImageChange={onImageChange}
                            onRemoveImage={onRemoveImage}
                        />
                    </div>

                    {/* Status Section */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#3a3a3a] dark:bg-[#1a1a1a]">
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Status
                        </h3>
                        <div>
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${data.is_active
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    }`}
                            >
                                {data.is_active ? "Active" : "Inactive"}
                            </span>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Status can be changed in the form or after creation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Copies Preview Section - Full Width */}
            {activeTab === "item-info" && (
                <div className="mt-8">
                    <RelatedCopiesPreview
                        copies={previewCopies}
                        onAddCopy={onAddPreviewCopy}
                        onAddMultipleCopies={onAddMultiplePreviewCopies}
                        onEditCopy={onEditPreviewCopy}
                        onDeleteCopy={onDeletePreviewCopy}
                    />
                </div>
            )}

            {/* Confirm Button */}
            <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-[#3a3a3a]">
                <SecondaryButton type="button" onClick={onBack}>
                    Back to Form
                </SecondaryButton>
                <PrimaryButton onClick={onConfirm} disabled={processing}>
                    {processing ? "Submitting..." : "Confirm & Submit"}
                </PrimaryButton>
            </div>
        </div>
    );
}
