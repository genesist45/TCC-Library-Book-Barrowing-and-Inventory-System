import { BreadcrumbItem } from '@/components/common/Breadcrumbs';

/**
 * Generate breadcrumb items based on current route
 * This is a utility to automatically create breadcrumbs from route names
 */
export function generateBreadcrumbs(currentRoute: string, userRole?: string): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];

    // Dashboard
    if (currentRoute === 'dashboard') {
        const dashboardLabel = userRole === 'admin' ? 'Admin Dashboard' :
            userRole === 'staff' ? 'Staff Dashboard' : 'Dashboard';
        return [{ label: dashboardLabel, active: true }];
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

    // Members routes
    if (currentRoute.startsWith('admin.members')) {
        breadcrumbs.push({ label: 'Members', href: route('admin.members.index') });

        if (currentRoute === 'admin.members.create') {
            breadcrumbs.push({ label: 'Add New Member', active: true });
        } else if (currentRoute === 'admin.members.edit') {
            breadcrumbs.push({ label: 'Edit Member', active: true });
        } else if (currentRoute === 'admin.members.show') {
            breadcrumbs.push({ label: 'View Member', active: true });
        } else {
            breadcrumbs[breadcrumbs.length - 1].active = true;
        }

        return breadcrumbs;
    }

    // Book Requests routes
    if (currentRoute.startsWith('admin.book-requests')) {
        breadcrumbs.push({ label: 'Book Requests', href: route('admin.book-requests.index') });

        if (currentRoute === 'admin.book-requests.edit') {
            breadcrumbs.push({ label: 'Edit Request', active: true });
        } else if (currentRoute === 'admin.book-requests.show') {
            breadcrumbs.push({ label: 'View Request', active: true });
        } else if (currentRoute === 'admin.book-requests.borrow-catalog') {
            breadcrumbs.push({ label: 'Select a Book to Borrow', active: true });
        } else if (currentRoute === 'admin.book-requests.available-copies') {
            breadcrumbs.push({ label: 'Select a Book to Borrow', href: route('admin.book-requests.borrow-catalog') });
            breadcrumbs.push({ label: 'Item Details', active: true });
        } else {
            breadcrumbs[breadcrumbs.length - 1].active = true;
        }

        return breadcrumbs;
    }

    // Book Records routes
    if (currentRoute.startsWith('admin.book-returns')) {
        breadcrumbs.push({ label: 'Book Records', active: true });
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

    // Email Reminder routes
    if (currentRoute.startsWith('email-reminder')) {
        return [{ label: 'Email Reminder', active: true }];
    }

    // Reports routes
    if (currentRoute.startsWith('admin.reports')) {
        if (currentRoute === 'admin.reports.catalog') {
            breadcrumbs.push({ label: 'Catalog Reports', active: true });
        } else if (currentRoute === 'admin.reports.circulation') {
            breadcrumbs.push({ label: 'Circulation Reports', active: true });
        } else if (currentRoute === 'admin.reports.overdue') {
            breadcrumbs.push({ label: 'Overdue Reports', active: true });
        }
        return breadcrumbs;
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

