import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps, BookRequest } from '@/types';
import { useState, useEffect } from 'react';
import { Pencil, Trash2, CheckCircle, XCircle, Eye, Search, RefreshCw, Printer, UserPlus } from 'lucide-react';
import { TableRowSkeleton } from '@/components/common/Loading';
import { toast } from 'react-toastify';
import ActionButton, { ActionButtonGroup } from '@/components/buttons/ActionButton';
import ConfirmModal from '@/components/modals/ConfirmModal';
import AddBorrowMemberModal, { CatalogItemFull } from '@/components/circulations/AddBorrowMemberModal';

interface Props extends PageProps {
    bookRequests: BookRequest[];
    catalogItems: CatalogItemFull[];
    flash?: {
        success?: string;
        error?: string;
    };
}

type ModalAction = 'approve' | 'disapprove' | 'delete' | null;

export default function BookRequestsView({ bookRequests, catalogItems, flash }: Props) {
    const [selectedRequest, setSelectedRequest] = useState<BookRequest | null>(null);
    const [modalAction, setModalAction] = useState<ModalAction>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [showAddBorrowModal, setShowAddBorrowModal] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Filter book requests based on search query
    const filteredRequests = bookRequests.filter((request) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            request.full_name.toLowerCase().includes(searchLower) ||
            request.email.toLowerCase().includes(searchLower) ||
            (request.catalogItem?.title || request.catalog_item?.title || '').toLowerCase().includes(searchLower) ||
            request.status.toLowerCase().includes(searchLower) ||
            request.id.toString().includes(searchLower) ||
            (request.member?.member_no || '').toLowerCase().includes(searchLower) ||
            (request.member_id?.toString() || '').includes(searchLower)
        );
    });

    const handleRefresh = () => {
        setIsLoading(true);
        router.reload({
            only: ['bookRequests'],
            onFinish: () => setIsLoading(false),
        });
    };

    const handlePrint = () => {
        window.print();
    };

    // Open confirmation modal
    const openModal = (action: ModalAction, request: BookRequest) => {
        setSelectedRequest(request);
        setModalAction(action);
    };

    const closeModal = () => {
        setSelectedRequest(null);
        setModalAction(null);
        setProcessing(false);
    };

    // Confirm actions
    const confirmAction = () => {
        if (!selectedRequest) return;

        setProcessing(true);

        switch (modalAction) {
            case 'approve':
                router.post(route('admin.book-requests.approve', selectedRequest.id), {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        closeModal();
                    },
                    onError: () => {
                        toast.error('Failed to approve request');
                        setProcessing(false);
                    },
                });
                break;

            case 'disapprove':
                router.post(route('admin.book-requests.disapprove', selectedRequest.id), {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        closeModal();
                    },
                    onError: () => {
                        toast.error('Failed to disapprove request');
                        setProcessing(false);
                    },
                });
                break;

            case 'delete':
                router.delete(route('admin.book-requests.destroy', selectedRequest.id), {
                    onSuccess: () => {
                        closeModal();
                    },
                    onError: () => {
                        toast.error('Failed to delete book request');
                        setProcessing(false);
                    },
                });
                break;
        }
    };

    const getModalConfig = () => {
        switch (modalAction) {
            case 'approve':
                return {
                    title: 'Approve Request',
                    message: `Are you sure you want to approve the book request from "${selectedRequest?.full_name}"?`,
                    confirmText: 'Yes, Approve',
                    variant: 'primary' as const,
                };
            case 'disapprove':
                return {
                    title: 'Disapprove Request',
                    message: `Are you sure you want to disapprove the book request from "${selectedRequest?.full_name}"?`,
                    confirmText: 'Yes, Disapprove',
                    variant: 'danger' as const,
                };
            case 'delete':
                return {
                    title: 'Delete Request',
                    message: `Are you sure you want to delete the book request from "${selectedRequest?.full_name}"? This action cannot be undone.`,
                    confirmText: 'Yes, Delete',
                    variant: 'danger' as const,
                };
            default:
                return {
                    title: '',
                    message: '',
                    confirmText: 'Confirm',
                    variant: 'primary' as const,
                };
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            Approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            Disapproved: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    };

    const modalConfig = getModalConfig();

    return (
        <AuthenticatedLayout>
            <Head title="Book Requests" />
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @media print {
                    @page { size: legal portrait; margin: 1cm; }
                    nav, aside { display: none !important; }
                    main { margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: none !important; }
                    .p-4, .sm\\:p-6, .sm\\:px-6, .lg\\:px-8 { padding: 0 !important; }
                    body { background: white !important; }
                    .shadow-sm, .rounded-lg { box-shadow: none !important; border-radius: 0 !important; }
                    .border { border: none !important; }
                    .overflow-hidden, .overflow-x-auto { overflow: visible !important; }
                    table { width: 100% !important; table-layout: fixed !important; }
                    td, th { 
                        padding: 3px !important; 
                        font-size: 9px !important; 
                        white-space: normal !important; 
                        word-wrap: break-word !important;
                        border: 1px solid #e5e7eb !important;
                        overflow-wrap: break-word;
                    }
                }
            `}</style>

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 transition-colors duration-300 dark:text-gray-100 print:hidden">
                                Book Requests
                            </h2>
                            <h2 className="hidden text-2xl font-bold text-gray-900 print:block">
                                Borrow Request Report
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400 print:hidden">
                                Manage all book borrow requests from members
                            </p>
                            <p className="mt-1 hidden text-sm text-gray-600 print:block">
                                Summary of all book borrowing requests from members
                            </p>
                        </div>

                        <div className="flex items-center gap-3 print:hidden">
                            {/* Search Bar */}
                            <div className="relative w-full sm:w-64">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    value={searchQuery}
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={handleRefresh}
                                className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-gray-200 dark:hover:bg-[#4a4a4a]"
                                title="Refresh list"
                            >
                                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>

                            {/* Print Button */}
                            <button
                                onClick={handlePrint}
                                className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-gray-200 dark:hover:bg-[#4a4a4a]"
                                title="Print list"
                            >
                                <Printer className="h-5 w-5" />
                            </button>

                            {/* Add Borrow Member Button */}
                            <button
                                onClick={() => setShowAddBorrowModal(true)}
                                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                                title="Add Borrow Member"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span className="hidden sm:inline">Add Borrow Member</span>
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="scrollbar-hide">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-[#3a3a3a]">
                                <thead className="bg-gray-50 dark:bg-[#3a3a3a]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Member ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Full Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Return Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 print:hidden">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-[#3a3a3a] dark:bg-[#2a2a2a]">
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <TableRowSkeleton key={i} columns={7} />
                                        ))
                                    ) : filteredRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                                No book requests found matching "{searchQuery}"
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRequests.map((request) => (
                                            <tr
                                                key={request.id}
                                                className={`transition-colors hover:bg-gray-50 dark:hover:bg-[#3a3a3a] ${request.status === 'Disapproved' ? 'bg-red-50 dark:bg-red-900/10' : ''
                                                    }`}
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {request.id}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {request.member?.member_no || `#${request.member_id}`}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {request.full_name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {request.email}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {new Date(request.return_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}{' '}
                                                    {request.return_time
                                                        ? new Date(`2000-01-01T${request.return_time}`).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true,
                                                        })
                                                        : ''}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(request.status)}`}
                                                    >
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm print:hidden">
                                                    <ActionButtonGroup>
                                                        {/* Approve Button - Only for Pending */}
                                                        {request.status === 'Pending' && (
                                                            <ActionButton
                                                                onClick={() => openModal('approve', request)}
                                                                icon={CheckCircle}
                                                                title="Approve this request"
                                                                variant="approve"
                                                            />
                                                        )}

                                                        {/* Disapprove Button - Only for Pending */}
                                                        {request.status === 'Pending' && (
                                                            <ActionButton
                                                                onClick={() => openModal('disapprove', request)}
                                                                icon={XCircle}
                                                                title="Disapprove this request"
                                                                variant="disapprove"
                                                            />
                                                        )}

                                                        {/* View Button */}
                                                        <ActionButton
                                                            onClick={() => router.visit(route('admin.book-requests.show', request.id))}
                                                            icon={Eye}
                                                            title="View full details"
                                                            variant="view"
                                                        />

                                                        {/* Edit Button */}
                                                        <ActionButton
                                                            onClick={() => router.visit(route('admin.book-requests.edit', request.id))}
                                                            icon={Pencil}
                                                            title="Edit this request"
                                                            variant="edit"
                                                        />

                                                        {/* Delete Button */}
                                                        <ActionButton
                                                            onClick={() => openModal('delete', request)}
                                                            icon={Trash2}
                                                            title="Delete this request"
                                                            variant="delete"
                                                        />
                                                    </ActionButtonGroup>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                show={modalAction !== null}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                cancelText="Cancel"
                onConfirm={confirmAction}
                onCancel={closeModal}
                processing={processing}
                variant={modalConfig.variant}
            />

            {/* Add Borrow Member Modal */}
            <AddBorrowMemberModal
                isOpen={showAddBorrowModal}
                onClose={() => setShowAddBorrowModal(false)}
                catalogItems={catalogItems}
            />
        </AuthenticatedLayout>
    );
}
