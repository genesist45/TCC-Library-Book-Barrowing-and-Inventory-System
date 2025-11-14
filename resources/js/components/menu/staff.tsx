import { LayoutDashboard, Bot } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
    name: string;
    href: string;
    icon: LucideIcon;
    active?: boolean;
    onClick?: () => void;
}

export const getStaffMenuItems = (currentRoute: string, onAIAssistantClick?: () => void): MenuItem[] => {
    return [
        {
            name: 'Dashboard',
            href: 'dashboard',
            icon: LayoutDashboard,
            active: currentRoute === 'dashboard',
        },
        {
            name: 'AI Assistant',
            href: '#',
            icon: Bot,
            active: false,
            onClick: onAIAssistantClick,
        },
    ];
};


