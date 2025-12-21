import { CatalogItem } from "@/types";
import DetailField from "./DetailField";
import { FileText } from "lucide-react";

interface DetailViewContentProps {
    catalogItem: CatalogItem;
}

export default function DetailViewContent({
    catalogItem,
}: DetailViewContentProps) {
    const hasAnyData =
        catalogItem.volume ||
        catalogItem.page_duration ||
        catalogItem.abstract ||
        catalogItem.biblio_info ||
        catalogItem.url_visibility ||
        catalogItem.library_branch;

    if (!hasAnyData) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <FileText
                    size={48}
                    className="text-gray-300 dark:text-gray-600"
                />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    No detail information has been provided for this catalog
                    item.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Detail Information
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Additional details for general materials
                </p>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <DetailField label="Volume" value={catalogItem.volume} />
                <DetailField
                    label="Page / Duration"
                    value={catalogItem.page_duration}
                />
                <DetailField
                    label="URL Visibility"
                    value={catalogItem.url_visibility}
                />
                <DetailField
                    label="Library Branch"
                    value={catalogItem.library_branch}
                />

                {catalogItem.abstract && (
                    <DetailField
                        label="Abstract"
                        className="sm:col-span-2"
                    >
                        <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {catalogItem.abstract}
                        </p>
                    </DetailField>
                )}

                {catalogItem.biblio_info && (
                    <DetailField
                        label="Biblio Information"
                        className="sm:col-span-2"
                    >
                        <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {catalogItem.biblio_info}
                        </p>
                    </DetailField>
                )}
            </div>
        </div>
    );
}
