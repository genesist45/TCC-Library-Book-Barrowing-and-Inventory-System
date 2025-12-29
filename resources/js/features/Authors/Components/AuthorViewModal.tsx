import Modal from '@/components/modals/Modal';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { useRef, useEffect } from 'react';
import { User, Globe, FileText, Calendar, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import type { Author } from '../types/author';

interface AuthorViewModalProps {
    show: boolean;
    author: Author | null;
    onClose: () => void;
}

export const AuthorViewModal = ({ show, author, onClose }: AuthorViewModalProps) => {
    const authorDataRef = useRef<Author | null>(null);

    useEffect(() => {
        if (show && author) {
            authorDataRef.current = author;
        }
    }, [show, author]);

    const displayAuthor = show && author ? author : authorDataRef.current;

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div>
                {/* Header */}
                <div className="border-b border-gray-100 px-6 py-4 dark:border-[#3a3a3a]">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <User className="text-indigo-500" size={24} />
                        Author Details
                    </h2>
                </div>

                {displayAuthor && (
                    <div className="p-6 space-y-6">
                        {/* Primary Info Row */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    Author Name
                                </p>
                                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                    {displayAuthor.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    Status
                                </p>
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${displayAuthor.is_published
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                    }`}>
                                    {displayAuthor.is_published ? (
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
                        </div>

                        {/* Country Row */}
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Country
                            </p>
                            <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Globe size={14} className="text-gray-400" />
                                {displayAuthor.country}
                            </p>
                        </div>

                        {/* Details Section */}
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-[#323232]">
                            <h4 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-4">
                                Author Statistics
                            </h4>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                        Total Items
                                    </p>
                                    <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <BookOpen size={14} className="text-gray-400" />
                                        {displayAuthor.items_count ?? 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                        Joined
                                    </p>
                                    <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400" />
                                        {new Date(displayAuthor.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        {displayAuthor.bio && (
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-[#323232]">
                                <h4 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                    <FileText size={14} />
                                    Biography
                                </h4>
                                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                    {displayAuthor.bio}
                                </p>
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
};
