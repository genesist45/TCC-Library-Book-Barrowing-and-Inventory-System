import { CatalogItem } from '@/types';
import DetailField from './DetailField';
import AuthorBadges from './AuthorBadges';
import StatusBadge from './StatusBadge';
import { BookOpen, Tag, Calendar, Globe, FileText, Hash, MapPin } from 'lucide-react';

interface CatalogItemDetailsGridProps {
    catalogItem: CatalogItem;
}

export default function CatalogItemDetailsGrid({ catalogItem }: CatalogItemDetailsGridProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                    {catalogItem.title}
                </h1>
                <div className="-ml-1">
                    <AuthorBadges authors={catalogItem.authors || []} />
                </div>
            </div>

            {/* Quick Stats / Main Info */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 border-y border-gray-100 py-6 dark:border-[#3a3a3a]">
                <DetailField label="Material Type">
                    <div className="flex items-center gap-2 mt-1">
                        <BookOpen size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{catalogItem.type}</span>
                    </div>
                </DetailField>
                <DetailField label="Category">
                    <div className="flex items-center gap-2 mt-1">
                        <Tag size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{catalogItem.category?.name || '-'}</span>
                    </div>
                </DetailField>
                <DetailField label="Call Number">
                    <div className="flex items-center gap-2 mt-1">
                        <Hash size={16} className="text-gray-400" />
                        <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100 px-2 py-0.5 rounded dark:bg-[#323232]">{catalogItem.call_no || '-'}</span>
                    </div>
                </DetailField>
                <DetailField label="Location">
                    <div className="flex items-center gap-2 mt-1">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{catalogItem.location || '-'}</span>
                    </div>
                </DetailField>
                <DetailField label="Status">
                    <div className="mt-1">
                        <StatusBadge isActive={catalogItem.is_active} />
                    </div>
                </DetailField>
            </div>

            {/* Publication & Identifiers Card */}
            <div className="rounded-xl bg-gray-50 p-6 dark:bg-[#2f2f2f]/50 border border-gray-100 dark:border-[#3a3a3a]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                    Publication Details
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
                    <DetailField label="Publisher" value={catalogItem.publisher?.name} />
                    <DetailField label="Place of Publication" value={catalogItem.place_of_publication} />
                    <DetailField label="Year">
                        <div className="flex items-center gap-2 mt-1">
                            <Calendar size={14} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{catalogItem.year || '-'}</span>
                        </div>
                    </DetailField>
                    <DetailField label="Edition" value={catalogItem.edition} />
                    <DetailField label="Series" value={catalogItem.series} />
                    <DetailField label="ISBN" value={catalogItem.isbn} />
                    <DetailField label="ISBN-13" value={catalogItem.isbn13} />
                </div>
            </div>

            {/* Physical Description Card */}
            {(catalogItem.extent || catalogItem.other_physical_details || catalogItem.dimensions) && (
                <div className="rounded-xl bg-gray-50 p-6 dark:bg-[#2f2f2f]/50 border border-gray-100 dark:border-[#3a3a3a]">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                        Physical Description
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
                        <DetailField label="Extent" value={catalogItem.extent} />
                        <DetailField label="Other Physical Details" value={catalogItem.other_physical_details} />
                        <DetailField label="Dimensions" value={catalogItem.dimensions} />
                    </div>
                </div>
            )}

            {/* Content & Description */}
            <div className="space-y-6">
                {catalogItem.url && (
                    <DetailField label="External URL">
                        <a
                            href={catalogItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline dark:text-indigo-400"
                        >
                            <Globe size={16} />
                            {catalogItem.url}
                        </a>
                    </DetailField>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {catalogItem.subject && (
                        <div className="lg:col-span-1">
                            <DetailField label="Subjects">
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {catalogItem.subject.split(',').map((subj, i) => (
                                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                            {subj.trim()}
                                        </span>
                                    ))}
                                </div>
                            </DetailField>
                        </div>
                    )}

                    {catalogItem.description && (
                        <div className={catalogItem.subject ? "lg:col-span-2" : "col-span-3"}>
                            <DetailField label="Description">
                                <div className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300 bg-white p-4 rounded-lg border border-gray-200 shadow-sm dark:bg-[#2a2a2a] dark:border-[#3a3a3a]">
                                    {catalogItem.description}
                                </div>
                            </DetailField>
                        </div>
                    )}
                </div>
            </div>

            {/* Meta Footer */}
            <div className="text-xs text-gray-400 pt-4 flex items-center gap-2">
                <span>Added on {new Date(catalogItem.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>ID: {catalogItem.id}</span>
            </div>
        </div>
    );
}
