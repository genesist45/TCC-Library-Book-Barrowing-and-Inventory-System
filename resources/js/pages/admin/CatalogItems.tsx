import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import CatalogItemTable from '@/components/catalog-items/CatalogItemTable';
import CatalogItemPageHeader from '@/components/catalog-items/CatalogItemPageHeader';
import CatalogItemDeleteModal from '@/components/catalog-items/CatalogItemDeleteModal';
import { toast } from 'sonner';
import { PageProps, CatalogItem } from '@/types';

interface Props extends PageProps {
    catalogItems: CatalogItem[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function CatalogItems({ catalogItems, flash }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleAddItem = () => {
        router.visit(route('admin.catalog-items.create'));
    };

    const handleViewItem = (item: CatalogItem) => {
        router.visit(route('admin.catalog-items.show', item.id));
    };

    const handleEditItem = (item: CatalogItem) => {
        router.visit(route('admin.catalog-items.edit', item.id));
    };

    const handleDeleteItem = (item: CatalogItem) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedItem) return;

        setProcessing(true);
        router.delete(route('admin.catalog-items.destroy', selectedItem.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedItem(null);
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
                toast.error('Failed to delete catalog item');
            },
        });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => {
                setIsRefreshing(false);
            },
        });
    };

    const closeModal = () => {
        setShowDeleteModal(false);
        setSelectedItem(null);
    };

    const filteredItems = catalogItems.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (item.title?.toLowerCase() || '').includes(searchLower) ||
            (item.type?.toLowerCase() || '').includes(searchLower) ||
            (item.category?.name?.toLowerCase() || '').includes(searchLower) ||
            (item.publisher?.name?.toLowerCase() || '').includes(searchLower) ||
            (item.isbn?.toLowerCase() || '').includes(searchLower) ||
            (item.isbn13?.toLowerCase() || '').includes(searchLower)
        );
    });

    return (
        <AuthenticatedLayout>
            <Head title="Catalog Items" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <CatalogItemPageHeader 
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        onAddItem={handleAddItem}
                        onRefresh={handleRefresh}
                        isRefreshing={isRefreshing}
                    />

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <CatalogItemTable
                            items={filteredItems}
                            onView={handleViewItem}
                            onEdit={handleEditItem}
                            onDelete={handleDeleteItem}
                            isLoading={isRefreshing}
                        />
                    </div>
                </div>
            </div>

            <CatalogItemDeleteModal
                show={showDeleteModal}
                item={selectedItem}
                processing={processing}
                onConfirm={confirmDelete}
                onCancel={closeModal}
            />
        </AuthenticatedLayout>
    );
}
