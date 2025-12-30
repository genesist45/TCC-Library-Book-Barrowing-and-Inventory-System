import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '@/components/modals/Modal';
import BookReturnTable from '../Components/BookReturnTable';
import BookReturnPageHeader from '../Components/BookReturnPageHeader';
import BookReturnForm from '../Components/BookReturnForm';
import BookReturnViewModal from '../Components/BookReturnViewModal';
import BookReturnDeleteModal from '../Components/BookReturnDeleteModal';
import { PageProps as InertiaPageProps, BookReturn } from '@/types';

interface PageProps extends InertiaPageProps {
    bookReturns: BookReturn[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Index() {
    const { bookReturns, flash } = usePage<PageProps>().props;
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState<BookReturn | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter states
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const openAddModal = () => {
        setSelectedReturn(null);
        setShowAddModal(true);
    };

    const openEditModal = (bookReturn: BookReturn) => {
        setSelectedReturn(bookReturn);
        setShowEditModal(true);
    };

    const openViewModal = (bookReturn: BookReturn) => {
        setSelectedReturn(bookReturn);
        setShowViewModal(true);
    };

    const openDeleteModal = (bookReturn: BookReturn) => {
        setSelectedReturn(bookReturn);
        setShowDeleteModal(true);
    };

    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
        setShowDeleteModal(false);
        setSelectedReturn(null);
    };

    const handleFormSuccess = () => {
        closeModals();
    };

    const submitDelete = () => {
        if (!selectedReturn) return;

        setIsDeleting(true);
        router.delete(route('admin.book-returns.destroy', selectedReturn.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModals();
                toast.success('Book return deleted successfully!');
                setIsDeleting(false);
            },
            onError: () => {
                toast.error('Failed to delete book return');
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

    const filteredReturns = bookReturns.filter(bookReturn => {
        const matchesSearch = (bookReturn.member?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (bookReturn.catalog_item?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (bookReturn.status?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            bookReturn.id.toString().includes(searchTerm);

        const matchesStatus = !selectedStatus || bookReturn.status === selectedStatus;

        // Period filter logic
        let matchesPeriod = true;
        if (selectedPeriod) {
            const returnDate = new Date(bookReturn.return_date);
            const now = new Date();

            if (selectedPeriod === 'today') {
                matchesPeriod = returnDate.toDateString() === now.toDateString();
            } else if (selectedPeriod === 'week') {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                matchesPeriod = returnDate >= startOfWeek;
            } else if (selectedPeriod === 'month') {
                matchesPeriod = returnDate.getMonth() === now.getMonth() && returnDate.getFullYear() === now.getFullYear();
            } else if (selectedPeriod === 'year') {
                matchesPeriod = returnDate.getFullYear() === now.getFullYear();
            }
        }

        return matchesSearch && matchesStatus && matchesPeriod;
    });

    return (
        <AuthenticatedLayout>
            <Head title="Book Records" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <BookReturnPageHeader
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        onAddReturn={openAddModal}
                        onRefresh={handleRefresh}
                        isRefreshing={isRefreshing}
                        selectedStatus={selectedStatus}
                        selectedPeriod={selectedPeriod}
                        onStatusChange={setSelectedStatus}
                        onPeriodChange={setSelectedPeriod}
                    />

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <BookReturnTable
                            bookReturns={filteredReturns}
                            onView={openViewModal}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                            isLoading={isRefreshing}
                        />
                    </div>
                </div>
            </div>

            <Modal show={showAddModal} onClose={closeModals} maxWidth="xl">
                <BookReturnForm
                    mode="add"
                    onCancel={closeModals}
                    onSuccess={handleFormSuccess}
                />
            </Modal>

            <Modal show={showEditModal} onClose={closeModals} maxWidth="xl">
                <BookReturnForm
                    mode="edit"
                    bookReturn={selectedReturn}
                    onCancel={closeModals}
                    onSuccess={handleFormSuccess}
                />
            </Modal>

            <BookReturnViewModal show={showViewModal} bookReturn={selectedReturn} onClose={closeModals} />

            <BookReturnDeleteModal
                show={showDeleteModal}
                bookReturn={selectedReturn}
                processing={isDeleting}
                onConfirm={submitDelete}
                onCancel={closeModals}
            />
        </AuthenticatedLayout>
    );
}
