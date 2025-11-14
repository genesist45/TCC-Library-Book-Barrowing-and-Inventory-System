import { LayoutDashboard, Users, ScanBarcode, Mail } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
    name: string;
    href: string;
    icon: LucideIcon;
    active?: boolean;
    onClick?: () => void;
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
    ];
};

