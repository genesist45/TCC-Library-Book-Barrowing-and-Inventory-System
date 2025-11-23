import { BookReturn } from '@/types';

interface BookReturnViewModalProps {
    show: boolean;
    bookReturn: BookReturn | null;
    onClose: () => void;
}

export default function BookReturnViewModal({ show, bookReturn, onClose }: BookReturnViewModalProps) {
    if (!show || !bookReturn) return null;

    const getConditionColor = (condition: string) => {
        const colors = {
            Good: 'text-green-600 dark:text-green-400',
            Damaged: 'text-orange-600 dark:text-orange-400',
            Lost: 'text-red-600 dark:text-red-400',
        };
        return colors[condition as keyof typeof colors] || 'text-gray-600';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-[#2a2a2a]">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Return Details
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Complete information about this book return
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Return ID</p>
                            <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
                                {bookReturn.id}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Borrow ID</p>
                            <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
                                {bookReturn.book_request?.id || 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member</p>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                                {bookReturn.member?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {bookReturn.member?.member_no}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Book Title</p>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                                {bookReturn.catalog_item?.title || 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Return Date & Time</p>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                                {new Date(bookReturn.return_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}{' '}
                                at {bookReturn.return_time}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                            <p className="mt-1">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bookReturn.status === 'Returned'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                    }`}>
                                    {bookReturn.status}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Condition on Return</p>
                            <p className={`mt-1 text-base font-semibold ${getConditionColor(bookReturn.condition_on_return)}`}>
                                {bookReturn.condition_on_return}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Penalty Amount</p>
                            <p className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100">
                                ₱{Number(bookReturn.penalty_amount).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {bookReturn.remarks && (
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Remarks</p>
                            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                                {bookReturn.remarks}
                            </p>
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Processed By</p>
                        <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                            {bookReturn.processor?.name || 'N/A'}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Recorded On</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(bookReturn.created_at).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end border-t border-gray-200 pt-4 dark:border-[#3a3a3a]">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
