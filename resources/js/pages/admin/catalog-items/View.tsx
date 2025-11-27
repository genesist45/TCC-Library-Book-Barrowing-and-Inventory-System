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
                            <div className="flex flex-col items-center gap-6">
                                {/* Top - Image */}
                                <div className="flex-shrink-0">
                                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                        {catalogItem.cover_image ? (
                                            <img
                                                src={`/storage/${catalogItem.cover_image}`}
                                                alt={catalogItem.title}
                                                className="h-48 w-auto object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-48 w-32 items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                <div className="text-center">
                                                    <div className="mb-2 text-4xl font-bold text-gray-300 dark:text-gray-600">N/A</div>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">No Cover Image</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom - Details */}
                                <div className="w-full max-w-4xl">
                                    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <div className="sm:col-span-2 lg:col-span-3">
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Title</label>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{catalogItem.title}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Accession No.</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{catalogItem.accession_no || '-'}</p>
                                        </div>

                                        {catalogItem.authors && catalogItem.authors.length > 0 && (
                                            <div className="sm:col-span-2 lg:col-span-3">
                                                <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Authors</label>
                                                <div className="mt-1 flex flex-wrap gap-2">
                                                    {catalogItem.authors.map((author) => (
                                                        <span
                                                            key={author.id}
                                                            className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-400/30"
                                                        >
                                                            {author.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Material Type</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{catalogItem.type}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {catalogItem.category?.name || '-'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Publication Details</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {catalogItem.publisher?.name || '-'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Year</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{catalogItem.year || '-'}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">ISBN</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{catalogItem.isbn || '-'}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">ISBN-13</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{catalogItem.isbn13 || '-'}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Call Number</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{catalogItem.call_no || '-'}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Subject</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{catalogItem.subject || '-'}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Series</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{catalogItem.series || '-'}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Edition</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{catalogItem.edition || '-'}</p>
                                        </div>

                                        {catalogItem.url && (
                                            <div className="sm:col-span-2 lg:col-span-3">
                                                <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">URL</label>
                                                <a
                                                    href={catalogItem.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block truncate text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    {catalogItem.url}
                                                </a>
                                            </div>
                                        )}

                                        {catalogItem.description && (
                                            <div className="sm:col-span-2 lg:col-span-3">
                                                <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{catalogItem.description}</p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</label>
                                            <p className="mt-1">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${catalogItem.is_active
                                                        ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/30'
                                                        : 'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-900/30 dark:text-gray-400 dark:ring-gray-500/30'
                                                    }`}>
                                                    {catalogItem.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Created At</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {new Date(catalogItem.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
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
