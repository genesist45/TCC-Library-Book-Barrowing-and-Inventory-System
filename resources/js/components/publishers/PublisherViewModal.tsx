import Modal from '@/components/modals/Modal';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { useRef, useEffect } from 'react';

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
            <div className="p-4 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100 sm:text-xl">Publisher Details</h2>

                {displayPublisher && (
                    <div className="mt-4 sm:mt-6">
                        <div className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Name
                                </label>
                                <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayPublisher.name}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Country
                                </label>
                                <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayPublisher.country}</p>
                            </div>

                            {displayPublisher.description && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                        Description
                                    </label>
                                    <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayPublisher.description}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Status
                                </label>
                                <p className="mt-1.5">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        displayPublisher.is_published
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                    }`}>
                                        {displayPublisher.is_published ? 'Active' : 'Inactive'}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Items Count
                                </label>
                                <p className="mt-1.5">
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                        {displayPublisher.items_count} items
                                    </span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Created At
                                </label>
                                <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                    {new Date(displayPublisher.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-5 flex justify-end sm:mt-6">
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
