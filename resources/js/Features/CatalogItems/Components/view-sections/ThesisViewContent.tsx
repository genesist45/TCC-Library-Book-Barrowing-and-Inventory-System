import { CatalogItem } from "@/types";
import DetailField from "./DetailField";
import { GraduationCap } from "lucide-react";

interface ThesisViewContentProps {
    catalogItem: CatalogItem;
}

export default function ThesisViewContent({
    catalogItem,
}: ThesisViewContentProps) {
    const hasAnyData =
        catalogItem.granting_institution ||
        catalogItem.degree_qualification ||
        catalogItem.supervisor ||
        catalogItem.thesis_date ||
        catalogItem.thesis_period ||
        catalogItem.publication_type;

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return undefined;
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (!hasAnyData) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <GraduationCap
                    size={48}
                    className="text-gray-300 dark:text-gray-600"
                />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    No thesis information has been provided for this catalog
                    item.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Thesis Information
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Academic thesis and dissertation details
                </p>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <DetailField
                    label="Granting Institution"
                    value={catalogItem.granting_institution}
                    className="sm:col-span-2"
                />
                <DetailField
                    label="Degree / Qualification"
                    value={catalogItem.degree_qualification}
                />
                <DetailField
                    label="Supervisor"
                    value={catalogItem.supervisor}
                />
                <DetailField
                    label="Date"
                    value={formatDate(catalogItem.thesis_date)}
                />
                <DetailField
                    label="Period"
                    value={catalogItem.thesis_period}
                />
                <DetailField
                    label="Publication Type"
                    value={catalogItem.publication_type}
                    className="sm:col-span-2"
                />
            </div>
        </div>
    );
}
