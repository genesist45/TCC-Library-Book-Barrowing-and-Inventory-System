import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import InputLabel from '@/components/forms/InputLabel';
import TextInput from '@/components/forms/TextInput';
import InputError from '@/components/forms/InputError';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface CatalogItem {
    id: number;
    title: string;
    type: string;
    category?: string;
    publisher?: string;
    isbn?: string;
    isbn13?: string;
    call_no?: string;
    subject?: string;
    series?: string;
    edition?: string;
    year?: string;
    url?: string;
    description?: string;
    is_active: boolean;
}

export default function CatalogItemEdit({ item }: { item?: CatalogItem }) {
    const [processing, setProcessing] = useState(false);
    const [data, setData] = useState({
        title: item?.title || 'Sample Book Title',
        type: item?.type || 'Book',
        category: item?.category || '',
        publisher: item?.publisher || '',
        isbn: item?.isbn || '',
        isbn13: item?.isbn13 || '',
        call_no: item?.call_no || '',
        subject: item?.subject || '',
        series: item?.series || '',
        edition: item?.edition || '',
        year: item?.year || '',
        url: item?.url || '',
        description: item?.description || '',
        is_active: item?.is_active ?? true,
    });

    const [errors] = useState<any>({});

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);

        setTimeout(() => {
            setProcessing(false);
            toast.success('Catalog item updated successfully!');
            router.visit('/catalog-items');
        }, 1000);
    };

    const handleCancel = () => {
        router.visit('/catalog-items');
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit: ${data.title}`} />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-4">
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Catalog Items
                        </button>
                    </div>

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
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="title" value="Title" required />
                                        <TextInput
                                            id="title"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.title}
                                            onChange={(e) => setData({ ...data, title: e.target.value })}
                                        />
                                        <InputError message={errors.title} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="type" value="Type" required />
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => setData({ ...data, type: e.target.value })}
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
                                        <InputLabel htmlFor="category" value="Category" />
                                        <select
                                            id="category"
                                            value={data.category}
                                            onChange={(e) => setData({ ...data, category: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                        >
                                            <option value="">Select Category</option>
                                        </select>
                                        <InputError message={errors.category} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="publisher" value="Publisher" />
                                        <select
                                            id="publisher"
                                            value={data.publisher}
                                            onChange={(e) => setData({ ...data, publisher: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                        >
                                            <option value="">Select Publisher</option>
                                        </select>
                                        <InputError message={errors.publisher} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="year" value="Year" />
                                        <TextInput
                                            id="year"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.year}
                                            onChange={(e) => setData({ ...data, year: e.target.value })}
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
                                            onChange={(e) => setData({ ...data, isbn: e.target.value })}
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
                                            onChange={(e) => setData({ ...data, isbn13: e.target.value })}
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
                                            onChange={(e) => setData({ ...data, call_no: e.target.value })}
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
                                            onChange={(e) => setData({ ...data, subject: e.target.value })}
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
                                            onChange={(e) => setData({ ...data, series: e.target.value })}
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
                                            onChange={(e) => setData({ ...data, edition: e.target.value })}
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
                                            onChange={(e) => setData({ ...data, url: e.target.value })}
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
                                            onChange={(e) => setData({ ...data, description: e.target.value })}
                                            placeholder="Brief description of this item..."
                                        />
                                        <InputError message={errors.description} className="mt-1" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="cover_image" value="Cover Image" />
                                        <div className="mt-1 flex items-center gap-4">
                                            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                                <Upload className="h-4 w-4" />
                                                Change File
                                                <input
                                                    type="file"
                                                    id="cover_image"
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                            </label>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">No new file chosen</span>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Recommended: JPG, PNG (Max 2MB)</p>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <InputLabel htmlFor="is_active" value="Status" />
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Make this item available in the catalog</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setData({ ...data, is_active: !data.is_active })}
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
                                    Update Catalog Item
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
