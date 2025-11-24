import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthorTable from '@/components/authors/AuthorTable';
import AuthorPageHeader from '@/components/authors/AuthorPageHeader';
import { toast } from 'react-toastify';
import Modal from '@/components/modals/Modal';
import AuthorForm from '@/components/authors/AuthorForm';
import AuthorViewModal from '@/components/authors/AuthorViewModal';
import AuthorDeleteModal from '@/components/authors/AuthorDeleteModal';
import { PageProps as InertiaPageProps } from '@/types';

interface Author {
    id: number;
    name: string;
    country: string;
    bio?: string;
    is_published: boolean;
    items_count: number;
    created_at: string;
}

interface PageProps extends InertiaPageProps {
    authors: Author[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Authors() {
    const { authors, flash } = usePage<PageProps>().props;
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const openAddModal = () => {
        setSelectedAuthor(null);
        setShowAddModal(true);
    };

    const openEditModal = (author: Author) => {
        setSelectedAuthor(author);
        setShowEditModal(true);
    };

    const openViewModal = (author: Author) => {
        setSelectedAuthor(author);
        setShowViewModal(true);
    };

    const openDeleteModal = (author: Author) => {
        setSelectedAuthor(author);
        setShowDeleteModal(true);
    };

    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
        setShowDeleteModal(false);
        setSelectedAuthor(null);
    };

    const handleFormSuccess = () => {
        closeModals();
    };

    const handleDelete = () => {
        if (!selectedAuthor) return;

        setIsDeleting(true);
        router.delete(route('admin.authors.destroy', selectedAuthor.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Author deleted successfully!');
                closeModals();
                setIsDeleting(false);
            },
            onError: () => {
                toast.error('Failed to delete author');
                setIsDeleting(false);
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

    const filteredAuthors = authors.filter(author =>
        (author.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (author.country?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Authors" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <AuthorPageHeader
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        onAddAuthor={openAddModal}
                        onRefresh={handleRefresh}
                        isRefreshing={isRefreshing}
                    />

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <AuthorTable
                            authors={filteredAuthors}
                            onView={openViewModal}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                            isLoading={isRefreshing}
                        />
                    </div>
                </div>
            </div>

            <Modal show={showAddModal} onClose={closeModals}>
                <AuthorForm
                    mode="add"
                    onCancel={closeModals}
                    onSuccess={handleFormSuccess}
                />
            </Modal>

            <Modal show={showEditModal} onClose={closeModals}>
                <AuthorForm
                    mode="edit"
                    author={selectedAuthor}
                    onCancel={closeModals}
                    onSuccess={handleFormSuccess}
                />
            </Modal>

            <AuthorViewModal show={showViewModal} author={selectedAuthor} onClose={closeModals} />

            <AuthorDeleteModal
                show={showDeleteModal}
                author={selectedAuthor}
                processing={isDeleting}
                onConfirm={handleDelete}
                onCancel={closeModals}
            />
        </AuthenticatedLayout>
    );
}
