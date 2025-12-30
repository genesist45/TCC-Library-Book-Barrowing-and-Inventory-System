import { Category, Author, Publisher, Location } from "@/types";
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
    locations?: Location[];
    onDataChange: (field: string, value: any) => void;
    onClearErrors: (field: string) => void;
    onShowCategoryModal: () => void;
    onShowAuthorModal: () => void;
    onShowPublisherModal: () => void;
    onShowLocationModal?: () => void;
}

export default function ItemInfoTabContent({
    data,
    errors,
    categories,
    authors,
    publishers,
    locations = [],
    onDataChange,
    onClearErrors,
    onShowCategoryModal,
    onShowAuthorModal,
    onShowPublisherModal,
    onShowLocationModal,
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
                locations={locations}
                onDataChange={onDataChange}
                onClearErrors={onClearErrors}
                onShowLocationModal={onShowLocationModal}
            />
        </div>
    );
}
