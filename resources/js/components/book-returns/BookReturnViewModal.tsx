import { BookReturn } from '@/types';
import { User, Book, Calendar, DollarSign, Info, Tag, FileText } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity">
            <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl dark:bg-[#2a2a2a] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-[#3a3a3a]">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Record Details
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        Transaction ID: #{bookReturn.id}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Top Section: Member and Book */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Member Card */}
                        <div className="flex items-start gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-[#3a3a3a] dark:bg-[#323232]">
                            <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Member</p>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                    {bookReturn.member?.name || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {bookReturn.member?.member_no}
                                </p>
                            </div>
                        </div>

                        {/* Book Card */}
                        <div className="flex items-start gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-[#3a3a3a] dark:bg-[#323232]">
                            <div className="rounded-full bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                <Book size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Book</p>
                                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate w-48" title={bookReturn.catalog_item?.title}>
                                    {bookReturn.catalog_item?.title || 'N/A'}
                                </p>
                                <div className="mt-1 flex flex-col text-xs text-gray-600 dark:text-gray-400">
                                    <span>Acc: {bookReturn.book_request?.catalog_item_copy?.accession_no || 'N/A'}</span>
                                    <span>Borrow ID: #{bookReturn.book_request?.id || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-[#3a3a3a]"></div>

                    {/* Middle Section: Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1.5">
                                <Calendar size={14} />
                                <p className="text-xs font-medium uppercase">Record Date</p>
                            </div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                {new Date(bookReturn.return_date).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                })}
                            </p>
                            <p className="text-xs text-gray-500">
                                at {bookReturn.return_time}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1.5">
                                <Tag size={14} />
                                <p className="text-xs font-medium uppercase">Condition</p>
                            </div>
                            <p className={`font-semibold ${getConditionColor(bookReturn.condition_on_return)}`}>
                                {bookReturn.condition_on_return}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1.5">
                                <DollarSign size={14} />
                                <p className="text-xs font-medium uppercase">Penalty</p>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                ₱{Number(bookReturn.penalty_amount).toFixed(2)}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1.5">
                                <Info size={14} />
                                <p className="text-xs font-medium uppercase">Status</p>
                            </div>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${bookReturn.status === 'Returned'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                {bookReturn.status}
                            </span>
                        </div>
                    </div>

                    {bookReturn.remarks && (
                        <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-900/20">
                            <div className="flex items-start gap-2">
                                <FileText size={16} className="text-yellow-600 dark:text-yellow-500 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold uppercase text-yellow-700 dark:text-yellow-500 mb-1">Remarks</p>
                                    <p className="text-sm text-gray-800 dark:text-gray-300 italic">
                                        "{bookReturn.remarks}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Meta & Actions */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between dark:bg-[#323232]">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <span>Processed by <span className="font-medium text-gray-700 dark:text-gray-300">{bookReturn.processor?.name || 'System'}</span></span>
                        </div>
                        <div className="mt-0.5">
                            Recorded: {new Date(bookReturn.created_at).toLocaleString()}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
