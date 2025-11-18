import { LayoutDashboard, Users, ScanBarcode, Mail, LibraryBig, List, UserSquare2, Building2, Tags, RefreshCcw, UserCheck } from 'lucide-react';
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
            active: false,
            children: [
                {
                    name: 'Members',
                    icon: UserCheck,
                    href: 'admin.members.index',
                },
            ],
        },
        {
            name: 'QR Scanner',
            href: 'qr-scanner',
            icon: ScanBarcode,
            active: currentRoute === 'qr-scanner',
        },
        {
            name: 'Email Reminder',
            href: 'email-reminder',
            icon: Mail,
            active: currentRoute === 'email-reminder' || currentRoute.startsWith('email-reminder.'),
        },
        {
            name: 'Catalogs',
            icon: LibraryBig,
            active: false,
            children: [
                {
                    name: 'Catalog Items',
                    icon: List,
                    href: 'admin.catalog-items.index',
                },
                {
                    name: 'Authors',
                    icon: UserSquare2,
                    href: 'admin.authors.index',
                },
                {
                    name: 'Publishers',
                    icon: Building2,
                    href: 'admin.publishers.index',
                },
                {
                    name: 'Categories',
                    icon: Tags,
                    href: 'admin.categories.index',
                },
            ],
        },
    ];
};

