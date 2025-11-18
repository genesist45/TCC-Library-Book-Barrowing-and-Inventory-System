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

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
