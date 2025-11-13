import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import logo from '@/assets/images/logos/tcc-logo.png';
import iconLogo from '@/assets/images/logos/tcc-icon.png';
import defaultUserImage from '@/assets/images/avatars/default-user.png';
import { getAdminMenuItems } from '@/components/menu/admin';
import { getStaffMenuItems } from '@/components/menu/staff';
import { Settings, LogOut, ChevronDown, Sparkles } from 'lucide-react';
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
    // Use showExpanded to determine visual state, but keep collapsed for layout purposes
    const isVisuallyExpanded = showExpanded;
    const menuItems = user.role === 'admin' 
        ? getAdminMenuItems(currentRoute) 
        : getStaffMenuItems(currentRoute);
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
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
        <aside 
            className={`group fixed left-0 top-0 h-screen overflow-x-hidden sidebar-no-scrollbar bg-gradient-to-b from-white via-white to-gray-50/50 border-r border-gray-200/80 backdrop-blur-xl transition-all duration-300 ease-in-out dark:from-[#1a1a1a] dark:via-[#1f1f1f] dark:to-[#252525] dark:border-[#2a2a2a] ${
                isVisuallyExpanded ? 'w-64 shadow-xl shadow-gray-200/50 dark:shadow-black/30' : 'w-20 shadow-lg'
            } ${collapsed && isVisuallyExpanded ? 'z-50' : 'z-40'}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="flex h-full flex-col">
                {/* Logo Section with Gradient Glow */}
                <div className="relative flex h-16 items-center justify-center overflow-hidden px-4 transition-all duration-300 ease-in-out">
                    {/* Gradient Accent Bar */}
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-in-out ${
                        isVisuallyExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`} />
                    
                    {/* Full Logo */}
                    <img
                        src={logo}
                        alt="TCC Logo"
                        className={`absolute h-11 w-auto object-contain transition-all duration-300 ease-in-out ${
                            isVisuallyExpanded 
                                ? 'opacity-100 scale-100 filter drop-shadow-lg' 
                                : 'opacity-0 scale-90 pointer-events-none'
                        }`}
                    />
                    {/* Icon Logo */}
                    <img
                        src={iconLogo}
                        alt="TCC Icon"
                        className={`absolute h-10 w-10 object-contain transition-all duration-300 ease-in-out ${
                            !isVisuallyExpanded 
                                ? 'opacity-100 scale-100 filter drop-shadow-md' 
                                : 'opacity-0 scale-90 pointer-events-none'
                        }`}
                    />
                </div>

                {/* Menu Section */}
                <nav className={`flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden py-6 px-3 transition-all duration-300 ease-in-out`}>
                    <p className={`mb-4 px-3 text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent transition-all duration-300 ease-in-out dark:from-gray-300 dark:to-gray-500 ${
                        isVisuallyExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 h-0 pointer-events-none'
                    }`}>
                        Navigation
                    </p>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={route(item.href)}
                                className={`
                                    group/item relative flex items-center rounded-xl text-sm transition-all duration-300 ease-in-out py-3
                                    ${
                                        item.active
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20'
                                            : 'text-gray-700 font-medium hover:bg-gray-100/80 hover:scale-[1.02] dark:text-gray-200 dark:hover:bg-white/5'
                                    }
                                `}
                                title={!isVisuallyExpanded ? item.name : undefined}
                            >
                                {/* Active Indicator */}
                                {item.active && (
                                    <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white shadow-lg animate-pulse" />
                                )}
                                
                                <div className="flex w-14 flex-shrink-0 items-center justify-center">
                                    <Icon
                                        size={20}
                                        className={`transition-all duration-300 ease-in-out group-hover/item:scale-110 ${
                                            item.active ? 'drop-shadow-md' : ''
                                        }`}
                                        strokeWidth={item.active ? 2.5 : 2}
                                    />
                                </div>
                                <span className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
                                    isVisuallyExpanded 
                                        ? 'opacity-100 translate-x-0 relative' 
                                        : 'opacity-0 absolute w-0 overflow-hidden pointer-events-none'
                                }`}>{item.name}</span>
                                
                                {/* Hover Glow Effect */}
                                {!item.active && (
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 opacity-0 transition-opacity duration-300 group-hover/item:opacity-10" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sticky Footer - Account Section */}
                <div className="relative px-3 pb-4 pt-2 transition-all duration-300 ease-in-out">
                    {/* Divider with Gradient */}
                    <div className="mb-3 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
                    
                    {/* Account Dropdown Menu */}
                    {showAccountDropdown && (
                        <>
                            {/* Backdrop */}
                            <div 
                                className="fixed inset-0 z-40 bg-black/5 backdrop-blur-sm" 
                                onClick={() => setShowAccountDropdown(false)}
                            />
                            
                            {/* Dropdown Content */}
                            <div className="absolute bottom-full left-3 right-3 z-50 mb-2">
                                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-[#2a2a2a] dark:bg-[#1f1f1f]/95 animate-in slide-in-from-bottom-2 duration-200">
                                    {/* User Info Block */}
                                    <div className="flex items-center gap-3 bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-3 dark:from-blue-950/20 dark:to-purple-950/20">
                                        <div className="relative h-10 w-10 flex-shrink-0">
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-75 blur-md" />
                                            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/80 dark:border-gray-700/80">
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
                                        <div className="flex-1 overflow-hidden">
                                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {user.first_name} {user.last_name}
                                            </p>
                                            <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Sparkles size={16} className="flex-shrink-0 text-purple-500 animate-pulse" />
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-1.5">
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-all hover:bg-gray-100/80 hover:pl-5 dark:text-gray-200 dark:hover:bg-white/5"
                                            onClick={() => setShowAccountDropdown(false)}
                                        >
                                            <Settings size={18} className="text-gray-500 dark:text-gray-400" />
                                            <span className="font-medium">Account Settings</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setShowAccountDropdown(false);
                                                setShowLogoutModal(true);
                                            }}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-all hover:bg-red-50/80 hover:pl-5 dark:text-red-400 dark:hover:bg-red-950/20"
                                        >
                                            <LogOut size={18} />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Account Button */}
                    <button
                        onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                        className={`relative flex w-full items-center overflow-hidden rounded-xl py-2.5 text-sm font-medium transition-all duration-300 ease-in-out hover:scale-[1.02] ${
                            showAccountDropdown 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30' 
                                : 'bg-gray-100/50 text-gray-700 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10'
                        }`}
                        title={!isVisuallyExpanded ? user.name : undefined}
                    >
                        <div className="flex w-14 flex-shrink-0 items-center justify-center">
                            <div className="relative h-9 w-9">
                                <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-50 blur-md transition-opacity duration-300 ${
                                    showAccountDropdown ? 'opacity-100' : 'opacity-0'
                                }`} />
                                <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white/50 transition-all duration-300 ease-in-out dark:border-gray-600/50">
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
                        </div>
                        <div className={`flex flex-1 min-w-0 items-center justify-between overflow-hidden transition-all duration-300 ease-in-out pr-3 ${
                            isVisuallyExpanded 
                                ? 'opacity-100 translate-x-0 relative' 
                                : 'opacity-0 absolute w-0 pointer-events-none'
                        }`}>
                            <span className="truncate text-sm font-semibold">
                                {user.first_name} {user.last_name}
                            </span>
                            <ChevronDown 
                                size={16} 
                                className={`flex-shrink-0 transition-transform duration-300 ${
                                    showAccountDropdown ? 'rotate-180' : ''
                                }`} 
                            />
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

