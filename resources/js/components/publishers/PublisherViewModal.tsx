import Modal from '@/components/modals/Modal';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { useRef, useEffect } from 'react';
import { Building2, Globe, FileText, Calendar, BookOpen, CheckCircle, XCircle } from 'lucide-react';

interface Publisher {
    id: number;
    name: string;
    country: string;
    description?: string;
    is_published: boolean;
    items_count: number;
    created_at: string;
}

interface PublisherViewModalProps {
    show: boolean;
    publisher: Publisher | null;
    onClose: () => void;
}

export default function PublisherViewModal({ show, publisher, onClose }: PublisherViewModalProps) {
    const publisherDataRef = useRef<Publisher | null>(null);

    useEffect(() => {
        if (show && publisher) {
            publisherDataRef.current = publisher;
        }
    }, [show, publisher]);

    const displayPublisher = show && publisher ? publisher : publisherDataRef.current;

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div>
                {/* Header */}
                <div className="border-b border-gray-100 px-6 py-4 dark:border-[#3a3a3a]">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Building2 className="text-purple-500" size={24} />
                        Publisher Details
                    </h2>
                </div>

                {displayPublisher && (
                    <div className="p-6 space-y-6">
                        {/* Status & Name Card */}
                        <div className="flex items-start justify-between rounded-lg bg-gray-50 p-4 dark:bg-[#323232]">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {displayPublisher.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                                    <Globe size={14} />
                                    {displayPublisher.country}
                                </p>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${displayPublisher.is_published
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                }`}>
                                {displayPublisher.is_published ? (
                                    <>
                                        <CheckCircle size={12} /> Active
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={12} /> Inactive
                                    </>
                                )}
                            </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border border-gray-100 p-3 dark:border-[#3a3a3a]">
                                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold flex items-center gap-1.5 mb-1">
                                    <BookOpen size={14} /> Total Items
                                </div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {displayPublisher.items_count}
                                </div>
                            </div>
                            <div className="rounded-lg border border-gray-100 p-3 dark:border-[#3a3a3a]">
                                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold flex items-center gap-1.5 mb-1">
                                    <Calendar size={14} /> Added On
                                </div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                                    {new Date(displayPublisher.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        {displayPublisher.description && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                                    <FileText size={16} /> Description
                                </h4>
                                <div className="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-600 dark:bg-[#323232] dark:text-gray-300">
                                    {displayPublisher.description}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end dark:bg-[#323232]/50 border-t border-gray-100 dark:border-[#3a3a3a]">
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
