import { CatalogItem } from "@/types";
import DetailField from "./DetailField";
import { BookOpen } from "lucide-react";

interface JournalViewContentProps {
    catalogItem: CatalogItem;
}

export default function JournalViewContent({
    catalogItem,
}: JournalViewContentProps) {
    const hasAnyData =
        catalogItem.issn ||
        catalogItem.frequency ||
        catalogItem.journal_type ||
        catalogItem.issue_type ||
        catalogItem.issue_period;

    if (!hasAnyData) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <BookOpen
                    size={48}
                    className="text-gray-300 dark:text-gray-600"
                />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    No journal information has been provided for this catalog
                    item.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Journal Information
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Specific fields for journal and periodical materials
                </p>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <DetailField label="ISSN" value={catalogItem.issn} />
                <DetailField label="Frequency" value={catalogItem.frequency} />
                <DetailField
                    label="Journal Type"
                    value={catalogItem.journal_type}
                />
                <DetailField
                    label="Issue Type"
                    value={catalogItem.issue_type}
                />
                <DetailField
                    label="Issue Period"
                    value={catalogItem.issue_period}
                    className="sm:col-span-2"
                />
            </div>
        </div>
    );
}
