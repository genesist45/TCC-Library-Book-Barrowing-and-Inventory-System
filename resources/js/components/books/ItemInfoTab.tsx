import { CatalogItem, CatalogItemCopy } from "@/types";
import { useState } from "react";
import DetailRow from "./DetailRow";
import BookCoverImage from "./BookCoverImage";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ItemInfoTabProps {
    catalogItem: CatalogItem & {
        copies?: CatalogItemCopy[];
        copies_count?: number;
        available_copies_count?: number;
    };
}

export default function ItemInfoTab({ catalogItem }: ItemInfoTabProps) {
    const [showMore, setShowMore] = useState(false);

    const authorsString =
        catalogItem.authors && catalogItem.authors.length > 0
            ? catalogItem.authors.map((a) => a.name).join(", ")
            : undefined;

    const copiesCount =
        catalogItem.copies_count ?? catalogItem.copies?.length ?? 0;

    const hasDetail = !!(catalogItem.volume || catalogItem.page_duration || catalogItem.abstract || catalogItem.biblio_info || catalogItem.url_visibility || catalogItem.library_branch);
    const hasJournal = !!(catalogItem.issn || catalogItem.frequency || catalogItem.journal_type || catalogItem.issue_type || catalogItem.issue_period);
    const hasThesis = !!(catalogItem.granting_institution || catalogItem.degree_qualification || catalogItem.supervisor || catalogItem.thesis_date || catalogItem.thesis_period || catalogItem.publication_type);
    const hasAnyMoreInfo = hasDetail || hasJournal || hasThesis;

    return (
        <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Side - Book Information */}
            <div className="flex-1">
                <dl className="divide-y divide-gray-100">
                    <DetailRow label="Title" value={catalogItem.title} />
                    <DetailRow label="Authors" value={authorsString} isLink />
                    <DetailRow label="Material Type" value={catalogItem.type} />
                    <DetailRow label="Category" value={catalogItem.category?.name} />
                    <DetailRow label="Publisher" value={catalogItem.publisher?.name} isLink />
                    <DetailRow label="Year of Publication" value={catalogItem.year} />
                    <DetailRow label="Place of Publication" value={catalogItem.place_of_publication} />
                    <DetailRow label="Edition" value={catalogItem.edition} />
                    <DetailRow label="Series" value={catalogItem.series} />
                    <DetailRow label="ISBN" value={catalogItem.isbn} />
                    <DetailRow label="ISBN-13" value={catalogItem.isbn13} />
                    <DetailRow label="Call Number" value={catalogItem.call_no} />
                    <DetailRow label="Subject" value={catalogItem.subject} />
                    <DetailRow label="Extent" value={catalogItem.extent} />
                    <DetailRow label="Other Physical Details" value={catalogItem.other_physical_details} />
                    <DetailRow label="Dimensions" value={catalogItem.dimensions} />
                    <DetailRow label="Location" value={catalogItem.location} />
                    <DetailRow label="URL" value={catalogItem.url} />
                    <DetailRow label="Description" value={catalogItem.description} />
                    <div className="grid grid-cols-3 gap-4 border-b border-gray-100 py-3">
                        <dt className="text-sm font-medium text-gray-500">Available Copies</dt>
                        <dd className="col-span-2 text-sm font-semibold text-gray-900">
                            {catalogItem.available_copies_count ?? 0} / {copiesCount}
                        </dd>
                    </div>
                </dl>

                {/* More Info Content */}
                {showMore && (
                    <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                        {hasDetail && (
                            <section>
                                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-indigo-600">
                                    DETAILS
                                </h4>
                                <dl className="divide-y divide-gray-100 border-t border-gray-100">
                                    <DetailRow label="Volume" value={catalogItem.volume} />
                                    <DetailRow label="Page / Duration" value={catalogItem.page_duration} />
                                    <DetailRow label="Abstract" value={catalogItem.abstract} />
                                    <DetailRow label="Biblio Information" value={catalogItem.biblio_info} />
                                    <DetailRow label="URL Visibility" value={catalogItem.url_visibility} />
                                    <DetailRow label="Branch" value={catalogItem.library_branch} />
                                </dl>
                                <hr className="mt-8 border-gray-200" />
                            </section>
                        )}

                        {hasJournal && (
                            <section>
                                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-indigo-600">
                                    JOURNAL
                                </h4>
                                <dl className="divide-y divide-gray-100 border-t border-gray-100">
                                    <DetailRow label="ISSN" value={catalogItem.issn} />
                                    <DetailRow label="Frequency" value={catalogItem.frequency} />
                                    <DetailRow label="Journal Type" value={catalogItem.journal_type} />
                                    <DetailRow label="Issue Type" value={catalogItem.issue_type} />
                                    <DetailRow label="Issue Period" value={catalogItem.issue_period} />
                                </dl>
                                <hr className="mt-8 border-gray-200" />
                            </section>
                        )}

                        {hasThesis && (
                            <section>
                                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-indigo-600">
                                    THESIS
                                </h4>
                                <dl className="divide-y divide-gray-100 border-t border-gray-100">
                                    <DetailRow label="Granting Institution" value={catalogItem.granting_institution} />
                                    <DetailRow label="Degree / Qualification" value={catalogItem.degree_qualification} />
                                    <DetailRow label="Supervisor" value={catalogItem.supervisor} />
                                    <DetailRow label="Date" value={catalogItem.thesis_date} />
                                    <DetailRow label="Period" value={catalogItem.thesis_period} />
                                    <DetailRow label="Publication Type" value={catalogItem.publication_type} />
                                </dl>
                                <hr className="mt-8 border-gray-200" />
                            </section>
                        )}
                    </div>
                )}

                {/* More Info Button */}
                {hasAnyMoreInfo && (
                    <div className="mt-6 flex justify-start">
                        <button
                            onClick={() => setShowMore(!showMore)}
                            className="group flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-100 active:scale-95"
                        >
                            {showMore ? (
                                <>
                                    SHOW LESS
                                    <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                                </>
                            ) : (
                                <>
                                    MORE INFO
                                    <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                                </>
                            )}
                        </button>
                    </div>
                )}
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
