import Dropdown from '@/components/common/Dropdown';
import { Menu, X, PanelLeftClose, PanelLeft, Bell, Bot, ChevronDown, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import AIChatSidebar from '@/components/sidebars/AIChatSidebar';
import ConfirmModal from '@/components/modals/ConfirmModal';
import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import defaultUserImage from '@/assets/images/avatars/default-user.png';

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
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleLogout = () => {
        setProcessing(true);
        router.post(route('logout'), {}, {
            onFinish: () => {
                setProcessing(false);
                setShowLogoutModal(false);
            },
        });
    };

    return (
        <>
        <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-1.5">
                {/* Left side - Hamburger Menu */}
                <div className="flex items-center">
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

                    {/* Profile Dropdown - Mobile Only */}
                    <div className="relative lg:hidden">
                        <button
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="flex items-center gap-2 rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:bg-[#3a3a3a] dark:hover:text-gray-200"
                            title="Profile"
                            aria-label="Profile"
                        >
                            <div className="h-7 w-7 overflow-hidden rounded-full border-2 border-gray-300 dark:border-[#3a3a3a]">
                                {user.profile_picture ? (
                                    <img
                                        src={`/storage/${user.profile_picture}`}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={defaultUserImage}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>
                            <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                        </button>

                        {/* Profile Dropdown Menu */}
                        {showProfileDropdown && (
                            <>
                                {/* Backdrop */}
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setShowProfileDropdown(false)}
                                />
                                
                                {/* Dropdown Content */}
                                <div className="absolute right-0 top-full z-50 mt-2 w-64">
                                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                                        {/* User Info Block */}
                                        <div className="flex items-center gap-3 px-3 py-3">
                                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-300 dark:border-[#3a3a3a]">
                                                {user.profile_picture ? (
                                                    <img
                                                        src={`/storage/${user.profile_picture}`}
                                                        alt={user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={defaultUserImage}
                                                        alt={user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {user.first_name} {user.last_name}
                                                </p>
                                                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="border-t border-gray-100 py-1 dark:border-[#3a3a3a]/50">
                                            <Link
                                                href={route('profile.edit')}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-[#3a3a3a]"
                                                onClick={() => setShowProfileDropdown(false)}
                                            >
                                                <Settings size={18} className="text-gray-500 dark:text-gray-400" />
                                                <span>Account Settings</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setShowProfileDropdown(false);
                                                    setShowLogoutModal(true);
                                                }}
                                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-[#3a3a3a]"
                                            >
                                                <LogOut size={18} className="text-gray-500 dark:text-gray-400" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>

        {/* AI Chat Sidebar */}
        <AIChatSidebar
            isOpen={showAIChatSidebar}
            onClose={() => setShowAIChatSidebar(false)}
            user={user}
        />

        {/* Logout Confirmation Modal */}
        <ConfirmModal
            show={showLogoutModal}
            title="Log Out"
            message="Are you sure you want to log out? You will need to sign in again to access your account."
            confirmText="Log Out"
            cancelText="Cancel"
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutModal(false)}
            processing={processing}
        />
        </>
    );
}

