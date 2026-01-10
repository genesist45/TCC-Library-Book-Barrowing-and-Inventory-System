import { CatalogItem } from "@/types";
import DetailRow from "./DetailRow";
import BookCoverImage from "./BookCoverImage";

interface Field {
    label: string;
    value: string | undefined | null;
    isLink?: boolean;
}

interface GenericInfoTabProps {
    catalogItem: CatalogItem;
    fields: Field[];
}

export default function GenericInfoTab({ catalogItem, fields }: GenericInfoTabProps) {
    return (
        <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Side - Information */}
            <div className="flex-1">
                <dl className="divide-y divide-gray-100">
                    {fields.map((field, index) => (
                        <DetailRow
                            key={index}
                            label={field.label}
                            value={field.value}
                            isLink={field.isLink}
                        />
                    ))}
                </dl>
            </div>

            {/* Right Side - Cover Image */}
            <div className="flex justify-center lg:w-72 lg:flex-shrink-0">
                <BookCoverImage
                    coverImage={catalogItem.cover_image}
                    title={catalogItem.title}
                />
            </div>
        </div>
    );
}
