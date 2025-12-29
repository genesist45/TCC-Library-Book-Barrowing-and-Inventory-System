/**
 * Authors Feature Types
 */

export interface Author {
    id: number;
    name: string;
    country: string;
    bio?: string;
    is_published: boolean;
    items_count: number;
    created_at: string;
}

export interface AuthorFormData {
    name: string;
    country: string;
    bio?: string;
    is_published: boolean;
}
