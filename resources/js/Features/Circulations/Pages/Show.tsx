import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps, BookRequest } from '@/types';
import { Calendar, Clock, Mail, Phone, MapPin, FileText, User, BookOpen, Hash } from 'lucide-react';
import SecondaryButton from '@/components/buttons/SecondaryButton';

interface Props extends PageProps {
    bookRequest: BookRequest;
}

export default function Show({ bookRequest }: Props) {
    const handleBack = () => {
        router.visit(route('admin.book-requests.index'));
    };

    const handleEdit = () => {
        router.visit(route('admin.book-requests.edit', bookRequest.id));
    };

    const handleApprove = () => {
        if (confirm('Approve this book request?')) {
            router.post(route('admin.book-requests.approve', bookRequest.id), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(route('admin.book-requests.index'));
                }
            });
        }
    };

    const handleDisapprove = () => {
        if (confirm('Are you sure you want to disapprove this request?')) {
            router.post(route('admin.book-requests.disapprove', bookRequest.id), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(route('admin.book-requests.index'));
                }
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
            <Head title={`Book Request #${bookRequest.id}`} />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        {/* Header */}
                        <div className="border-b border-gray-200 p-4 dark:border-[#3a3a3a] sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                        Book Request #{bookRequest.id}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400">
                                        View detailed information about this book request
                                    </p>
                                </div>
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusBadge(bookRequest.status)}`}
                                >
                                    {bookRequest.status}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6">
                            <div className="space-y-6">
                                {/* Book Information */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                                    <h3 className="mb-4 flex items-center text-base font-semibold text-gray-900 dark:text-gray-100">
                                        <BookOpen className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        Book Information
                                    </h3>
                                    <div className="flex flex-col gap-6 sm:flex-row">
                                        {/* Book Cover */}
                                        <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
                                            {(bookRequest.catalogItem?.cover_image || bookRequest.catalog_item?.cover_image) ? (
                                                <img
                                                    src={`/storage/${bookRequest.catalogItem?.cover_image || bookRequest.catalog_item?.cover_image}`}
                                                    alt={bookRequest.catalogItem?.title || bookRequest.catalog_item?.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                    <BookOpen className="h-8 w-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Book Details */}
                                        <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Book Title:</span>
                                                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {bookRequest.catalogItem?.title || bookRequest.catalog_item?.title || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Catalog ID:</span>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    #{bookRequest.catalog_item_id}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Author:</span>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {(bookRequest.catalogItem?.authors || bookRequest.catalog_item?.authors)?.map((a: any) => a.name).join(', ') || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Publisher:</span>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {bookRequest.catalogItem?.publisher?.name || bookRequest.catalog_item?.publisher?.name || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Member Information */}
                                <div className="rounded-lg border border-gray-200 bg-indigo-50 p-5 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                                    <h3 className="mb-4 flex items-center text-base font-semibold text-gray-900 dark:text-gray-100">
                                        <User className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        Member Information
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Member Number:</span>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {bookRequest.member?.member_no || `#${bookRequest.member_id}`}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Member Name:</span>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {bookRequest.member?.name || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Request Details */}
                                <div className="rounded-lg border border-gray-200 p-5 dark:border-[#3a3a3a]">
                                    <h3 className="mb-4 flex items-center text-base font-semibold text-gray-900 dark:text-gray-100">
                                        <FileText className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        Request Details
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="flex items-start">
                                            <User className="mr-3 mt-0.5 h-5 w-5 text-gray-400" />
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name:</span>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{bookRequest.full_name}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Mail className="mr-3 mt-0.5 h-5 w-5 text-gray-400" />
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Email:</span>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{bookRequest.email}</p>
                                            </div>
                                        </div>

                                        {bookRequest.phone && (
                                            <div className="flex items-start">
                                                <Phone className="mr-3 mt-0.5 h-5 w-5 text-gray-400" />
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone:</span>
                                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{bookRequest.phone}</p>
                                                </div>
                                            </div>
                                        )}

                                        {bookRequest.quota && (
                                            <div className="flex items-start">
                                                <Hash className="mr-3 mt-0.5 h-5 w-5 text-gray-400" />
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Quota:</span>
                                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{bookRequest.quota}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start">
                                            <Calendar className="mr-3 mt-0.5 h-5 w-5 text-gray-400" />
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Record Date:</span>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {new Date(bookRequest.return_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Clock className="mr-3 mt-0.5 h-5 w-5 text-gray-400" />
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Record Time:</span>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{bookRequest.return_time}</p>
                                            </div>
                                        </div>

                                        {bookRequest.address && (
                                            <div className="flex items-start sm:col-span-2">
                                                <MapPin className="mr-3 mt-0.5 h-5 w-5 text-gray-400" />
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Address:</span>
                                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{bookRequest.address}</p>
                                                </div>
                                            </div>
                                        )}

                                        {bookRequest.notes && (
                                            <div className="flex items-start sm:col-span-2">
                                                <FileText className="mr-3 mt-0.5 h-5 w-5 text-gray-400" />
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes / Message:</span>
                                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{bookRequest.notes}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Timestamps */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                                    <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
                                        Timestamps
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Created At:</span>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {new Date(bookRequest.created_at).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated:</span>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {new Date(bookRequest.updated_at).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-between gap-3 border-t border-gray-200 pt-6 dark:border-[#3a3a3a]">
                                <SecondaryButton onClick={handleBack}>
                                    Back to List
                                </SecondaryButton>
                                <div className="flex gap-3">
                                    {bookRequest.status === 'Pending' && (
                                        <>
                                            <button
                                                onClick={handleDisapprove}
                                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                            >
                                                Disapprove Request
                                            </button>
                                            <button
                                                onClick={handleApprove}
                                                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                            >
                                                Approve Request
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={handleEdit}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Edit Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
