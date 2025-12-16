export interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string; // Full name accessor
    email: string;
    role: "admin" | "staff";
    email_verified_at?: string;
    profile_picture?: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
}

export interface Publisher {
    id: number;
    name: string;
    website?: string;
    is_active: boolean;
}

export interface Author {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    bio?: string;
    is_active: boolean;
}

export interface CatalogItemCopy {
    id: number;
    catalog_item_id: number;
    accession_no: string;
    copy_no: number;
    branch?: string;
    location?: string;
    status: "Available" | "Borrowed" | "Reserved" | "Lost" | "Under Repair" | "Paid" | "Pending";
    reserved_by_member_id?: number | null;
    reserved_by_member?: {
        id: number;
        name: string;
        member_no: string;
        type?: string;
    } | null;
    reserved_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface CatalogItem {
    volume: string;
    id: number;
    accession_no?: string; // Deprecated: accession numbers belong to copies only
    title: string;
    type: string;
    category_id?: number;
    category?: Category;
    publisher_id?: number;
    publisher?: Publisher;
    isbn?: string;
    isbn13?: string;
    call_no?: string;
    subject?: string;
    series?: string;
    edition?: string;
    year?: string;
    place_of_publication?: string;
    extent?: string;
    other_physical_details?: string;
    dimensions?: string;
    location?: string;
    url?: string;
    description?: string;
    cover_image?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    authors?: Author[];
    copies?: CatalogItemCopy[];
    copies_count?: number;
    available_copies_count?: number;
    // DETAIL fields
    volume?: string;
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

export interface Member {
    id: number;
    member_no: string;
    name: string;
    type: "Regular" | "Privileged";
    borrower_category: "Student" | "Faculty";
    status: "Active" | "Inactive" | "Suspended";
    email?: string;
    phone?: string;
    address?: string;
    booking_quota?: number;
    member_group?: string;
    allow_login: boolean;
    created_at: string;
    updated_at: string;
}

export interface BookRequest {
    id: number;
    member_id: number;
    catalog_item_id: number;
    catalog_item_copy_id?: number;
    full_name: string;
    email: string;
    quota?: number;
    phone?: string;
    address?: string;
    return_date: string;
    return_time: string;
    notes?: string;
    status: "Pending" | "Approved" | "Disapproved" | "Returned";
    created_at: string;
    updated_at: string;
    member?: Member;
    catalogItem?: CatalogItem;
    catalog_item?: CatalogItem;
    catalogItemCopy?: CatalogItemCopy;
    catalog_item_copy?: CatalogItemCopy;
    book_return?: BookReturn;
}

export interface BookReturn {
    id: number;
    book_request_id: number;
    member_id: number;
    catalog_item_id: number;
    return_date: string;
    return_time: string;
    condition_on_return: "Good" | "Damaged" | "Lost";
    remarks?: string;
    penalty_amount: number;
    status: "Returned" | "Pending" | "Paid";
    processed_by: number;
    created_at: string;
    member?: {
        id: number;
        name: string;
        member_no: string;
    };
    catalog_item?: {
        id: number;
        title: string;
    };
    book_request?: {
        id: number;
        catalog_item_copy?: {
            accession_no: string;
            copy_no: number;
        };
    };
    processor?: {
        id: number;
        name: string;
    };
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
