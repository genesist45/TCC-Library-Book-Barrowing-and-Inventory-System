import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { Upload, X } from "lucide-react";
import { PageProps, Category, Publisher, Author } from "@/types";
import { toast } from "react-toastify";
import SearchableMultiSelect from "@/components/common/SearchableMultiSelect";

interface Props extends PageProps {
    categories: Category[];
    publishers: Publisher[];
    authors: Author[];
    nextAccessionNo: string;
}

export default function CatalogItemAdd({
    categories,
    publishers,
    authors,
    nextAccessionNo,
}: Props) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        title: "",
        accession_no: nextAccessionNo,
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
    });

    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
        null,
    );
    const [coverImageName, setCoverImageName] = useState<string>("");

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.catalog-items.store"), {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Catalog item created successfully!");
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
        setCoverImagePreview(null);
    };

    const handleAuthorsChange = (authorIds: number[]) => {
        setData("author_ids", authorIds);
        clearErrors("author_ids");
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Catalog Item" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="border-b border-gray-200 p-4 dark:border-[#3a3a3a] sm:p-6">
                            <h2 className="text-xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                Add New Catalog Item
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400">
                                Fill in the information below to create a new
                                catalog item
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
                                        <div className="sm:col-span-2">
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

                                        <div className="sm:col-span-2">
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
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Auto-generated unique 7-digit number (editable if needed)
                                            </p>
                                            <InputError
                                                message={errors.accession_no}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <InputLabel
                                                htmlFor="authors"
                                                value="Authors"
                                            />
                                            <div className="mt-1">
                                                <SearchableMultiSelect
                                                    options={authors}
                                                    selectedIds={
                                                        data.author_ids
                                                    }
                                                    onChange={
                                                        handleAuthorsChange
                                                    }
                                                    placeholder="Search authors..."
                                                />
                                            </div>
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
                                                {categories.map((category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
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
                                                {publishers.map((publisher) => (
                                                    <option
                                                        key={publisher.id}
                                                        value={publisher.id}
                                                    >
                                                        {publisher.name}
                                                    </option>
                                                ))}
                                            </select>
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
                                                    Choose File
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
                                                        "No file chosen"}
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
                                    Add Catalog Item
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
