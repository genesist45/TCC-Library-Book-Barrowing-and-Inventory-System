import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import PublisherTable from '@/components/publishers/PublisherTable';
import PublisherPageHeader from '@/components/publishers/PublisherPageHeader';
import { toast } from 'sonner';
import Modal from '@/components/modals/Modal';
import PublisherForm from '@/components/publishers/PublisherForm';
import PublisherViewModal from '@/components/publishers/PublisherViewModal';
import PublisherDeleteModal from '@/components/publishers/PublisherDeleteModal';

interface Publisher {
    id: number;
    name: string;
    country: string;
    description?: string;
    is_published: boolean;
    items_count: number;
    created_at: string;
}

export default function Publishers() {
    const [publishers] = useState<Publisher[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formErrors, setFormErrors] = useState<any>({});
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [data, setData] = useState({
        name: '',
        country: '',
        description: '',
        is_published: true,
    });

    const openAddModal = () => {
        setData({
            name: '',
            country: '',
            description: '',
            is_published: true,
        });
        setFormErrors({});
        setShowAddModal(true);
    };

    const openEditModal = (publisher: Publisher) => {
        setSelectedPublisher(publisher);
        setFormErrors({});
        setData({
            name: publisher.name,
            country: publisher.country,
            description: publisher.description || '',
            is_published: publisher.is_published,
        });
        setShowEditModal(true);
    };

    const openViewModal = (publisher: Publisher) => {
        setSelectedPublisher(publisher);
        setShowViewModal(true);
    };

    const openDeleteModal = (publisher: Publisher) => {
        setSelectedPublisher(publisher);
        setShowDeleteModal(true);
    };

    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
        setShowDeleteModal(false);
        setSelectedPublisher(null);
        setData({
            name: '',
            country: '',
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
            toast.success('Publisher added successfully!');
        }, 1000);
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        setTimeout(() => {
            setProcessing(false);
            closeModals();
            toast.success('Publisher updated successfully!');
        }, 1000);
    };

    const submitDelete = () => {
        setProcessing(true);
        
        setTimeout(() => {
            setProcessing(false);
            closeModals();
            toast.success('Publisher deleted successfully!');
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

    const filteredPublishers = publishers.filter(publisher =>
        (publisher.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (publisher.country?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Publishers" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <PublisherPageHeader 
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        onAddPublisher={openAddModal}
                        onRefresh={handleRefresh}
                        isRefreshing={isRefreshing}
                    />

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <PublisherTable
                            publishers={filteredPublishers}
                            onView={openViewModal}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                            isLoading={isRefreshing}
                        />
                    </div>
                </div>
            </div>

            <Modal show={showAddModal} onClose={closeModals}>
                <PublisherForm
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
                <PublisherForm
                    mode="edit"
                    data={data}
                    errors={formErrors}
                    processing={processing}
                    onSubmit={submitEdit}
                    onChange={handleChange}
                    onCancel={closeModals}
                />
            </Modal>

            <PublisherViewModal show={showViewModal} publisher={selectedPublisher} onClose={closeModals} />

            <PublisherDeleteModal
                show={showDeleteModal}
                publisher={selectedPublisher}
                processing={processing}
                onConfirm={submitDelete}
                onCancel={closeModals}
            />
        </AuthenticatedLayout>
    );
}
