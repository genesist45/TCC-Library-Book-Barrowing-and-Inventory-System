import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { PageProps, Category, Publisher, Author } from "@/types";
import { toast } from "react-toastify";
import axios from "axios";
import { Info, Copy, BookOpen } from "lucide-react";
import CatalogItemReview from "@/components/catalog-items/CatalogItemReview";
import {
    ItemInfoTabContent,
    DetailTabContent,
    JournalTabContent,
    ThesisTabContent,

    StatusToggleSection,
    QuickAddModals,
    CatalogFormTabs,
    TabType,
} from "@/components/catalog-items/form-sections";

interface Props extends PageProps {
    categories: Category[];
    publishers: Publisher[];
    authors: Author[];
}

export default function CatalogItemAdd({
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

    const handleReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsValidating(true);
        clearErrors();

        try {
            // Call Laravel backend validation
            await axios.post(route("admin.catalog-items.validate"), data);

            // Validation passed - show review page
            setShowReview(true);
            setActiveTab("item-info");
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

    const handleConfirmSubmit = () => {
        console.log("Submitting form data:", data);
        post(route("admin.catalog-items.store"), {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Catalog item created successfully!");
            },
            onError: (errors) => {
                console.log("Validation errors:", errors);
                const firstError = Object.values(errors)[0];
                if (firstError) {
                    toast.error(firstError as string);
                }
                setShowReview(false); // Go back to form on error
            },
        });
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
        </AuthenticatedLayout>
    );
}
