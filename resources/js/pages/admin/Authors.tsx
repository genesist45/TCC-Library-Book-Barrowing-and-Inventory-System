import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import AuthorTable from '@/components/authors/AuthorTable';
import AuthorPageHeader from '@/components/authors/AuthorPageHeader';
import { toast } from 'sonner';
import Modal from '@/components/modals/Modal';
import AuthorForm from '@/components/authors/AuthorForm';
import AuthorViewModal from '@/components/authors/AuthorViewModal';
import AuthorDeleteModal from '@/components/authors/AuthorDeleteModal';

interface Author {
    id: number;
    name: string;
    country: string;
    bio?: string;
    is_published: boolean;
    items_count: number;
    created_at: string;
}

export default function Authors() {
    const [authors] = useState<Author[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formErrors, setFormErrors] = useState<any>({});
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [data, setData] = useState({
        name: '',
        country: '',
        bio: '',
        is_published: true,
    });

    const openAddModal = () => {
        setData({
            name: '',
            country: '',
            bio: '',
            is_published: true,
        });
        setFormErrors({});
        setShowAddModal(true);
    };

    const openEditModal = (author: Author) => {
        setSelectedAuthor(author);
        setFormErrors({});
        setData({
            name: author.name,
            country: author.country,
            bio: author.bio || '',
            is_published: author.is_published,
        });
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
        setData({
            name: '',
            country: '',
            bio: '',
            is_published: true,
        });
    };

    const submitAdd: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        setTimeout(() => {
            setProcessing(false);
            closeModals();
            toast.success('Author added successfully!');
        }, 1000);
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        setTimeout(() => {
            setProcessing(false);
            closeModals();
            toast.success('Author updated successfully!');
        }, 1000);
    };

    const submitDelete = () => {
        setProcessing(true);
        
        setTimeout(() => {
            setProcessing(false);
            closeModals();
            toast.success('Author deleted successfully!');
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
                    data={data}
                    errors={formErrors}
                    processing={processing}
                    onSubmit={submitAdd}
                    onChange={handleChange}
                    onCancel={closeModals}
                />
            </Modal>

            <Modal show={showEditModal} onClose={closeModals}>
                <AuthorForm
                    mode="edit"
                    data={data}
                    errors={formErrors}
                    processing={processing}
                    onSubmit={submitEdit}
                    onChange={handleChange}
                    onCancel={closeModals}
                />
            </Modal>

            <AuthorViewModal show={showViewModal} author={selectedAuthor} onClose={closeModals} />

            <AuthorDeleteModal
                show={showDeleteModal}
                author={selectedAuthor}
                processing={processing}
                onConfirm={submitDelete}
                onCancel={closeModals}
            />
        </AuthenticatedLayout>
    );
}
