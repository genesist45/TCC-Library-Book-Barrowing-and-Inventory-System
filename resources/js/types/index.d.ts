export interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string; // Full name accessor
    email: string;
    role: 'admin' | 'staff';
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

export interface CatalogItem {
    id: number;
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
    url?: string;
    description?: string;
    cover_image?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    authors?: Author[];
}

export interface Member {
    id: number;
    member_no: string;
    name: string;
    type: 'Regular' | 'Privileged';
    status: 'Active' | 'Inactive' | 'Suspended';
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
    full_name: string;
    email: string;
    quota?: number;
    phone?: string;
    address?: string;
    return_date: string;
    return_time: string;
    notes?: string;
    status: 'Pending' | 'Approved' | 'Disapproved';
    created_at: string;
    updated_at: string;
    member?: Member;
    catalogItem?: CatalogItem;
    catalog_item?: CatalogItem;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
