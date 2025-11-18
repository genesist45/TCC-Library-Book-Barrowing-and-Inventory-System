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
    if (currentRoute.startsWith('users')) {
        breadcrumbs.push({ label: 'Users', active: true });
        return breadcrumbs;
    }

    // Authors routes
    if (currentRoute.startsWith('admin.authors')) {
        breadcrumbs.push({ label: 'Authors', active: true });
        return breadcrumbs;
    }

    // Categories routes
    if (currentRoute.startsWith('admin.categories')) {
        breadcrumbs.push({ label: 'Categories', active: true });
        return breadcrumbs;
    }

    // Publishers routes
    if (currentRoute.startsWith('admin.publishers')) {
        breadcrumbs.push({ label: 'Publishers', active: true });
        return breadcrumbs;
    }

    // Catalog Items routes
    if (currentRoute.startsWith('admin.catalog-items')) {
        breadcrumbs.push({ label: 'Catalog Items', href: route('admin.catalog-items.index') });

        if (currentRoute === 'admin.catalog-items.create') {
            breadcrumbs.push({ label: 'Add New Item', active: true });
        } else if (currentRoute === 'admin.catalog-items.edit') {
            breadcrumbs.push({ label: 'Edit Item', active: true });
        } else if (currentRoute === 'admin.catalog-items.show') {
            breadcrumbs.push({ label: 'View Item', active: true });
        } else {
            breadcrumbs[breadcrumbs.length - 1].active = true;
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

