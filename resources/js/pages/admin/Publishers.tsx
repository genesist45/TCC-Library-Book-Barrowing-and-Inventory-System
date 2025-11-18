import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
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

interface PageProps {
    publishers: Publisher[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Publishers() {
    const { publishers, flash } = usePage<PageProps>().props;
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
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

    const openEditModal = (publisher: Publisher) => {
        setSelectedPublisher(publisher);
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
    };

    const submitDelete = () => {
        if (!selectedPublisher) return;

        setProcessing(true);
        router.delete(route('admin.publishers.destroy', selectedPublisher.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModals();
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
            preserveScroll: true,
            onFinish: () => {
                setIsRefreshing(false);
            },
        });
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
                    onCancel={closeModals}
                />
            </Modal>

            <Modal show={showEditModal} onClose={closeModals}>
                <PublisherForm
                    mode="edit"
                    publisher={selectedPublisher}
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
