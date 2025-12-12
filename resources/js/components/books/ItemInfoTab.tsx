import { CatalogItem, CatalogItemCopy } from "@/types";
import DetailRow from "./DetailRow";
import BookCoverImage from "./BookCoverImage";

interface ItemInfoTabProps {
    catalogItem: CatalogItem & {
        copies?: CatalogItemCopy[];
        copies_count?: number;
        available_copies_count?: number;
    };
}

export default function ItemInfoTab({ catalogItem }: ItemInfoTabProps) {
    const authorsString =
        catalogItem.authors && catalogItem.authors.length > 0
            ? catalogItem.authors.map((a) => a.name).join(", ")
            : undefined;

    const copiesCount =
        catalogItem.copies_count ?? catalogItem.copies?.length ?? 0;

    return (
        <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Side - Book Information */}
            <div className="flex-1">
                <dl className="divide-y divide-gray-100">
                    <DetailRow label="Type" value={catalogItem.type} />
                    <DetailRow label="Authors" value={authorsString} isLink />
                    <DetailRow label="Category" value={catalogItem.category?.name} />
                    <DetailRow label="Publication Year" value={catalogItem.year} />
                    <DetailRow label="Publisher" value={catalogItem.publisher?.name} isLink />
                    <DetailRow label="Edition" value={catalogItem.edition} />
                    <DetailRow label="Volume" value={catalogItem.volume} />
                    <DetailRow label="ISBN" value={catalogItem.isbn} />
                    <DetailRow label="ISBN 13" value={catalogItem.isbn13} />
                    <DetailRow label="ISSN" value={catalogItem.issn} />
                    <DetailRow label="Call No" value={catalogItem.call_no} />
                    <DetailRow label="Series" value={catalogItem.series} />
                    <DetailRow label="Subject" value={catalogItem.subject} />
                    <DetailRow label="Place of Publication" value={catalogItem.place_of_publication} />
                    <DetailRow label="Location" value={catalogItem.location} />
                    <DetailRow label="Abstract" value={catalogItem.abstract} />
                    <DetailRow label="Description" value={catalogItem.description} />
                    <DetailRow label="Biblio Notes" value={catalogItem.biblio_info} />
                    <div className="grid grid-cols-3 gap-4 border-b border-gray-100 py-3">
                        <dt className="text-sm font-medium text-gray-500">Number of Copies</dt>
                        <dd className="col-span-2 text-sm font-semibold text-gray-900">
                            {copiesCount}
                        </dd>
                    </div>
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
