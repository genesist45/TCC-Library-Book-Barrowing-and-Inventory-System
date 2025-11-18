import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import InputLabel from '@/components/forms/InputLabel';
import TextInput from '@/components/forms/TextInput';
import InputError from '@/components/forms/InputError';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { Upload, X } from 'lucide-react';
import { PageProps, Category, Publisher, Author } from '@/types';

interface Props extends PageProps {
    categories: Category[];
    publishers: Publisher[];
    authors: Author[];
}

export default function CatalogItemAdd({ categories, publishers, authors }: Props) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        title: '',
        type: '',
        category_id: '',
        publisher_id: '',
        author_ids: [] as number[],
        isbn: '',
        isbn13: '',
        call_no: '',
        subject: '',
        series: '',
        edition: '',
        year: '',
        url: '',
        description: '',
        cover_image: null as File | null,
        is_active: true,
    });

    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [coverImageName, setCoverImageName] = useState<string>('');

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.catalog-items.store'), {
            forceFormData: true,
        });
    };

    const handleCancel = () => {
        router.visit(route('admin.catalog-items.index'));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover_image', file);
            setCoverImageName(file.name);
            clearErrors('cover_image');

            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setData('cover_image', null);
        setCoverImageName('');
        setCoverImagePreview(null);
    };

    const handleAuthorToggle = (authorId: number) => {
        const currentAuthors = [...data.author_ids];
        const index = currentAuthors.indexOf(authorId);
        
        if (index > -1) {
            currentAuthors.splice(index, 1);
        } else {
            currentAuthors.push(authorId);
        }
        
        setData('author_ids', currentAuthors);
        clearErrors('author_ids');
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
                                Fill in the information below to create a new catalog item
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="title" value="Title" required />
                                        <TextInput
                                            id="title"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.title}
                                            onChange={(e) => {
                                                setData('title', e.target.value);
                                                clearErrors('title');
                                            }}
                                        />
                                        <InputError message={errors.title} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="type" value="Type" required />
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => {
                                                setData('type', e.target.value);
                                                clearErrors('type');
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
                                                setData('category_id', e.target.value);
                                                clearErrors('category_id');
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
                                        <InputError message={errors.category_id} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="publisher_id" value="Publisher" />
                                        <select
                                            id="publisher_id"
                                            value={data.publisher_id}
                                            onChange={(e) => {
                                                setData('publisher_id', e.target.value);
                                                clearErrors('publisher_id');
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                        >
                                            <option value="">Select Publisher</option>
                                            {publishers.map((publisher) => (
                                                <option key={publisher.id} value={publisher.id}>
                                                    {publisher.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.publisher_id} className="mt-1" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="authors" value="Authors" />
                                        <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                                            {authors.length === 0 ? (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">No authors available</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {authors.map((author) => (
                                                        <label
                                                            key={author.id}
                                                            className="flex items-center space-x-2 cursor-pointer"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={data.author_ids.includes(author.id)}
                                                                onChange={() => handleAuthorToggle(author.id)}
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900"
                                                            />
                                                            <span className="text-sm text-gray-900 dark:text-gray-100">
                                                                {author.name}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <InputError message={errors.author_ids} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="year" value="Year" />
                                        <TextInput
                                            id="year"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.year}
                                            onChange={(e) => {
                                                setData('year', e.target.value);
                                                clearErrors('year');
                                            }}
                                            placeholder="e.g., 2024"
                                        />
                                        <InputError message={errors.year} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="isbn" value="ISBN" />
                                        <TextInput
                                            id="isbn"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.isbn}
                                            onChange={(e) => {
                                                setData('isbn', e.target.value);
                                                clearErrors('isbn');
                                            }}
                                        />
                                        <InputError message={errors.isbn} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="isbn13" value="ISBN-13" />
                                        <TextInput
                                            id="isbn13"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.isbn13}
                                            onChange={(e) => {
                                                setData('isbn13', e.target.value);
                                                clearErrors('isbn13');
                                            }}
                                        />
                                        <InputError message={errors.isbn13} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="call_no" value="Call Number" />
                                        <TextInput
                                            id="call_no"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.call_no}
                                            onChange={(e) => {
                                                setData('call_no', e.target.value);
                                                clearErrors('call_no');
                                            }}
                                        />
                                        <InputError message={errors.call_no} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="subject" value="Subject" />
                                        <TextInput
                                            id="subject"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.subject}
                                            onChange={(e) => {
                                                setData('subject', e.target.value);
                                                clearErrors('subject');
                                            }}
                                        />
                                        <InputError message={errors.subject} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="series" value="Series" />
                                        <TextInput
                                            id="series"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.series}
                                            onChange={(e) => {
                                                setData('series', e.target.value);
                                                clearErrors('series');
                                            }}
                                        />
                                        <InputError message={errors.series} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="edition" value="Edition" />
                                        <TextInput
                                            id="edition"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.edition}
                                            onChange={(e) => {
                                                setData('edition', e.target.value);
                                                clearErrors('edition');
                                            }}
                                        />
                                        <InputError message={errors.edition} className="mt-1" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="url" value="URL" />
                                        <TextInput
                                            id="url"
                                            type="url"
                                            className="mt-1 block w-full"
                                            value={data.url}
                                            onChange={(e) => {
                                                setData('url', e.target.value);
                                                clearErrors('url');
                                            }}
                                            placeholder="https://..."
                                        />
                                        <InputError message={errors.url} className="mt-1" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="description" value="Description" />
                                        <textarea
                                            id="description"
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                            value={data.description}
                                            onChange={(e) => {
                                                setData('description', e.target.value);
                                                clearErrors('description');
                                            }}
                                            placeholder="Brief description of this item..."
                                        />
                                        <InputError message={errors.description} className="mt-1" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="cover_image" value="Cover Image" />
                                        <div className="mt-1 flex items-center gap-4">
                                            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                                <Upload className="h-4 w-4" />
                                                Choose File
                                                <input
                                                    type="file"
                                                    id="cover_image"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {coverImageName || 'No file chosen'}
                                            </span>
                                            {coverImageName && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                        {coverImagePreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={coverImagePreview}
                                                    alt="Cover preview"
                                                    className="h-32 w-auto rounded-md border border-gray-300 dark:border-gray-700"
                                                />
                                            </div>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Recommended: JPG, PNG (Max 2MB)</p>
                                        <InputError message={errors.cover_image} className="mt-1" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <InputLabel htmlFor="is_active" value="Status" />
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Make this item available in the catalog</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setData('is_active', !data.is_active)}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                                    data.is_active ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                                                }`}
                                                role="switch"
                                                aria-checked={data.is_active}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                        data.is_active ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                        <div className="mt-2">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                data.is_active
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                            }`}>
                                                {data.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-[#3a3a3a]">
                                <SecondaryButton type="button" onClick={handleCancel}>
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
