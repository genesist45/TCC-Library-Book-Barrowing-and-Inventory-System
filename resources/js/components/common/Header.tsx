import Dropdown from '@/components/common/Dropdown';
import { Menu, X, PanelLeftClose, PanelLeft, Bell, Bot } from 'lucide-react';
import { useState } from 'react';
import AIChatSidebar from '@/components/sidebars/AIChatSidebar';

interface HeaderProps {
    currentRoute: string;
    showingMobileSidebar: boolean;
    sidebarCollapsed: boolean;
    onToggleMobileSidebar: () => void;
    onToggleSidebar: () => void;
    user: {
        first_name: string;
        last_name: string;
        name: string;
        email: string;
        role: 'admin' | 'staff';
        profile_picture?: string;
    };
}

export default function Header({
    currentRoute,
    showingMobileSidebar,
    sidebarCollapsed,
    onToggleMobileSidebar,
    onToggleSidebar,
    user,
}: HeaderProps) {
    const [showAIChatSidebar, setShowAIChatSidebar] = useState(false);

    return (
        <>
        <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-1.5">
                {/* Left side - Hamburger Menu */}
                <div className="flex items-center">
                    {/* Desktop sidebar toggle */}
                    <button
                        onClick={onToggleSidebar}
                        className="hidden rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:bg-[#3a3a3a] dark:hover:text-gray-200 lg:block"
                        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {sidebarCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
                    </button>

                    {/* Mobile menu button */}
                    <button
                        onClick={onToggleMobileSidebar}
                        className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:bg-[#3a3a3a] dark:hover:text-gray-200 lg:hidden"
                    >
                        {showingMobileSidebar ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-1">
                    {/* AI Assistant */}
                    <button
                        type="button"
                        onClick={() => setShowAIChatSidebar(true)}
                        className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:bg-[#3a3a3a] dark:hover:text-gray-200"
                        title="AI Assistant"
                        aria-label="AI Assistant"
                    >
                        <Bot size={20} />
                    </button>

                    {/* Notification Bell */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                type="button"
                                className="relative rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:bg-[#3a3a3a] dark:hover:text-gray-200"
                                title="Notifications"
                                aria-label="Notifications"
                            >
                                <Bell size={20} />
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <div className="px-4 py-4 text-center">
                                <Bell size={32} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                            </div>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>
        </nav>

        {/* AI Chat Sidebar */}
        <AIChatSidebar
            isOpen={showAIChatSidebar}
            onClose={() => setShowAIChatSidebar(false)}
            user={user}
        />
        </>
    );
}

