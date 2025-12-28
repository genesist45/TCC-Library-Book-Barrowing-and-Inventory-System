import { LayoutDashboard, Users, ScanBarcode, Mail, LibraryBig, List, UserSquare2, Building2, Tags, RefreshCcw, UserCheck, BookCheck, Book, BarChart3 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
    name: string;
    href?: string;
    icon: LucideIcon;
    active?: boolean;
    onClick?: () => void;
    children?: {
        name: string;
        icon?: LucideIcon;
        href?: string;
        active?: boolean;
        onClick?: () => void;
    }[];
}

export const getAdminMenuItems = (currentRoute: string): MenuItem[] => {
    return [
        {
            name: 'Dashboard',
            href: 'dashboard',
            icon: LayoutDashboard,
            active: currentRoute === 'dashboard',
        },
        {
            name: 'Users',
            href: 'users.index',
            icon: Users,
            active: currentRoute === 'users.index' || currentRoute.startsWith('users.'),
        },
        {
            name: 'Circulations',
            icon: RefreshCcw,
            active: currentRoute.startsWith('admin.members.') || currentRoute.startsWith('admin.book-requests.') || currentRoute.startsWith('admin.book-returns.'),
            children: [
                {
                    name: 'Members',
                    icon: UserCheck,
                    href: 'admin.members.index',
                    active: currentRoute === 'admin.members.index' || currentRoute.startsWith('admin.members.'),
                },
                {
                    name: 'Book Requests',
                    icon: BookCheck,
                    href: 'admin.book-requests.index',
                    active: currentRoute === 'admin.book-requests.index' || currentRoute.startsWith('admin.book-requests.'),
                },
                {
                    name: 'Book Records',
                    icon: Book,
                    href: 'admin.book-returns.index',
                    active: currentRoute === 'admin.book-returns.index' || currentRoute.startsWith('admin.book-returns.'),
                },
            ],
        },
        {
            name: 'Catalog Items',
            href: 'admin.catalog-items.index',
            icon: LibraryBig,
            active: currentRoute.startsWith('admin.catalog-items.'),
        },
        {
            name: 'Reports',
            icon: BarChart3,
            active: currentRoute.startsWith('admin.reports.'),
            children: [
                {
                    name: 'Catalog Reports',
                    icon: LibraryBig,
                    href: 'admin.reports.catalog',
                    active: currentRoute === 'admin.reports.catalog',
                },
            ],
        }
    ];
};

