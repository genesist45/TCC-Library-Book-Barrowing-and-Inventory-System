import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { Pencil } from 'lucide-react';

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
    cover_image?: string;
    created_at: string;
}

export default function CatalogItemView({ item }: { item?: CatalogItem }) {
    const displayItem: CatalogItem = item || {
        id: 1,
        title: 'Sample Catalog Item',
        type: 'Book',
        category: 'Science',
        publisher: 'Sample Publisher',
        isbn: '978-0-00-000000-0',
        isbn13: '978-0-00-000000-0',
        call_no: 'SCI-001',
        subject: 'General Science',
        series: 'Science Series Vol. 1',
        edition: '1st Edition',
        year: '2024',
        url: 'https://example.com',
        description: 'This is a sample catalog item for demonstration purposes.',
        is_active: true,
        created_at: new Date().toISOString(),
    };

    const handleBack = () => {
        router.visit('/catalog-items');
    };

    const handleEdit = () => {
        router.visit(`/catalog-items/${displayItem.id}/edit`);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`View: ${displayItem.title}`} />

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
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{displayItem.title}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{displayItem.type}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{displayItem.category || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Publisher</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{displayItem.publisher || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{displayItem.year || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ISBN</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{displayItem.isbn || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ISBN-13</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{displayItem.isbn13 || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Call Number</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{displayItem.call_no || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{displayItem.subject || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Series</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{displayItem.series || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Edition</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{displayItem.edition || '-'}</p>
                                    </div>

                                    {displayItem.url && (
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
                                            <a
                                                href={displayItem.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1.5 text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                {displayItem.url}
                                            </a>
                                        </div>
                                    )}

                                    {displayItem.description && (
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                            <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">{displayItem.description}</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                        <p className="mt-1.5">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                displayItem.is_active
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                            }`}>
                                                {displayItem.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created At</label>
                                        <p className="mt-1.5 text-sm text-gray-900 dark:text-gray-100">
                                            {new Date(displayItem.created_at).toLocaleString()}
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
