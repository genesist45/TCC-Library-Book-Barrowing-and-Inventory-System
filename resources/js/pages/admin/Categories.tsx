import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import CategoryTable from '@/components/categories/CategoryTable';
import CategoryPageHeader from '@/components/categories/CategoryPageHeader';
import { toast } from 'sonner';
import Modal from '@/components/modals/Modal';
import CategoryForm from '@/components/categories/CategoryForm';
import CategoryViewModal from '@/components/categories/CategoryViewModal';
import CategoryDeleteModal from '@/components/categories/CategoryDeleteModal';
import { PageProps as InertiaPageProps } from '@/types';

interface Category {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    is_published: boolean;
    items_count: number;
    created_at: string;
}

interface PageProps extends InertiaPageProps {
    categories: Category[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Categories() {
    const { categories, flash } = usePage<PageProps>().props;
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setShowEditModal(true);
    };

    const openViewModal = (category: Category) => {
        setSelectedCategory(category);
        setShowViewModal(true);
    };

    const openDeleteModal = (category: Category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
        setShowDeleteModal(false);
        setSelectedCategory(null);
    };

    const handleFormSuccess = (action: 'created' | 'updated') => {
        closeModals();
        const message = action === 'created' ? 'Category created successfully!' : 'Category updated successfully!';
        toast.success(message);
    };

    const submitDelete = () => {
        if (!selectedCategory) return;

        setProcessing(true);
        router.delete(route('admin.categories.destroy', selectedCategory.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModals();
                toast.success('Category deleted successfully!');
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            preserveUrl: true,
            onFinish: () => {
                setIsRefreshing(false);
            },
        });
    };

    const filteredCategories = categories.filter(category =>
        (category.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (category.slug?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Categories" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <CategoryPageHeader
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        onAddCategory={openAddModal}
                        onRefresh={handleRefresh}
                        isRefreshing={isRefreshing}
                    />

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <CategoryTable
                            categories={filteredCategories}
                            onView={openViewModal}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                            isLoading={isRefreshing}
                        />
                    </div>
                </div>
            </div>

            <Modal show={showAddModal} onClose={closeModals}>
                <CategoryForm
                    mode="add"
                    onCancel={closeModals}
                />
            </Modal>

            <Modal show={showEditModal} onClose={closeModals}>
                <CategoryForm
                    mode="edit"
                    category={selectedCategory}
                    onCancel={closeModals}
                />
            </Modal>

            <CategoryViewModal show={showViewModal} category={selectedCategory} onClose={closeModals} />

            <CategoryDeleteModal
                show={showDeleteModal}
                category={selectedCategory}
                processing={processing}
                onConfirm={submitDelete}
                onCancel={closeModals}
            />
        </AuthenticatedLayout>
    );
}
