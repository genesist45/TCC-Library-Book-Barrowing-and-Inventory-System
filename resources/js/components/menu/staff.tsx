import { LayoutDashboard } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
    name: string;
    href: string;
    icon: LucideIcon;
    active?: boolean;
}

export const getStaffMenuItems = (currentRoute: string): MenuItem[] => {
    return [
        {
            name: 'Dashboard',
            href: 'dashboard',
            icon: LayoutDashboard,
            active: currentRoute === 'dashboard',
        },
    ];
};


