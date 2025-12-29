import { Category, Author, Publisher } from "@/types";
import BasicInformationSection from "./BasicInformationSection";
import PublicationDetailsSection from "./PublicationDetailsSection";
import PhysicalDescriptionSection from "./PhysicalDescriptionSection";
import AdditionalDetailsSection from "./AdditionalDetailsSection";

interface ItemInfoTabContentProps {
    data: any;
    errors: any;
    categories: Category[];
    authors: Author[];
    publishers: Publisher[];
    onDataChange: (field: string, value: any) => void;
    onClearErrors: (field: string) => void;
    onShowCategoryModal: () => void;
    onShowAuthorModal: () => void;
    onShowPublisherModal: () => void;
}

export default function ItemInfoTabContent({
    data,
    errors,
    categories,
    authors,
    publishers,
    onDataChange,
    onClearErrors,
    onShowCategoryModal,
    onShowAuthorModal,
    onShowPublisherModal,
}: ItemInfoTabContentProps) {
    return (
        <div className="space-y-8">
            <BasicInformationSection
                data={data}
                errors={errors}
                categories={categories}
                authors={authors}
                onDataChange={onDataChange}
                onClearErrors={onClearErrors}
                onShowCategoryModal={onShowCategoryModal}
                onShowAuthorModal={onShowAuthorModal}
            />

            <PublicationDetailsSection
                data={data}
                errors={errors}
                publishers={publishers}
                onDataChange={onDataChange}
                onClearErrors={onClearErrors}
                onShowPublisherModal={onShowPublisherModal}
            />

            <PhysicalDescriptionSection
                data={data}
                errors={errors}
                onDataChange={onDataChange}
                onClearErrors={onClearErrors}
            />

            <AdditionalDetailsSection
                data={data}
                errors={errors}
                onDataChange={onDataChange}
                onClearErrors={onClearErrors}
            />
        </div>
    );
}
