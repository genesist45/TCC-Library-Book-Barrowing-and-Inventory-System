import { LayoutDashboard, Users, ScanBarcode, Mail, LibraryBig, List, UserSquare2, Building2, Tags, RefreshCcw, UserCheck, BookCheck, Book, BookOpen } from 'lucide-react';
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
            name: 'Book Catalog',
            icon: BookOpen,
            href: 'admin.book-catalog',
            active: currentRoute === 'admin.book-catalog',
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
                    name: 'Book Returns',
                    icon: Book,
                    href: 'admin.book-returns.index',
                    active: currentRoute === 'admin.book-returns.index' || currentRoute.startsWith('admin.book-returns.'),
                },
            ],
        },
        {
            name: 'Catalogs',
            icon: LibraryBig,
            active: currentRoute.startsWith('admin.catalog-items.') || currentRoute.startsWith('admin.authors.') || currentRoute.startsWith('admin.publishers.') || currentRoute.startsWith('admin.categories.'),
            children: [
                {
                    name: 'Catalog Items',
                    icon: List,
                    href: 'admin.catalog-items.index',
                    active: currentRoute === 'admin.catalog-items.index' || currentRoute.startsWith('admin.catalog-items.'),
                },
                {
                    name: 'Authors',
                    icon: UserSquare2,
                    href: 'admin.authors.index',
                    active: currentRoute === 'admin.authors.index' || currentRoute.startsWith('admin.authors.'),
                },
                {
                    name: 'Publishers',
                    icon: Building2,
                    href: 'admin.publishers.index',
                    active: currentRoute === 'admin.publishers.index' || currentRoute.startsWith('admin.publishers.'),
                },
                {
                    name: 'Categories',
                    icon: Tags,
                    href: 'admin.categories.index',
                    active: currentRoute === 'admin.categories.index' || currentRoute.startsWith('admin.categories.'),
                },
            ],
        }
    ];
};

