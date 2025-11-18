import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { Pencil } from 'lucide-react';
import { PageProps, CatalogItem } from '@/types';

interface Props extends PageProps {
    catalogItem: CatalogItem;
}

export default function CatalogItemView({ catalogItem }: Props) {
    const handleBack = () => {
        router.visit(route('admin.catalog-items.index'));
    };

    const handleEdit = () => {
        router.visit(route('admin.catalog-items.edit', catalogItem.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`View: ${catalogItem.title}`} />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="border-b border-gray-200 p-4 dark:border-[#3a3a3a] sm:p-6">
                            <h2 className="text-xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                Catalog Item Details
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400">
                                View complete information about this catalog item
                            </p>
                        </div>

                        <div className="p-4 sm:p-6">
                            <div className="space-y-6">
                                {catalogItem.cover_image && (
                                    <div className="flex justify-center">
                                        <img
                                            src={`/storage/${catalogItem.cover_image}`}
                                            alt={catalogItem.title}
                                            className="h-48 w-auto rounded-md border border-gray-300 object-cover dark:border-gray-700"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{catalogItem.title}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{catalogItem.type}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">
                                            {catalogItem.category?.name || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Publisher</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">
                                            {catalogItem.publisher?.name || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{catalogItem.year || '-'}</p>
                                    </div>

                                    {catalogItem.authors && catalogItem.authors.length > 0 && (
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Authors</label>
                                            <div className="mt-1.5 flex flex-wrap gap-2">
                                                {catalogItem.authors.map((author) => (
                                                    <span
                                                        key={author.id}
                                                        className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                                                    >
                                                        {author.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ISBN</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{catalogItem.isbn || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ISBN-13</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{catalogItem.isbn13 || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Call Number</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{catalogItem.call_no || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{catalogItem.subject || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Series</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{catalogItem.series || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Edition</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{catalogItem.edition || '-'}</p>
                                    </div>

                                    {catalogItem.url && (
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
                                            <a
                                                href={catalogItem.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1.5 text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                {catalogItem.url}
                                            </a>
                                        </div>
                                    )}

                                    {catalogItem.description && (
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                            <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{catalogItem.description}</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                        <p className="mt-1.5">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                catalogItem.is_active
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                            }`}>
                                                {catalogItem.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created At</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">
                                            {new Date(catalogItem.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-[#3a3a3a]">
                                <SecondaryButton onClick={handleBack}>Close</SecondaryButton>
                                <PrimaryButton onClick={handleEdit} className="flex items-center gap-2">
                                    <Pencil className="h-4 w-4" />
                                    Edit Item
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
