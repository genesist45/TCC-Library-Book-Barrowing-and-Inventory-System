import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { Pencil } from 'lucide-react';
import { PageProps, CatalogItem } from '@/types';
import RelatedCopiesTable from '@/components/catalog-items/RelatedCopiesTable';
import { CoverImageDisplay, CatalogItemDetailsGrid } from '@/components/catalog-items/view-sections';

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

    const handleRefresh = () => {
        router.reload({ only: ['catalogItem'] });
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
                                <CoverImageDisplay
                                    coverImage={catalogItem.cover_image}
                                    title={catalogItem.title}
                                />

                                <div className="w-full max-w-4xl">
                                    <CatalogItemDetailsGrid catalogItem={catalogItem} />
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-8 dark:border-[#3a3a3a]">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                    Related Copies
                                </h3>
                                <RelatedCopiesTable
                                    copies={catalogItem.copies || []}
                                    onRefresh={handleRefresh}
                                />
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
