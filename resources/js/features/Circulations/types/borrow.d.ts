// Borrow-related types for the Circulations feature

export interface CatalogItemCopy {
    id: number;
    copy_no: number;
    accession_no: string;
    status: string;
    branch?: string;
    location?: string;
    call_no?: string;
}

export interface CatalogItemFull {
    id: number;
    title: string;
    type: string;
    category?: { id: number; name: string };
    publisher?: { id: number; name: string };
    authors?: Array<{ id: number; name: string }>;
    year?: string;
    isbn?: string;
    isbn13?: string;
    call_no?: string;
    series?: string;
    subject?: string;
    edition?: string;
    volume?: string;
    place_of_publication?: string;
    location?: string;
    description?: string;
    cover_image?: string;
    copies?: CatalogItemCopy[];
    copies_count?: number;
    available_copies_count?: number;
    // Physical Details
    extent?: string;
    other_physical_details?: string;
    dimensions?: string;
    url?: string;
    // DETAIL fields
    page_duration?: string;
    abstract?: string;
    biblio_info?: string;
    url_visibility?: string;
    library_branch?: string;
    // JOURNAL fields
    issn?: string;
    frequency?: string;
    journal_type?: string;
    issue_type?: string;
    issue_period?: string;
    // THESIS fields
    granting_institution?: string;
    degree_qualification?: string;
    supervisor?: string;
    thesis_date?: string;
    thesis_period?: string;
    publication_type?: string;
}

export interface Author {
    id: number;
    name: string;
}

export interface Publisher {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface FilterOption {
    id: number;
    name: string;
}

export interface MemberValidation {
    isValid: boolean | null;
    isChecking: boolean;
    message: string;
    memberName?: string;
    borrowerCategory?: "Student" | "Faculty";
}

export type RightCardView = "list" | "details" | "copies";

export interface BorrowFormData {
    member_id: string;
    catalog_item_id: string;
    catalog_item_copy_id: string | number;
    full_name: string;
    email: string;
    quota: string;
    phone: string;
    address: string;
    return_date: string;
    return_time: string;
    notes: string;
}
