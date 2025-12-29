import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { PageProps, Category, Publisher, Author } from "@/types";
import { toast } from "react-toastify";
import axios from "axios";
import { Info, Copy, BookOpen } from "lucide-react";
import { CatalogItemReview } from "../Components/page";
import { PreviewCopy } from "../Components/tables";
import { PreviewCopyBookModal, PreviewAddMultipleCopiesModal } from "../Components/modals";
import {
    ItemInfoTabContent,
    DetailTabContent,
    JournalTabContent,
    ThesisTabContent,

    StatusToggleSection,
    QuickAddModals,
    CatalogFormTabs,
    TabType,
} from "../Components/form-sections";

interface Props extends PageProps {
    categories: Category[];
    publishers: Publisher[];
    authors: Author[];
}

export default function Create({
    categories,
    publishers,
    authors,
}: Props) {
    const { data, setData, post, processing, errors, clearErrors, setError } = useForm({
        title: "",
        type: "",
        category_id: "",
        publisher_id: "",
        author_ids: [] as number[],
        isbn: "",
        isbn13: "",
        call_no: "",
        subject: "",
        series: "",
        edition: "",
        year: "",
        place_of_publication: "",
        extent: "",
        other_physical_details: "",
        dimensions: "",
        url: "",
        description: "",
        location: "",
        cover_image: null as File | null,
        is_active: true,
        volume: "",
        page_duration: "",
        abstract: "",
        biblio_info: "",
        url_visibility: "",
        library_branch: "",
        issn: "",
        frequency: "",
        journal_type: "",
        issue_type: "",
        issue_period: "",
        granting_institution: "",
        degree_qualification: "",
        supervisor: "",
        thesis_date: "",
        thesis_period: "",
        publication_type: "",
    });

    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [coverImageName, setCoverImageName] = useState<string>("");

    const [localCategories, setLocalCategories] = useState<Category[]>(categories);
    const [localPublishers, setLocalPublishers] = useState<Publisher[]>(publishers);
    const [localAuthors, setLocalAuthors] = useState<Author[]>(authors);

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showPublisherModal, setShowPublisherModal] = useState(false);
    const [showAuthorModal, setShowAuthorModal] = useState(false);

    const [activeTab, setActiveTab] = useState<TabType>("item-info");
    const [showReview, setShowReview] = useState(false);
    const [isValidating, setIsValidating] = useState(false);

    // Preview copies state
    const [previewCopies, setPreviewCopies] = useState<PreviewCopy[]>([]);
    const [nextCopyId, setNextCopyId] = useState(2);
    const [nextAccessionNo, setNextAccessionNo] = useState(1);

    // Copy modals state
    const [showPreviewCopyModal, setShowPreviewCopyModal] = useState(false);
    const [showPreviewMultipleCopiesModal, setShowPreviewMultipleCopiesModal] = useState(false);
    const [editingPreviewCopy, setEditingPreviewCopy] = useState<PreviewCopy | null>(null);

    // Generate accession number
    const generateAccessionNo = () => {
        const accNo = String(nextAccessionNo).padStart(7, '0');
        setNextAccessionNo(prev => prev + 1);
        return accNo;
    };

    // Initialize default copy when entering review mode
    const initializeDefaultCopy = async () => {
        try {
            // Fetch the next accession number from the server
            const response = await axios.get(route('admin.copies.next-accession'));
            const startAccNo = parseInt(response.data.next_accession_no) || 1;
            setNextAccessionNo(startAccNo + 1);

            setPreviewCopies([{
                id: 1,
                copy_no: 1,
                accession_no: String(startAccNo).padStart(7, '0'),
                branch: '',
                location: '',
                status: 'Available',
            }]);
            setNextCopyId(2);
        } catch (error) {
            // Fallback to local generation if API fails
            setPreviewCopies([{
                id: 1,
                copy_no: 1,
                accession_no: '0000001',
                branch: '',
                location: '',
                status: 'Available',
            }]);
            setNextCopyId(2);
            setNextAccessionNo(2);
        }
    };

    // Add a single copy
    const handleAddPreviewCopy = () => {
        setEditingPreviewCopy(null);
        setShowPreviewCopyModal(true);
    };

    // Add multiple copies
    const handleAddMultiplePreviewCopies = () => {
        setShowPreviewMultipleCopiesModal(true);
    };

    // Edit a copy
    const handleEditPreviewCopy = (copy: PreviewCopy) => {
        setEditingPreviewCopy(copy);
        setShowPreviewCopyModal(true);
    };

    // Delete a copy
    const handleDeletePreviewCopy = (id: number) => {
        const updatedCopies = previewCopies
            .filter(copy => copy.id !== id)
            .map((copy, index) => ({
                ...copy,
                copy_no: index + 1,
            }));
        setPreviewCopies(updatedCopies);
    };

    // Handle copy modal save (single copy - from PreviewCopyBookModal)
    const handlePreviewCopySave = (savedCopy: PreviewCopy) => {
        if (editingPreviewCopy) {
            // Update existing copy
            setPreviewCopies(previewCopies.map(copy =>
                copy.id === savedCopy.id ? savedCopy : copy
            ));
        } else {
            // Add new copy
            setPreviewCopies([...previewCopies, savedCopy]);
            setNextCopyId(savedCopy.id + 1);
        }
        setShowPreviewCopyModal(false);
        setEditingPreviewCopy(null);
    };

    // Handle multiple copies from PreviewCopyBookModal (via Multiple tab)
    const handlePreviewMultipleCopiesSave = (newCopies: PreviewCopy[]) => {
        // Re-number all copies properly
        const allCopies = [...previewCopies, ...newCopies];
        const renumbered = allCopies.map((copy, index) => ({
            ...copy,
            copy_no: index + 1,
        }));
        setPreviewCopies(renumbered);
        setNextCopyId(Math.max(...newCopies.map(c => c.id)) + 1);
        setShowPreviewCopyModal(false);
        setShowPreviewMultipleCopiesModal(false);
    };

    const handleReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsValidating(true);
        clearErrors();

        try {
            // Create FormData to properly handle file uploads
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'author_ids' && Array.isArray(value)) {
                    // Handle array of author IDs
                    value.forEach((id, index) => {
                        formData.append(`author_ids[${index}]`, id.toString());
                    });
                } else if (key === 'cover_image' && value instanceof File) {
                    // Handle file upload
                    formData.append(key, value);
                } else if (value !== null && value !== undefined) {
                    // Handle other fields
                    formData.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
                }
            });

            // Call Laravel backend validation with FormData
            await axios.post(route("admin.catalog-items.validate"), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Validation passed - show review page
            setShowReview(true);
            setActiveTab("item-info");
            initializeDefaultCopy(); // Initialize with 1 default copy
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error: any) {
            if (error.response?.status === 422) {
                // Validation failed - show errors
                const validationErrors = error.response.data.errors;

                // Set errors in form state
                Object.keys(validationErrors).forEach((field) => {
                    setError(field as any, validationErrors[field][0]);
                });

                // Determine which tab has the first error
                const itemInfoFields = [
                    "title", "type", "category_id", "publisher_id",
                    "author_ids", "year", "isbn", "isbn13", "call_no", "subject",
                    "series", "edition", "place_of_publication", "extent",
                    "other_physical_details", "dimensions", "location", "url", "description"
                ];
                const detailFields = ["volume", "page_duration", "abstract", "biblio_info", "url_visibility", "library_branch"];
                const journalFields = ["issn", "frequency", "journal_type", "issue_type", "issue_period"];
                const thesisFields = ["granting_institution", "degree_qualification", "supervisor", "thesis_date", "thesis_period", "publication_type"];

                const errorFields = Object.keys(validationErrors);

                if (errorFields.some(f => itemInfoFields.includes(f) || f.startsWith("author_ids"))) {
                    setActiveTab("item-info");
                } else if (errorFields.some(f => detailFields.includes(f))) {
                    setActiveTab("detail");
                } else if (errorFields.some(f => journalFields.includes(f))) {
                    setActiveTab("journal");
                } else if (errorFields.some(f => thesisFields.includes(f))) {
                    setActiveTab("thesis");
                }

                toast.error("Please fix the validation errors before proceeding to review.");

                // Scroll to first error after tab switch renders
                setTimeout(() => {
                    const errorElement = document.querySelector(".text-red-600, .text-red-500");
                    if (errorElement) {
                        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
                        const input = errorElement.closest("div")?.querySelector("input, select, textarea");
                        if (input instanceof HTMLElement) input.focus();
                    }
                }, 150);
            } else {
                toast.error("An unexpected error occurred. Please try again.");
                console.error("Validation error:", error);
            }
        } finally {
            setIsValidating(false);
        }
    };

    const handleConfirmSubmit = async () => {
        console.log("Submitting form data:", data);
        console.log("Preview copies:", previewCopies);

        // Create FormData to include copies
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'author_ids' && Array.isArray(value)) {
                value.forEach((id, index) => {
                    formData.append(`author_ids[${index}]`, id.toString());
                });
            } else if (key === 'cover_image' && value instanceof File) {
                formData.append(key, value);
            } else if (value !== null && value !== undefined) {
                formData.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
            }
        });

        // Add preview copies to form data
        previewCopies.forEach((copy, index) => {
            formData.append(`copies[${index}][accession_no]`, copy.accession_no);
            formData.append(`copies[${index}][branch]`, copy.branch || '');
            formData.append(`copies[${index}][location]`, copy.location || '');
        });

        try {
            const response = await axios.post(route("admin.catalog-items.store"), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success || response.status === 200 || response.status === 201) {
                toast.success("Catalog item created successfully!");
                router.visit(route("admin.catalog-items.index"));
            }
        } catch (error: any) {
            console.log("Submission error:", error);

            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors || {};
                const errorKeys = Object.keys(validationErrors);
                const firstError = Object.values(validationErrors)[0];

                if (firstError && Array.isArray(firstError)) {
                    toast.error(firstError[0] as string);
                } else if (typeof firstError === 'string') {
                    toast.error(firstError);
                }

                // Only go back to form if there are errors OTHER than cover_image
                const hasOnlyCoverImageError = errorKeys.length === 1 && errorKeys[0] === 'cover_image';

                if (!hasOnlyCoverImageError) {
                    setShowReview(false);
                }
            } else {
                toast.error("Failed to create catalog item. Please try again.");
            }
        }
    };

    const handleBackToForm = () => {
        setShowReview(false);
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
        setCoverImagePreview(null);
    };

    const handleCategoryAdded = async (name: string) => {
        try {
            const response = await axios.post(route('admin.categories.store'), {
                name,
                is_published: true,
            });

            if (response.data) {
                const newCategory = response.data.category;
                setLocalCategories([...localCategories, newCategory]);
                setData('category_id', newCategory.id.toString());
                setShowCategoryModal(false);
                toast.success('Category added successfully!');
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                toast.error(error.response.data.errors.name?.[0] || 'Failed to add category');
            }
        }
    };

    const handlePublisherAdded = async (name: string, country: string) => {
        try {
            const response = await axios.post(route('admin.publishers.store'), {
                name,
                country,
                is_published: true,
            });

            if (response.data) {
                const newPublisher = response.data.publisher;
                setLocalPublishers([...localPublishers, newPublisher]);
                setData('publisher_id', newPublisher.id.toString());
                setShowPublisherModal(false);
                toast.success('Publisher added successfully!');
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const errorMsg = error.response.data.errors.name?.[0] || error.response.data.errors.country?.[0] || 'Failed to add publisher';
                toast.error(errorMsg);
            }
        }
    };

    const handleAuthorAdded = async (name: string, country: string) => {
        try {
            const response = await axios.post(route('admin.authors.store'), {
                name,
                country,
                is_published: true,
            });

            if (response.data) {
                const newAuthor = response.data.author;
                setLocalAuthors([...localAuthors, newAuthor]);
                setData('author_ids', [...data.author_ids, newAuthor.id]);
                setShowAuthorModal(false);
                toast.success('Author added successfully!');
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const errorMsg = error.response.data.errors.name?.[0] || error.response.data.errors.country?.[0] || 'Failed to add author';
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

    return (
        <AuthenticatedLayout>
            <Head title="Add Catalog Item" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="border-b border-gray-200 p-4 dark:border-[#3a3a3a] sm:p-6">
                            <h2 className="text-xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                {showReview ? "Review Catalog Item" : "Add New Catalog Item"}
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400">
                                {showReview
                                    ? "Review the information below before submitting"
                                    : "Fill in the information below to create a new catalog item"}
                            </p>
                        </div>

                        {showReview ? (
                            <div className="p-4 sm:p-6">
                                <CatalogItemReview
                                    data={data}
                                    categories={localCategories}
                                    authors={localAuthors}
                                    publishers={localPublishers}
                                    coverImagePreview={coverImagePreview}
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                    onBack={handleBackToForm}
                                    onConfirm={handleConfirmSubmit}
                                    processing={processing}
                                    onShowCategoryModal={() => setShowCategoryModal(true)}
                                    onShowAuthorModal={() => setShowAuthorModal(true)}
                                    onShowPublisherModal={() => setShowPublisherModal(true)}
                                    coverImageName={coverImageName}
                                    error={errors.cover_image}
                                    onImageChange={handleImageChange}
                                    onRemoveImage={handleRemoveImage}
                                    previewCopies={previewCopies}
                                    onAddPreviewCopy={handleAddPreviewCopy}
                                    onAddMultiplePreviewCopies={handleAddMultiplePreviewCopies}
                                    onEditPreviewCopy={handleEditPreviewCopy}
                                    onDeletePreviewCopy={handleDeletePreviewCopy}
                                />
                            </div>
                        ) : (
                            <form onSubmit={handleReview} className="p-4 sm:p-6">
                                <CatalogFormTabs
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                >
                                    {activeTab === "item-info" && (
                                        <ItemInfoTabContent
                                            data={data}
                                            errors={errors}
                                            categories={localCategories}
                                            authors={localAuthors}
                                            publishers={localPublishers}
                                            onDataChange={handleDataChange}
                                            onClearErrors={handleClearErrors}
                                            onShowCategoryModal={() => setShowCategoryModal(true)}
                                            onShowAuthorModal={() => setShowAuthorModal(true)}
                                            onShowPublisherModal={() => setShowPublisherModal(true)}
                                        />
                                    )}

                                    {activeTab === "detail" && (
                                        <DetailTabContent
                                            data={data}
                                            errors={errors}
                                            onDataChange={handleDataChange}
                                            onClearErrors={handleClearErrors}
                                        />
                                    )}

                                    {activeTab === "journal" && (
                                        <JournalTabContent
                                            data={data}
                                            errors={errors}
                                            onDataChange={handleDataChange}
                                            onClearErrors={handleClearErrors}
                                        />
                                    )}

                                    {activeTab === "thesis" && (
                                        <ThesisTabContent
                                            data={data}
                                            errors={errors}
                                            onDataChange={handleDataChange}
                                            onClearErrors={handleClearErrors}
                                        />
                                    )}
                                </CatalogFormTabs>

                                <div className="mt-8 space-y-8">


                                    <StatusToggleSection
                                        isActive={data.is_active}
                                        onToggle={() => setData("is_active", !data.is_active)}
                                    />
                                </div>

                                <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-[#3a3a3a]">
                                    <SecondaryButton type="button" onClick={handleCancel}>
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing || isValidating}>
                                        {isValidating ? "Validating..." : "Review & Submit"}
                                    </PrimaryButton>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <QuickAddModals
                mode={showReview ? "full" : "simple"}
                showCategoryModal={showCategoryModal}
                showPublisherModal={showPublisherModal}
                showAuthorModal={showAuthorModal}
                onCloseCategoryModal={() => setShowCategoryModal(false)}
                onClosePublisherModal={() => setShowPublisherModal(false)}
                onCloseAuthorModal={() => setShowAuthorModal(false)}
                onCategoryAdded={handleCategoryAdded}
                onPublisherAdded={handlePublisherAdded}
                onAuthorAdded={handleAuthorAdded}
                categories={localCategories}
                publishers={localPublishers}
                authors={localAuthors}
                selectedCategoryId={data.category_id}
                selectedPublisherId={data.publisher_id}
                selectedAuthorIds={data.author_ids}
                onSelectCategory={(categoryId) => setData('category_id', categoryId)}
                onSelectPublisher={(publisherId) => setData('publisher_id', publisherId)}
                onSelectAuthor={(authorId) => {
                    if (!data.author_ids.includes(authorId)) {
                        setData('author_ids', [...data.author_ids, authorId]);
                    }
                }}
            />

            {/* Preview Copy Modals */}
            <PreviewCopyBookModal
                show={showPreviewCopyModal}
                title={data.title || "New Catalog Item"}
                editingCopy={editingPreviewCopy}
                onClose={() => {
                    setShowPreviewCopyModal(false);
                    setEditingPreviewCopy(null);
                }}
                onSaveSingle={handlePreviewCopySave}
                onSaveMultiple={handlePreviewMultipleCopiesSave}
                existingCopies={previewCopies}
                nextCopyId={nextCopyId}
            />

            <PreviewAddMultipleCopiesModal
                show={showPreviewMultipleCopiesModal}
                title={data.title || "New Catalog Item"}
                onClose={() => setShowPreviewMultipleCopiesModal(false)}
                onSave={handlePreviewMultipleCopiesSave}
                existingCopies={previewCopies}
                nextCopyId={nextCopyId}
            />
        </AuthenticatedLayout>
    );
}
