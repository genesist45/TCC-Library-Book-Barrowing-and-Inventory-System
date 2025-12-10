import { CatalogItem } from '@/types';
import DetailField from './DetailField';
import AuthorBadges from './AuthorBadges';
import StatusBadge from './StatusBadge';

interface CatalogItemDetailsGridProps {
    catalogItem: CatalogItem;
}

export default function CatalogItemDetailsGrid({ catalogItem }: CatalogItemDetailsGridProps) {
    return (
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailField label="Title" className="sm:col-span-2 lg:col-span-3">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {catalogItem.title}
                </p>
            </DetailField>

            <DetailField label="Accession No." value={catalogItem.accession_no} />

            <AuthorBadges authors={catalogItem.authors || []} />

            <DetailField label="Material Type" value={catalogItem.type} />
            <DetailField label="Category" value={catalogItem.category?.name} />
            <DetailField label="Publication Details" value={catalogItem.publisher?.name} />
            <DetailField label="Year" value={catalogItem.year} />
            <DetailField label="ISBN" value={catalogItem.isbn} />
            <DetailField label="ISBN-13" value={catalogItem.isbn13} />
            <DetailField label="Call Number" value={catalogItem.call_no} />
            <DetailField label="Subject" value={catalogItem.subject} />
            <DetailField label="Series" value={catalogItem.series} />
            <DetailField label="Edition" value={catalogItem.edition} />

            {catalogItem.url && (
                <DetailField label="URL" className="sm:col-span-2 lg:col-span-3">
                    <a
                        href={catalogItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        {catalogItem.url}
                    </a>
                </DetailField>
            )}

            {catalogItem.description && (
                <DetailField label="Description" className="sm:col-span-2 lg:col-span-3">
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {catalogItem.description}
                    </p>
                </DetailField>
            )}

            <DetailField label="Status">
                <p className="mt-1">
                    <StatusBadge isActive={catalogItem.is_active} />
                </p>
            </DetailField>

            <DetailField label="Created At">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date(catalogItem.created_at).toLocaleDateString()}
                </p>
            </DetailField>
        </div>
    );
}
