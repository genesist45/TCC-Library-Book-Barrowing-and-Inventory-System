import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { FormEventHandler, useState, useEffect } from "react";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { Upload, X, Plus } from "lucide-react";
import { PageProps, Category, Publisher, Author, CatalogItem } from "@/types";
import { toast } from "react-toastify";
import SearchableMultiSelect from "@/components/common/SearchableMultiSelect";
import Modal from "@/components/modals/Modal";
import axios from "axios";

interface Props extends PageProps {
    catalogItem: CatalogItem;
    categories: Category[];
    publishers: Publisher[];
    authors: Author[];
}

interface FormData {
    title: string;
    accession_no: string;
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
    _method: string;
}

export default function CatalogItemEdit({
    catalogItem,
    categories,
    publishers,
    authors,
}: Props) {
    const { data, setData, post, processing, errors, clearErrors } = useForm<FormData>({
        title: catalogItem.title || "",
        accession_no: catalogItem.accession_no || "",
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
    
    const [localCategories, setLocalCategories] = useState<Category[]>(categories);
    const [localPublishers, setLocalPublishers] = useState<Publisher[]>(publishers);
    const [localAuthors, setLocalAuthors] = useState<Author[]>(authors);
    
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showPublisherModal, setShowPublisherModal] = useState(false);
    const [showAuthorModal, setShowAuthorModal] = useState(false);
    
    const [activeTab, setActiveTab] = useState<'detail' | 'journal' | 'thesis'>('detail');

    useEffect(() => {
        if (catalogItem.cover_image) {
            setCoverImagePreview(`/storage/${catalogItem.cover_image}`);
        }
    }, [catalogItem.cover_image]);

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

    const handleAuthorsChange = (authorIds: number[]) => {
        setData("author_ids", authorIds);
        clearErrors("author_ids");
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

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                            <div className="space-y-8">
                                {/* Basic Information Section */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Basic Information
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Essential details about the catalog item
                                    </p>
                                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <InputLabel
                                                htmlFor="title"
                                                value="Title"
                                                required
                                            />
                                            <TextInput
                                                id="title"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.title}
                                                onChange={(e) => {
                                                    setData(
                                                        "title",
                                                        e.target.value,
                                                    );
                                                    clearErrors("title");
                                                }}
                                            />
                                            <InputError
                                                message={errors.title}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="accession_no"
                                                value="Accession No."
                                                required
                                            />
                                            <TextInput
                                                id="accession_no"
                                                type="text"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.accession_no}
                                                onChange={(e) => {
                                                    setData(
                                                        "accession_no",
                                                        e.target.value,
                                                    );
                                                    clearErrors("accession_no");
                                                }}
                                            />
                                            <InputError
                                                message={errors.accession_no}
                                                className="mt-1"
                                            />
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Unique 7-digit number (editable if needed)
                                            </p>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <InputLabel
                                                htmlFor="authors"
                                                value="Authors"
                                            />
                                            <div className="mt-1">
                                                <SearchableMultiSelect
                                                    options={localAuthors}
                                                    selectedIds={
                                                        data.author_ids
                                                    }
                                                    onChange={
                                                        handleAuthorsChange
                                                    }
                                                    placeholder="Search authors..."
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowAuthorModal(true)}
                                                className="mt-2 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                <Plus className="h-3 w-3" />
                                                Author not listed? Click here to add.
                                            </button>
                                            <InputError
                                                message={errors.author_ids}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="type"
                                                value="Material Type"
                                                required
                                            />
                                            <select
                                                id="type"
                                                value={data.type}
                                                onChange={(e) => {
                                                    setData(
                                                        "type",
                                                        e.target.value,
                                                    );
                                                    clearErrors("type");
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                            >
                                                <option value="">
                                                    Select Type
                                                </option>
                                                <option value="Book">
                                                    Book
                                                </option>
                                                <option value="Thesis">
                                                    Thesis
                                                </option>
                                                <option value="Journal">
                                                    Journal
                                                </option>
                                                <option value="Magazine">
                                                    Magazine
                                                </option>
                                                <option value="Newspaper">
                                                    Newspaper
                                                </option>
                                                <option value="DVD">DVD</option>
                                                <option value="CD">CD</option>
                                                <option value="Other">
                                                    Other
                                                </option>
                                            </select>
                                            <InputError
                                                message={errors.type}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="category_id"
                                                value="Category"
                                            />
                                            <select
                                                id="category_id"
                                                value={data.category_id}
                                                onChange={(e) => {
                                                    setData(
                                                        "category_id",
                                                        e.target.value,
                                                    );
                                                    clearErrors("category_id");
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                            >
                                                <option value="">
                                                    Select Category
                                                </option>
                                                {localCategories.map((category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => setShowCategoryModal(true)}
                                                className="mt-2 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                <Plus className="h-3 w-3" />
                                                Category not listed? Click here to add.
                                            </button>
                                            <InputError
                                                message={errors.category_id}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Publication Details Section */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Publication Details
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Information about the publication
                                    </p>
                                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div>
                                            <InputLabel
                                                htmlFor="place_of_publication"
                                                value="Place of Publication"
                                            />
                                            <TextInput
                                                id="place_of_publication"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={
                                                    data.place_of_publication
                                                }
                                                onChange={(e) => {
                                                    setData(
                                                        "place_of_publication",
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        "place_of_publication",
                                                    );
                                                }}
                                                placeholder="e.g., New York, London"
                                            />
                                            <InputError
                                                message={
                                                    errors.place_of_publication
                                                }
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="publisher_id"
                                                value="Publisher"
                                            />
                                            <select
                                                id="publisher_id"
                                                value={data.publisher_id}
                                                onChange={(e) => {
                                                    setData(
                                                        "publisher_id",
                                                        e.target.value,
                                                    );
                                                    clearErrors("publisher_id");
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                            >
                                                <option value="">
                                                    Select Publisher
                                                </option>
                                                {localPublishers.map((publisher) => (
                                                    <option
                                                        key={publisher.id}
                                                        value={publisher.id}
                                                    >
                                                        {publisher.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => setShowPublisherModal(true)}
                                                className="mt-2 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                <Plus className="h-3 w-3" />
                                                Publisher not listed? Click here to add.
                                            </button>
                                            <InputError
                                                message={errors.publisher_id}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="year"
                                                value="Year of Publication"
                                            />
                                            <TextInput
                                                id="year"
                                                type="number"
                                                className="mt-1 block w-full"
                                                value={data.year}
                                                onChange={(e) => {
                                                    setData(
                                                        "year",
                                                        e.target.value,
                                                    );
                                                    clearErrors("year");
                                                }}
                                                placeholder="e.g., 2024"
                                                min="1000"
                                                max={
                                                    new Date().getFullYear() +
                                                    10
                                                }
                                            />
                                            <InputError
                                                message={errors.year}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Physical Description Section */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Physical Description
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Physical characteristics of the item
                                    </p>
                                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div>
                                            <InputLabel
                                                htmlFor="extent"
                                                value="Extent"
                                            />
                                            <TextInput
                                                id="extent"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.extent}
                                                onChange={(e) => {
                                                    setData(
                                                        "extent",
                                                        e.target.value,
                                                    );
                                                    clearErrors("extent");
                                                }}
                                                placeholder="e.g., 320 pages"
                                            />
                                            <InputError
                                                message={errors.extent}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="other_physical_details"
                                                value="Other Physical Details"
                                            />
                                            <TextInput
                                                id="other_physical_details"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={
                                                    data.other_physical_details
                                                }
                                                onChange={(e) => {
                                                    setData(
                                                        "other_physical_details",
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        "other_physical_details",
                                                    );
                                                }}
                                                placeholder="e.g., illustrations, maps"
                                            />
                                            <InputError
                                                message={
                                                    errors.other_physical_details
                                                }
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="dimensions"
                                                value="Dimensions"
                                            />
                                            <TextInput
                                                id="dimensions"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.dimensions}
                                                onChange={(e) => {
                                                    setData(
                                                        "dimensions",
                                                        e.target.value,
                                                    );
                                                    clearErrors("dimensions");
                                                }}
                                                placeholder="e.g., 24 cm"
                                            />
                                            <InputError
                                                message={errors.dimensions}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Details Section */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Additional Details
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Optional metadata and cataloging
                                        information
                                    </p>
                                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <InputLabel
                                                htmlFor="isbn"
                                                value="ISBN"
                                            />
                                            <TextInput
                                                id="isbn"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.isbn}
                                                onChange={(e) => {
                                                    setData(
                                                        "isbn",
                                                        e.target.value,
                                                    );
                                                    clearErrors("isbn");
                                                }}
                                            />
                                            <InputError
                                                message={errors.isbn}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="isbn13"
                                                value="ISBN-13"
                                            />
                                            <TextInput
                                                id="isbn13"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.isbn13}
                                                onChange={(e) => {
                                                    setData(
                                                        "isbn13",
                                                        e.target.value,
                                                    );
                                                    clearErrors("isbn13");
                                                }}
                                            />
                                            <InputError
                                                message={errors.isbn13}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="call_no"
                                                value="Call Number"
                                            />
                                            <TextInput
                                                id="call_no"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.call_no}
                                                onChange={(e) => {
                                                    setData(
                                                        "call_no",
                                                        e.target.value,
                                                    );
                                                    clearErrors("call_no");
                                                }}
                                            />
                                            <InputError
                                                message={errors.call_no}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="subject"
                                                value="Subject"
                                            />
                                            <TextInput
                                                id="subject"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.subject}
                                                onChange={(e) => {
                                                    setData(
                                                        "subject",
                                                        e.target.value,
                                                    );
                                                    clearErrors("subject");
                                                }}
                                            />
                                            <InputError
                                                message={errors.subject}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="series"
                                                value="Series"
                                            />
                                            <TextInput
                                                id="series"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.series}
                                                onChange={(e) => {
                                                    setData(
                                                        "series",
                                                        e.target.value,
                                                    );
                                                    clearErrors("series");
                                                }}
                                            />
                                            <InputError
                                                message={errors.series}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="edition"
                                                value="Edition"
                                            />
                                            <TextInput
                                                id="edition"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.edition}
                                                onChange={(e) => {
                                                    setData(
                                                        "edition",
                                                        e.target.value,
                                                    );
                                                    clearErrors("edition");
                                                }}
                                            />
                                            <InputError
                                                message={errors.edition}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <InputLabel
                                                htmlFor="url"
                                                value="URL"
                                            />
                                            <TextInput
                                                id="url"
                                                type="url"
                                                className="mt-1 block w-full"
                                                value={data.url}
                                                onChange={(e) => {
                                                    setData(
                                                        "url",
                                                        e.target.value,
                                                    );
                                                    clearErrors("url");
                                                }}
                                                placeholder="https://..."
                                            />
                                            <InputError
                                                message={errors.url}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <InputLabel
                                                htmlFor="description"
                                                value="Description"
                                            />
                                            <textarea
                                                id="description"
                                                rows={4}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                                value={data.description}
                                                onChange={(e) => {
                                                    setData(
                                                        "description",
                                                        e.target.value,
                                                    );
                                                    clearErrors("description");
                                                }}
                                                placeholder="Brief description of this item..."
                                            />
                                            <InputError
                                                message={errors.description}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <InputLabel
                                                htmlFor="location"
                                                value="Location"
                                            />
                                            <select
                                                id="location"
                                                value={data.location}
                                                onChange={(e) => {
                                                    setData(
                                                        "location",
                                                        e.target.value,
                                                    );
                                                    clearErrors("location");
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                            >
                                                <option value="">
                                                    Select Location
                                                </option>
                                                <option value="Filipianna">
                                                    Filipianna
                                                </option>
                                                <option value="Circulation">
                                                    Circulation
                                                </option>
                                                <option value="Theses">
                                                    Theses
                                                </option>
                                                <option value="Fiction">
                                                    Fiction
                                                </option>
                                                <option value="Reserve">
                                                    Reserve
                                                </option>
                                            </select>
                                            <InputError
                                                message={errors.location}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Specialized Fields Tabs Section */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Specialized Fields
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Additional information for specific material types
                                    </p>
                                    
                                    <div className="mt-4">
                                        <div className="border-b border-gray-200 dark:border-gray-700">
                                            <nav className="-mb-px flex space-x-8">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab('detail')}
                                                    className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                                                        activeTab === 'detail'
                                                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                                    }`}
                                                >
                                                    DETAIL
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab('journal')}
                                                    className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                                                        activeTab === 'journal'
                                                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                                    }`}
                                                >
                                                    JOURNAL
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab('thesis')}
                                                    className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                                                        activeTab === 'thesis'
                                                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                                    }`}
                                                >
                                                    THESIS
                                                </button>
                                            </nav>
                                        </div>

                                        <div className="mt-6">
                                            {activeTab === 'detail' && (
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    <div>
                                                        <InputLabel htmlFor="volume" value="Volume" />
                                                        <TextInput
                                                            id="volume"
                                                            type="text"
                                                            className="mt-1 block w-full"
                                                            value={data.volume}
                                                            onChange={(e) => {
                                                                setData("volume", e.target.value);
                                                                clearErrors("volume");
                                                            }}
                                                            placeholder="e.g., Vol. 1"
                                                        />
                                                        <InputError message={errors.volume} className="mt-1" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="page_duration" value="Page / Duration" />
                                                        <TextInput
                                                            id="page_duration"
                                                            type="text"
                                                            className="mt-1 block w-full"
                                                            value={data.page_duration}
                                                            onChange={(e) => {
                                                                setData("page_duration", e.target.value);
                                                                clearErrors("page_duration");
                                                            }}
                                                            placeholder="e.g., 320 pages or 90 minutes"
                                                        />
                                                        <InputError message={errors.page_duration} className="mt-1" />
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <InputLabel htmlFor="abstract" value="Abstract" />
                                                        <textarea
                                                            id="abstract"
                                                            rows={3}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                                            value={data.abstract}
                                                            onChange={(e) => {
                                                                setData("abstract", e.target.value);
                                                                clearErrors("abstract");
                                                            }}
                                                            placeholder="Short summary of the content..."
                                                        />
                                                        <InputError message={errors.abstract} className="mt-1" />
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <InputLabel htmlFor="biblio_info" value="Biblio Information" />
                                                        <textarea
                                                            id="biblio_info"
                                                            rows={3}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                                            value={data.biblio_info}
                                                            onChange={(e) => {
                                                                setData("biblio_info", e.target.value);
                                                                clearErrors("biblio_info");
                                                            }}
                                                            placeholder="Staff-only notes..."
                                                        />
                                                        <InputError message={errors.biblio_info} className="mt-1" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="url_visibility" value="URL Visibility" />
                                                        <select
                                                            id="url_visibility"
                                                            value={data.url_visibility}
                                                            onChange={(e) => {
                                                                setData("url_visibility", e.target.value);
                                                                clearErrors("url_visibility");
                                                            }}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                                        >
                                                            <option value="">Select Visibility</option>
                                                            <option value="Public">Public</option>
                                                            <option value="Staff Only">Staff Only</option>
                                                        </select>
                                                        <InputError message={errors.url_visibility} className="mt-1" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="library_branch" value="Library Branch" />
                                                        <TextInput
                                                            id="library_branch"
                                                            type="text"
                                                            className="mt-1 block w-full"
                                                            value={data.library_branch}
                                                            onChange={(e) => {
                                                                setData("library_branch", e.target.value);
                                                                clearErrors("library_branch");
                                                            }}
                                                            placeholder="e.g., Main Library"
                                                        />
                                                        <InputError message={errors.library_branch} className="mt-1" />
                                                    </div>
                                                </div>
                                            )}

                                            {activeTab === 'journal' && (
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    <div>
                                                        <InputLabel htmlFor="issn" value="ISSN" />
                                                        <TextInput
                                                            id="issn"
                                                            type="text"
                                                            className="mt-1 block w-full"
                                                            value={data.issn}
                                                            onChange={(e) => {
                                                                setData("issn", e.target.value);
                                                                clearErrors("issn");
                                                            }}
                                                            placeholder="e.g., 1234-5678"
                                                        />
                                                        <InputError message={errors.issn} className="mt-1" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="frequency" value="Frequency" />
                                                        <select
                                                            id="frequency"
                                                            value={data.frequency}
                                                            onChange={(e) => {
                                                                setData("frequency", e.target.value);
                                                                clearErrors("frequency");
                                                            }}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                                        >
                                                            <option value="">Select Frequency</option>
                                                            <option value="Daily">Daily</option>
                                                            <option value="Weekly">Weekly</option>
                                                            <option value="Monthly">Monthly</option>
                                                            <option value="Quarterly">Quarterly</option>
                                                            <option value="Annually">Annually</option>
                                                            <option value="Biannually">Biannually</option>
                                                        </select>
                                                        <InputError message={errors.frequency} className="mt-1" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="journal_type" value="Journal Type" />
                                                        <TextInput
                                                            id="journal_type"
                                                            type="text"
                                                            className="mt-1 block w-full"
                                                            value={data.journal_type}
                                                            onChange={(e) => {
                                                                setData("journal_type", e.target.value);
                                                                clearErrors("journal_type");
                                                            }}
                                                            placeholder="e.g., Academic, Trade"
                                                        />
                                                        <InputError message={errors.journal_type} className="mt-1" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="issue_type" value="Issue Type" />
                                                        <TextInput
                                                            id="issue_type"
                                                            type="text"
                                                            className="mt-1 block w-full"
                                                            value={data.issue_type}
                                                            onChange={(e) => {
                                                                setData("issue_type", e.target.value);
                                                                clearErrors("issue_type");
                                                            }}
                                                            placeholder="e.g., Special Issue"
                                                        />
                                                        <InputError message={errors.issue_type} className="mt-1" />
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <InputLabel htmlFor="issue_period" value="Issue Period" />
                                                        <TextInput
                                                            id="issue_period"
                                                            type="text"
                                                            className="mt-1 block w-full"
                                                            value={data.issue_period}
                                                            onChange={(e) => {
                                                                setData("issue_period", e.target.value);
                                                                clearErrors("issue_period");
                                                            }}
                                                            placeholder="e.g., Summer, Q3"
                                                        />
                                                        <InputError message={errors.issue_period} className="mt-1" />
                                                    </div>
                                                </div>
                                            )}

                                            {activeTab === 'thesis' && (
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    <div className="sm:col-span-2">
                                                        <InputLabel htmlFor="granting_institution" value="Granting Institution" required={data.type === 'Thesis'} />
                                                        <TextInput
                                                            id="granting_institution"
                                                            type="text"
                                                            className="mt-1 block w-full"
                                                            value={data.granting_institution}
                                                            onChange={(e) => {
                                                                setData("granting_institution", e.target.value);
                                                                clearErrors("granting_institution");
                                                            }}
                                                            placeholder="e.g., University of the Philippines"
                                                        />
                                                        <InputError message={errors.granting_institution} className="mt-1" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="degree_qualification" value="Degree / Qualification" required={data.type === 'Thesis'} />
                                                        <select
                                                            id="degree_qualification"
                                                            value={data.degree_qualification}
                                                            onChange={(e) => {
                                                                setData("degree_qualification", e.target.value);
                                                                clearErrors("degree_qualification");
                                                            }}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                                        >
                                                            <option value="">Select Degree</option>
                                                            <option value="Ph.D.">Ph.D.</option>
                                                            <option value="M.A.">M.A.</option>
                                                            <option value="M.S.">M.S.</option>
                                                            <option value="MBA">MBA</option>
                                                            <option value="Ed.D.">Ed.D.</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                        <InputError message={errors.degree_qualification} className="mt-1" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="supervisor" value="Supervisor" />
                                                        <TextInput
                                                            id="supervisor"
                                                            type="text"
                                                            className="mt-1 block w-full"
                                                            value={data.supervisor}
                                                            onChange={(e) => {
                                                                setData("supervisor", e.target.value);
                                                                clearErrors("supervisor");
                                                            }}
                                                            placeholder="e.g., Dr. Juan Dela Cruz"
                                                        />
                                                        <InputError message={errors.supervisor} className="mt-1" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="thesis_date" value="Date" />
                                                        <TextInput
                                                            id="thesis_date"
                                                            type="date"
                                                            className="mt-1 block w-full"
                                                            value={data.thesis_date}
                                                            onChange={(e) => {
                                                                setData("thesis_date", e.target.value);
                                                                clearErrors("thesis_date");
                                                            }}
                                                        />
                                                        <InputError message={errors.thesis_date} className="mt-1" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="thesis_period" value="Period" />
                                                        <TextInput
                                                            id="thesis_period"
                                                            type="text"
                                                            className="mt-1 block w-full"
                                                            value={data.thesis_period}
                                                            onChange={(e) => {
                                                                setData("thesis_period", e.target.value);
                                                                clearErrors("thesis_period");
                                                            }}
                                                            placeholder="e.g., 2023-2024"
                                                        />
                                                        <InputError message={errors.thesis_period} className="mt-1" />
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <InputLabel htmlFor="publication_type" value="Publication Type" />
                                                        <select
                                                            id="publication_type"
                                                            value={data.publication_type}
                                                            onChange={(e) => {
                                                                setData("publication_type", e.target.value);
                                                                clearErrors("publication_type");
                                                            }}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                                        >
                                                            <option value="">Select Type</option>
                                                            <option value="Master's Thesis">Master's Thesis</option>
                                                            <option value="Doctoral Dissertation">Doctoral Dissertation</option>
                                                            <option value="Undergraduate Thesis">Undergraduate Thesis</option>
                                                            <option value="Research Paper">Research Paper</option>
                                                        </select>
                                                        <InputError message={errors.publication_type} className="mt-1" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Cover Image Section */}
                                <div>
                                    <div className="mt-4">
                                        <div className="sm:col-span-2">
                                            <InputLabel
                                                htmlFor="cover_image"
                                                value="Cover Image"
                                            />
                                            <div className="mt-1 flex items-center gap-4">
                                                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                                    <Upload className="h-4 w-4" />
                                                    Change File
                                                    <input
                                                        type="file"
                                                        id="cover_image"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={
                                                            handleImageChange
                                                        }
                                                    />
                                                </label>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {coverImageName ||
                                                        (catalogItem.cover_image
                                                            ? "Current cover"
                                                            : "No file chosen")}
                                                </span>
                                                {coverImageName && (
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleRemoveImage
                                                        }
                                                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="mt-3">
                                                {coverImagePreview ? (
                                                    <img
                                                        src={coverImagePreview}
                                                        alt="Cover preview"
                                                        className="h-48 w-auto rounded-md border border-gray-300 object-cover shadow-sm dark:border-gray-700"
                                                    />
                                                ) : (
                                                    <div className="flex h-48 w-32 items-center justify-center rounded-md border border-gray-300 bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                                        <div className="text-center">
                                                            <div className="mb-2 text-4xl font-bold text-gray-300 dark:text-gray-600">
                                                                N/A
                                                            </div>
                                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                                No Cover Image
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                Recommended: JPG, PNG (Max 2MB)
                                            </p>
                                            <InputError
                                                message={errors.cover_image}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Status Section */}
                                <div>
                                    <div className="mt-4">
                                        <div className="sm:col-span-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <InputLabel
                                                        htmlFor="is_active"
                                                        value="Status"
                                                    />
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Make this item available
                                                        in the catalog
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            "is_active",
                                                            !data.is_active,
                                                        )
                                                    }
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                                        data.is_active
                                                            ? "bg-indigo-600"
                                                            : "bg-gray-200 dark:bg-gray-700"
                                                    }`}
                                                    role="switch"
                                                    aria-checked={
                                                        data.is_active
                                                    }
                                                >
                                                    <span
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                            data.is_active
                                                                ? "translate-x-5"
                                                                : "translate-x-0"
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                            <div className="mt-2">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        data.is_active
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                                    }`}
                                                >
                                                    {data.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-[#3a3a3a]">
                                <SecondaryButton
                                    type="button"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton disabled={processing}>
                                    Update Catalog Item
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Quick Add Modals */}
            <Modal show={showCategoryModal} onClose={() => setShowCategoryModal(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Quick Add Category
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Add a new category quickly without leaving this page
                    </p>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        await handleCategoryAdded(formData.get('name') as string);
                    }} className="mt-4 space-y-4">
                        <div>
                            <InputLabel htmlFor="quick_category_name" value="Category Name" required />
                            <TextInput
                                id="quick_category_name"
                                name="name"
                                type="text"
                                className="mt-1 block w-full"
                                placeholder="e.g., Science Fiction"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <SecondaryButton type="button" onClick={() => setShowCategoryModal(false)}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton type="submit">
                                Add Category
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal show={showPublisherModal} onClose={() => setShowPublisherModal(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Quick Add Publisher
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Add a new publisher quickly without leaving this page
                    </p>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        await handlePublisherAdded(
                            formData.get('name') as string,
                            formData.get('country') as string
                        );
                    }} className="mt-4 space-y-4">
                        <div>
                            <InputLabel htmlFor="quick_publisher_name" value="Publisher Name" required />
                            <TextInput
                                id="quick_publisher_name"
                                name="name"
                                type="text"
                                className="mt-1 block w-full"
                                placeholder="e.g., Penguin Books"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="quick_publisher_country" value="Country" required />
                            <TextInput
                                id="quick_publisher_country"
                                name="country"
                                type="text"
                                className="mt-1 block w-full"
                                placeholder="e.g., United States"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <SecondaryButton type="button" onClick={() => setShowPublisherModal(false)}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton type="submit">
                                Add Publisher
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal show={showAuthorModal} onClose={() => setShowAuthorModal(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Quick Add Author
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Add a new author quickly without leaving this page
                    </p>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        await handleAuthorAdded(
                            formData.get('name') as string,
                            formData.get('country') as string
                        );
                    }} className="mt-4 space-y-4">
                        <div>
                            <InputLabel htmlFor="quick_author_name" value="Author Name" required />
                            <TextInput
                                id="quick_author_name"
                                name="name"
                                type="text"
                                className="mt-1 block w-full"
                                placeholder="e.g., J.K. Rowling"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="quick_author_country" value="Country" required />
                            <TextInput
                                id="quick_author_country"
                                name="country"
                                type="text"
                                className="mt-1 block w-full"
                                placeholder="e.g., United Kingdom"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <SecondaryButton type="button" onClick={() => setShowAuthorModal(false)}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton type="submit">
                                Add Author
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
