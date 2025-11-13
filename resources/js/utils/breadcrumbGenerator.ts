import { BreadcrumbItem } from '@/components/common/Breadcrumbs';

/**
 * Generate breadcrumb items based on current route
 * This is a utility to automatically create breadcrumbs from route names
 */
export function generateBreadcrumbs(currentRoute: string): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];

    // Dashboard
    if (currentRoute === 'dashboard') {
        return [{ label: 'Dashboard', active: true }];
    }

    // Users routes (admin only)
    if (currentRoute.startsWith('users.')) {
        breadcrumbs.push({ label: 'Users', href: route('users.index') });

        if (currentRoute === 'users.index') {
            breadcrumbs[breadcrumbs.length - 1].active = true;
        } else if (currentRoute === 'users.create') {
            breadcrumbs.push({ label: 'Create User', active: true });
        } else if (currentRoute === 'users.edit') {
            breadcrumbs.push({ label: 'Edit User', active: true });
        } else if (currentRoute === 'users.show') {
            breadcrumbs.push({ label: 'View User', active: true });
        }

        return breadcrumbs;
    }

    // Books routes
    if (currentRoute.startsWith('books.')) {
        breadcrumbs.push({ label: 'Books', href: route('books.index') });

        if (currentRoute === 'books.index') {
            breadcrumbs[breadcrumbs.length - 1].active = true;
        } else if (currentRoute === 'books.create') {
            breadcrumbs.push({ label: 'Add Book', active: true });
        } else if (currentRoute === 'books.edit') {
            breadcrumbs.push({ label: 'Edit Book', active: true });
        } else if (currentRoute === 'books.show') {
            breadcrumbs.push({ label: 'Book Details', active: true });
        }

        return breadcrumbs;
    }

    // Borrowings routes
    if (currentRoute.startsWith('borrowings.')) {
        breadcrumbs.push({ label: 'Borrowings', href: route('borrowings.index') });

        if (currentRoute === 'borrowings.index') {
            breadcrumbs[breadcrumbs.length - 1].active = true;
        } else if (currentRoute === 'borrowings.create') {
            breadcrumbs.push({ label: 'New Borrowing', active: true });
        } else if (currentRoute === 'borrowings.show') {
            breadcrumbs.push({ label: 'Borrowing Details', active: true });
        }

        return breadcrumbs;
    }

    // Profile routes
    if (currentRoute.startsWith('profile.')) {
        breadcrumbs.push({ label: 'Profile', active: true });
        return breadcrumbs;
    }

    // QR Scanner route
    if (currentRoute === 'qr-scanner') {
        return [{ label: 'QR Scanner', active: true }];
    }

    // Email Reminder routes
    if (currentRoute.startsWith('email-reminder')) {
        return [{ label: 'Email Reminder', active: true }];
    }

    // Default fallback
    return [];
}

/**
 * Custom breadcrumb builder for specific pages
 * Use this when you need custom breadcrumb logic
 */
export function buildCustomBreadcrumbs(items: BreadcrumbItem[]): BreadcrumbItem[] {
    return items;
}

