import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps, BookRequest } from '@/types';
import { useState, useEffect } from 'react';
import { Pencil, Trash2, CheckCircle, XCircle, Eye, Search, RefreshCw, Printer } from 'lucide-react';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { TableRowSkeleton } from '@/components/common/Loading';
import { toast } from 'react-toastify';

interface Props extends PageProps {
    bookRequests: BookRequest[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function BookRequestsView({ bookRequests, flash }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BookRequest | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    const handleDelete = (request: BookRequest) => {
        setSelectedRequest(request);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedRequest) {
            router.delete(route('admin.book-requests.destroy', selectedRequest.id), {
                onSuccess: () => {
                    toast.success('Book request deleted successfully!');
                    setShowDeleteModal(false);
                    setSelectedRequest(null);
                },
                onError: () => {
                    toast.error('Failed to delete book request');
                },
            });
        }
    };

    const handleApprove = (id: number) => {
        router.post(route('admin.book-requests.approve', id), {}, {
            preserveScroll: true,
        });
    };

    const handleDisapprove = (id: number) => {
        if (confirm('Are you sure you want to disapprove this request?')) {
            router.post(route('admin.book-requests.disapprove', id), {}, {
                preserveScroll: true,
            });
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
                    /* Remove scrollbars and ensure full width */
                    .overflow-hidden, .overflow-x-auto { overflow: visible !important; }
                    table { width: 100% !important; table-layout: fixed !important; }
                    /* Compact text and spacing for print */
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
                                        filteredRequests.map((request, index) => (
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
                                                    {request.return_time ? new Date(`2000-01-01T${request.return_time}`).toLocaleTimeString('en-US', {
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    }) : ''}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(request.status)}`}
                                                    >
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm print:hidden">
                                                    <div className="flex items-center gap-2">
                                                        {/* Approve Button - Only for Pending */}
                                                        {request.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleApprove(request.id)}
                                                                className="flex items-center justify-center rounded-lg bg-green-100 p-1.5 text-green-600 transition hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                                                                title="Approve this request"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </button>
                                                        )}

                                                        {/* Disapprove Button - Only for Pending */}
                                                        {request.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleDisapprove(request.id)}
                                                                className="flex items-center justify-center rounded-lg bg-red-100 p-1.5 text-red-600 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                                                title="Disapprove this request"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </button>
                                                        )}

                                                        {/* View Button */}
                                                        <button
                                                            onClick={() => router.visit(route('admin.book-requests.show', request.id))}
                                                            className="flex items-center justify-center rounded-lg bg-blue-100 p-1.5 text-blue-600 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                                            title="View full details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>

                                                        {/* Edit Button */}
                                                        <button
                                                            onClick={() => router.visit(route('admin.book-requests.edit', request.id))}
                                                            className="flex items-center justify-center rounded-lg bg-amber-100 p-1.5 text-amber-600 transition hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                                                            title="Edit this request"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>

                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={() => handleDelete(request)}
                                                            className="flex items-center justify-center rounded-lg bg-red-100 p-1.5 text-red-600 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                                            title="Delete this request"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-[#2a2a2a]">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirm Delete</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Are you sure you want to delete this book request from{' '}
                            <strong>{selectedRequest.full_name}</strong>?
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={() => setShowDeleteModal(false)}>Cancel</SecondaryButton>
                            <button
                                onClick={confirmDelete}
                                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
