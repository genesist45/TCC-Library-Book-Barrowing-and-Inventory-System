import Modal from '@/components/modals/Modal';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { useRef, useEffect } from 'react';
import { Folder, Link, FileText, Calendar, BookOpen, CheckCircle, XCircle, Tag } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    is_published: boolean;
    items_count: number;
    created_at: string;
}

interface CategoryViewModalProps {
    show: boolean;
    category: Category | null;
    onClose: () => void;
}

export default function CategoryViewModal({ show, category, onClose }: CategoryViewModalProps) {
    const categoryDataRef = useRef<Category | null>(null);

    useEffect(() => {
        if (show && category) {
            categoryDataRef.current = category;
        }
    }, [show, category]);

    const displayCategory = show && category ? category : categoryDataRef.current;

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div>
                {/* Header */}
                <div className="border-b border-gray-100 px-6 py-4 dark:border-[#3a3a3a]">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Folder className="text-orange-500" size={24} />
                        Category Details
                    </h2>
                </div>

                {displayCategory && (
                    <div className="p-6 space-y-6">
                        {/* Primary Info Row */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    Category Name
                                </p>
                                <p className="text-base font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <Tag size={16} className="text-orange-500" />
                                    {displayCategory.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    Status
                                </p>
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${displayCategory.is_published
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                    }`}>
                                    {displayCategory.is_published ? (
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

                        {/* Slug Row */}
                        {displayCategory.slug && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    Slug
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 font-mono">
                                    <Link size={14} className="text-gray-400" />
                                    {displayCategory.slug}
                                </p>
                            </div>
                        )}

                        {/* Details Section */}
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-[#323232]">
                            <h4 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-4">
                                Category Details
                            </h4>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                        Total Items
                                    </p>
                                    <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <BookOpen size={14} className="text-gray-400" />
                                        {displayCategory.items_count ?? 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                        Created
                                    </p>
                                    <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400" />
                                        {new Date(displayCategory.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        {displayCategory.description && (
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-[#323232]">
                                <h4 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                    <FileText size={14} />
                                    Description
                                </h4>
                                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                    {displayCategory.description}
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
}
