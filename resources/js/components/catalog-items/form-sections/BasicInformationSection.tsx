import { Plus } from "lucide-react";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import SearchableMultiSelect from "@/components/common/SearchableMultiSelect";
import { Category, Author } from "@/types";

interface BasicInformationSectionProps {
    data: {
        title: string;
        accession_no: string;
        type: string;
        category_id: string;
        author_ids: number[];
    };
    errors: {
        title?: string;
        accession_no?: string;
        type?: string;
        category_id?: string;
        author_ids?: string;
    };
    categories: Category[];
    authors: Author[];
    onDataChange: (field: string, value: any) => void;
    onClearErrors: (field: string) => void;
    onShowCategoryModal: () => void;
    onShowAuthorModal: () => void;
}

export default function BasicInformationSection({
    data,
    errors,
    categories,
    authors,
    onDataChange,
    onClearErrors,
    onShowCategoryModal,
    onShowAuthorModal,
}: BasicInformationSectionProps) {
    const handleAuthorsChange = (authorIds: number[]) => {
        onDataChange("author_ids", authorIds);
        onClearErrors("author_ids");
    };

    return (
        <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Basic Information
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Essential details about the catalog item
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="title" value="Title" required />
                    <TextInput
                        id="title"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.title}
                        onChange={(e) => {
                            onDataChange("title", e.target.value);
                            onClearErrors("title");
                        }}
                    />
                    <InputError message={errors.title} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="accession_no" value="Accession No." required />
                    <TextInput
                        id="accession_no"
                        type="text"
                        className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                        value={data.accession_no}
                        onChange={(e) => {
                            onDataChange("accession_no", e.target.value);
                            onClearErrors("accession_no");
                        }}
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Auto-generated unique 7-digit number (editable if needed)
                    </p>
                    <InputError message={errors.accession_no} className="mt-1" />
                </div>

                <div className="sm:col-span-2">
                    <InputLabel htmlFor="authors" value="Authors" />
                    <div className="mt-1">
                        <SearchableMultiSelect
                            options={authors}
                            selectedIds={data.author_ids}
                            onChange={handleAuthorsChange}
                            placeholder="Search authors..."
                        />
                    </div>
                    <button
                        type="button"
                        onClick={onShowAuthorModal}
                        className="mt-2 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        <Plus className="h-3 w-3" />
                        Author not listed? Click here to add.
                    </button>
                    <InputError message={errors.author_ids} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="type" value="Material Type" required />
                    <select
                        id="type"
                        value={data.type}
                        onChange={(e) => {
                            onDataChange("type", e.target.value);
                            onClearErrors("type");
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                        <option value="">Select Type</option>
                        <option value="Book">Book</option>
                        <option value="Thesis">Thesis</option>
                        <option value="Journal">Journal</option>
                        <option value="Magazine">Magazine</option>
                        <option value="Newspaper">Newspaper</option>
                        <option value="DVD">DVD</option>
                        <option value="CD">CD</option>
                        <option value="Other">Other</option>
                    </select>
                    <InputError message={errors.type} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="category_id" value="Category" />
                    <select
                        id="category_id"
                        value={data.category_id}
                        onChange={(e) => {
                            onDataChange("category_id", e.target.value);
                            onClearErrors("category_id");
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={onShowCategoryModal}
                        className="mt-2 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        <Plus className="h-3 w-3" />
                        Category not listed? Click here to add.
                    </button>
                    <InputError message={errors.category_id} className="mt-1" />
                </div>
            </div>
        </div>
    );
}
