import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import CategoryTable from '@/components/categories/CategoryTable';
import CategoryPageHeader from '@/components/categories/CategoryPageHeader';
import { toast } from 'sonner';
import Modal from '@/components/modals/Modal';
import CategoryForm from '@/components/categories/CategoryForm';
import CategoryViewModal from '@/components/categories/CategoryViewModal';
import CategoryDeleteModal from '@/components/categories/CategoryDeleteModal';

interface Category {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    is_published: boolean;
    items_count: number;
    created_at: string;
}

export default function Categories() {
    const [categories] = useState<Category[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formErrors, setFormErrors] = useState<any>({});
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [data, setData] = useState({
        name: '',
        slug: '',
        description: '',
        is_published: true,
    });

    const openAddModal = () => {
        setData({
            name: '',
            slug: '',
            description: '',
            is_published: true,
        });
        setFormErrors({});
        setShowAddModal(true);
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setFormErrors({});
        setData({
            name: category.name,
            slug: category.slug || '',
            description: category.description || '',
            is_published: category.is_published,
        });
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
        setData({
            name: '',
            slug: '',
            description: '',
            is_published: true,
        });
    };

    const submitAdd: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        setTimeout(() => {
            setProcessing(false);
            closeModals();
            toast.success('Category added successfully!');
        }, 1000);
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        setTimeout(() => {
            setProcessing(false);
            closeModals();
            toast.success('Category updated successfully!');
        }, 1000);
    };

    const submitDelete = () => {
        setProcessing(true);
        
        setTimeout(() => {
            setProcessing(false);
            closeModals();
            toast.success('Category deleted successfully!');
        }, 1000);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 500);
    };

    const handleChange = (field: string, value: string | boolean) => {
        setData({ ...data, [field]: value });
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
                    data={data}
                    errors={formErrors}
                    processing={processing}
                    onSubmit={submitAdd}
                    onChange={handleChange}
                    onCancel={closeModals}
                />
            </Modal>

            <Modal show={showEditModal} onClose={closeModals}>
                <CategoryForm
                    mode="edit"
                    data={data}
                    errors={formErrors}
                    processing={processing}
                    onSubmit={submitEdit}
                    onChange={handleChange}
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
