import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps, BookRequest } from '@/types';
import { useState } from 'react';
import { Pencil, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';

interface Props extends PageProps {
    bookRequests: BookRequest[];
}

export default function BookRequestsView({ bookRequests }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BookRequest | null>(null);

    const handleEdit = (id: number) => {
        router.visit(route('admin.book-requests.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('admin.book-requests.show', id));
    };

    const handleDelete = (request: BookRequest) => {
        setSelectedRequest(request);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedRequest) {
            router.delete(route('admin.book-requests.destroy', selectedRequest.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setSelectedRequest(null);
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

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                            Book Requests
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400">
                            Manage all book borrow requests from members
                        </p>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-[#3a3a3a]">
                                <thead className="bg-gray-50 dark:bg-[#3a3a3a]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Book Title
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
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-[#3a3a3a] dark:bg-[#2a2a2a]">
                                    {bookRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                                No book requests found
                                            </td>
                                        </tr>
                                    ) : (
                                        bookRequests.map((request) => (
                                            <tr
                                                key={request.id}
                                                className={`transition-colors hover:bg-gray-50 dark:hover:bg-[#3a3a3a] ${request.status === 'Disapproved' ? 'bg-red-50 dark:bg-red-900/10' : ''
                                                    }`}
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    #{request.id}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {request.catalogItem?.title || request.catalog_item?.title || 'N/A'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {request.member?.member_no || `#${request.member_id}`}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {request.full_name}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {request.email}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {new Date(request.return_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}{' '}
                                                    {request.return_time}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(request.status)}`}
                                                    >
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        {/* Approve Button */}
                                                        {request.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleApprove(request.id)}
                                                                className="rounded-md bg-green-100 p-2 text-green-700 transition hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </button>
                                                        )}

                                                        {/* Disapprove Button */}
                                                        {request.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleDisapprove(request.id)}
                                                                className="rounded-md bg-red-100 p-2 text-red-700 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                                                                title="Disapprove"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </button>
                                                        )}

                                                        {/* View Button */}
                                                        <button
                                                            onClick={() => handleView(request.id)}
                                                            className="rounded-md bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>

                                                        {/* Edit Button */}
                                                        <button
                                                            onClick={() => handleEdit(request.id)}
                                                            className="rounded-md bg-indigo-100 p-2 text-indigo-700 transition hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>

                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={() => handleDelete(request)}
                                                            className="rounded-md bg-gray-100 p-2 text-gray-700 transition hover:bg-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:hover:bg-gray-900/50"
                                                            title="Delete"
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
