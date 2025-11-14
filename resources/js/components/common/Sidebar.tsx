import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import logo from '@/assets/images/logos/tcc-logo.png';
import iconLogo from '@/assets/images/logos/tcc-icon.png';
import defaultUserImage from '@/assets/images/avatars/default-user.png';
import { getAdminMenuItems } from '@/components/menu/admin';
import { getStaffMenuItems } from '@/components/menu/staff';
import { Settings, LogOut, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/modals/ConfirmModal';

interface SidebarProps {
    currentRoute: string;
    collapsed: boolean;
    showExpanded?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    user: {
        first_name: string;
        last_name: string;
        name: string;
        email: string;
        role: 'admin' | 'staff';
        profile_picture?: string;
    };
}

export default function Sidebar({ 
    currentRoute, 
    collapsed, 
    showExpanded = false,
    onMouseEnter,
    onMouseLeave,
    user 
}: SidebarProps) {
    const isVisuallyExpanded = showExpanded;
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const menuItems = user.role === 'admin' 
        ? getAdminMenuItems(currentRoute) 
        : getStaffMenuItems(currentRoute);

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
        <aside 
            className={`fixed left-0 top-0 h-screen overflow-x-hidden sidebar-no-scrollbar bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out dark:bg-[#2a2a2a] dark:border-[#3a3a3a] dark:shadow-black/50 ${
                isVisuallyExpanded ? 'w-64' : 'w-20'
            } ${collapsed && isVisuallyExpanded ? 'z-50' : 'z-40'}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="flex h-full flex-col">
                {/* Logo Section */}
                <div className="relative flex h-14 items-center justify-center overflow-hidden px-3 transition-all duration-300 ease-in-out">
                    {/* Full Logo - Shows when expanded */}
                    <img
                        src={logo}
                        alt="TCC Logo"
                        className={`absolute h-10 w-auto object-contain transition-all duration-200 ease-in-out ${
                            isVisuallyExpanded 
                                ? 'opacity-100 scale-100' 
                                : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                    />
                    {/* Icon Logo - Shows when collapsed */}
                    <img
                        src={iconLogo}
                        alt="TCC Icon"
                        className={`absolute h-9 w-9 object-contain transition-all duration-200 ease-in-out ${
                            !isVisuallyExpanded 
                                ? 'opacity-100 scale-100' 
                                : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                    />
                </div>

                {/* Divider - Full width, aligned with header bottom */}
                <hr className="border-gray-200 transition-colors duration-300 dark:border-[#3a3a3a]" />

                {/* Menu Section */}
                <nav className={`flex-1 space-y-1 overflow-y-auto overflow-x-hidden py-4 px-3 scrollbar-hide transition-all duration-300 ease-in-out ${
                    !isVisuallyExpanded ? '-translate-y-8' : 'translate-y-0'
                }`}>
                    <p className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500 transition-all duration-300 ease-in-out dark:text-gray-400 ${
                        isVisuallyExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}>
                        Menu
                    </p>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const MenuComponent = item.onClick ? 'button' : Link;
                        const menuProps = item.onClick 
                            ? { 
                                onClick: (e: React.MouseEvent) => {
                                    e.preventDefault();
                                    item.onClick?.();
                                },
                                type: 'button' as const,
                              }
                            : { href: route(item.href) };

                        return (
                            <MenuComponent
                                key={item.name}
                                {...menuProps}
                                className={`
                                    group relative flex items-center rounded-lg text-sm transition-all duration-300 ease-in-out py-2.5 w-full
                                    ${
                                        item.active
                                            ? 'bg-gray-100 text-black font-bold dark:bg-[#3a3a3a] dark:text-gray-100'
                                            : 'text-gray-700 font-normal hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-[#3a3a3a]'
                                    }
                                `}
                                title={!isVisuallyExpanded ? item.name : undefined}
                            >
                                <div className="flex w-14 flex-shrink-0 items-center justify-center">
                                    <Icon
                                        size={20}
                                        className="transition-all duration-300 ease-in-out group-hover:scale-110"
                                    />
                                </div>
                                <span className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
                                    isVisuallyExpanded 
                                        ? 'opacity-100 translate-x-0 relative' 
                                        : 'opacity-0 absolute w-0 overflow-hidden pointer-events-none'
                                }`}>{item.name}</span>
                            </MenuComponent>
                        );
                    })}
                </nav>

                {/* Sticky Footer - Account Section - Desktop Only */}
                <div className="relative hidden px-3 pb-3 pt-1 transition-all duration-300 ease-in-out lg:block">
                    {/* Account Dropdown Menu - Opens Upward */}
                    {showAccountDropdown && (
                        <>
                            {/* Backdrop */}
                            <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setShowAccountDropdown(false)}
                            />
                            
                            {/* Dropdown Content */}
                            <div className="absolute bottom-full left-3 right-3 z-50 mb-1">
                                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                                    {/* User Info Block */}
                                    <div className="flex items-center gap-3 px-3 py-2">
                                        <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-300 dark:border-[#3a3a3a]">
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
                                            onClick={() => setShowAccountDropdown(false)}
                                        >
                                            <Settings size={18} className="text-gray-500 dark:text-gray-400" />
                                            <span>Account Settings</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setShowAccountDropdown(false);
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

                    {/* Account Button */}
                    <button
                        onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                        className="relative flex w-full items-center overflow-hidden rounded-lg py-2 text-sm font-medium text-gray-700 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#3a3a3a]/60"
                        title={!isVisuallyExpanded ? user.name : undefined}
                    >
                        <div className="flex w-14 flex-shrink-0 items-center justify-center">
                            <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-gray-300 transition-all duration-300 ease-in-out dark:border-[#3a3a3a]">
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
                        </div>
                        <div className={`flex flex-1 min-w-0 items-center justify-between overflow-hidden transition-all duration-300 ease-in-out ${
                            isVisuallyExpanded 
                                ? 'opacity-100 translate-x-0 relative' 
                                : 'opacity-0 absolute w-0 pointer-events-none'
                        }`}>
                            <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-100">
                                {user.first_name} {user.last_name}
                            </span>
                            <ChevronsUpDown size={16} className="flex-shrink-0 text-gray-500 dark:text-gray-400" />
                        </div>
                    </button>
                </div>
            </div>
        </aside>

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