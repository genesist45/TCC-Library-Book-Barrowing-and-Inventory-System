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

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
