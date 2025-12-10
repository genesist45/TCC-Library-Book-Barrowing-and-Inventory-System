import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import logo from '@/assets/images/logos/tcc-logo.png';
import iconLogo from '@/assets/images/logos/tcc-icon.png';
import defaultUserImage from '@/assets/images/avatars/default-user.png';
import { getAdminMenuItems, MenuItem } from '@/components/menu/admin';
import { getStaffMenuItems } from '@/components/menu/staff';
import { Settings, LogOut, ChevronsUpDown, ChevronRight, ChevronDown, PanelLeft, PanelLeftClose } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ConfirmModal from '@/components/modals/ConfirmModal';

interface SidebarProps {
    currentRoute: string;
    collapsed: boolean;
    showExpanded?: boolean;
    onToggle?: () => void;
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
    onToggle,
    user
}: SidebarProps) {
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Initialize expanded menus from localStorage
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarExpandedMenus');
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    });

    // Persist expanded menus state
    useEffect(() => {
        localStorage.setItem('sidebarExpandedMenus', JSON.stringify(expandedMenus));
    }, [expandedMenus]);

    // Floating menu state
    const [hoveredMenu, setHoveredMenu] = useState<{ name: string; top: number; children: MenuItem['children'] } | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isVisuallyExpanded = showExpanded;

    const menuItems = user.role === 'admin'
        ? getAdminMenuItems(currentRoute)
        : getStaffMenuItems(currentRoute);

    const handleMouseEnter = (item: MenuItem, e: React.MouseEvent) => {
        if (!isVisuallyExpanded && item.children && item.children.length > 0) {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            const rect = e.currentTarget.getBoundingClientRect();
            setHoveredMenu({
                name: item.name,
                top: rect.top,
                children: item.children
            });
        }
    };

    const handleMouseLeave = () => {
        if (!isVisuallyExpanded) {
            hoverTimeoutRef.current = setTimeout(() => {
                setHoveredMenu(null);
            }, 100);
        }
    };

    const handleFloatingMenuEnter = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };

    const handleFloatingMenuLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredMenu(null);
        }, 100);
    };

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
                className={`fixed left-0 top-0 h-screen overflow-x-hidden sidebar-no-scrollbar bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out dark:bg-[#2a2a2a] dark:border-[#3a3a3a] dark:shadow-black/50 ${isVisuallyExpanded ? 'w-64' : 'w-20'
                    } ${collapsed && isVisuallyExpanded ? 'z-50' : 'z-40'}`}
            >
                <div className="flex h-full flex-col">
                    {/* Logo Section */}
                    <div className="relative flex h-14 flex-shrink-0 items-center justify-center px-3">
                        {/* Expanded State: Full Logo + Close Button */}
                        <div className={`absolute inset-0 flex items-center justify-between px-4 transition-all duration-300 ease-in-out ${isVisuallyExpanded ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                            }`}>
                            <img
                                src={logo}
                                alt="TCC Logo"
                                className="h-10 w-auto object-contain"
                            />
                            <button
                                onClick={onToggle}
                                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#3a3a3a]"
                            >
                                <PanelLeftClose size={20} />
                            </button>
                        </div>

                        {/* Collapsed State: Toggle Button (Logo -> Hamburger) */}
                        <div className={`transition-all duration-300 ease-in-out ${!isVisuallyExpanded ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-90 pointer-events-none absolute'
                            }`}>
                            <button
                                onClick={onToggle}
                                className="group relative flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-[#3a3a3a]"
                                style={{ cursor: 'ew-resize' }}
                            >
                                <img
                                    src={iconLogo}
                                    alt="TCC"
                                    className="absolute h-9 w-9 object-contain transition-opacity duration-200 group-hover:opacity-0"
                                />
                                <PanelLeft
                                    size={20}
                                    className="text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-gray-400"
                                />
                            </button>
                        </div>
                    </div>

                    {/* Divider - Full width */}
                    <hr className="border-gray-200 transition-colors duration-300 dark:border-[#3a3a3a]" />

                    {/* Menu Section */}
                    <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden py-4 px-3 scrollbar-hide">

                        {/* Collapsed Hamburger - Removed as it's moved to header */}

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isVisuallyExpanded ? 'max-h-8 opacity-100 mb-3' : 'max-h-0 opacity-0 mb-0'
                            }`}>
                            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                Menu
                            </p>
                        </div>
                        {menuItems.map((item: MenuItem) => {
                            const Icon = item.icon;
                            const hasChildren = item.children !== undefined && Array.isArray(item.children) && item.children.length > 0;
                            const isExpanded = !!expandedMenus[item.name];
                            const MenuComponent = hasChildren || item.onClick ? 'button' : Link;
                            const menuProps = hasChildren || item.onClick
                                ? {
                                    onClick: (e: React.MouseEvent) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (hasChildren) {
                                            setExpandedMenus((prev) => ({ ...prev, [item.name]: !prev[item.name] }));
                                        } else {
                                            item.onClick?.();
                                        }
                                    },
                                    type: 'button' as const,
                                }
                                : { href: route(item.href!) };

                            return (
                                <div key={item.name}>
                                    <MenuComponent
                                        {...menuProps}
                                        className={`
                                        group relative flex items-center rounded-lg text-sm transition-all duration-300 ease-in-out py-2.5 w-full
                                        ${item.active
                                                ? 'bg-gray-100 text-black font-bold dark:bg-[#3a3a3a] dark:text-gray-100'
                                                : 'text-gray-700 font-normal hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-[#3a3a3a]'
                                            }
                                    `}
                                        title={!isVisuallyExpanded ? item.name : undefined}
                                        onMouseEnter={(e) => handleMouseEnter(item, e)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <div className="flex w-14 flex-shrink-0 items-center justify-center">
                                            <Icon
                                                size={20}
                                                className="transition-all duration-300 ease-in-out group-hover:scale-110"
                                            />
                                        </div>
                                        <span className={`whitespace-nowrap transition-all duration-300 ease-in-out ${isVisuallyExpanded
                                                ? 'opacity-100 translate-x-0 relative'
                                                : 'opacity-0 absolute w-0 overflow-hidden pointer-events-none'
                                            }`}>{item.name}</span>
                                        {hasChildren && isVisuallyExpanded && (
                                            <span className="ml-auto pr-2 text-gray-500 dark:text-gray-400">
                                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                            </span>
                                        )}
                                    </MenuComponent>

                                    <div
                                        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${hasChildren && isExpanded && isVisuallyExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            {hasChildren && item.children && (
                                                <div className="relative ml-[1.75rem] mt-1">
                                                    {item.children.map((child: NonNullable<MenuItem['children']>[0], index: number) => {
                                                        const isLast = index === item.children!.length - 1;
                                                        const ChildIcon = child.icon;
                                                        const ChildComponent = child.href ? Link : 'button';
                                                        const childProps = child.href
                                                            ? { href: route(child.href) }
                                                            : {
                                                                type: 'button' as const,
                                                                onClick: child.onClick
                                                            };

                                                        return (
                                                            <div key={child.name} className="relative pl-6">
                                                                {/* Vertical Line */}
                                                                <div
                                                                    className={`absolute left-0 top-0 w-px bg-gray-200 dark:bg-[#3a3a3a] ${isLast ? 'h-1/2' : 'h-full'
                                                                        }`}
                                                                />

                                                                {/* Horizontal Line */}
                                                                <div className="absolute left-0 top-1/2 h-px w-4 bg-gray-200 dark:bg-[#3a3a3a]" />

                                                                <ChildComponent
                                                                    {...childProps}
                                                                    className={`flex w-full items-center gap-3 rounded-lg py-2 px-2 text-sm transition-colors ${child.active
                                                                            ? 'bg-gray-100 text-black font-bold dark:bg-[#3a3a3a] dark:text-gray-100'
                                                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-[#3a3a3a]'
                                                                        }`}
                                                                >
                                                                    {ChildIcon && <ChildIcon size={16} className="text-gray-500 dark:text-gray-400" />}
                                                                    <span>{child.name}</span>
                                                                </ChildComponent>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Divider */}
                    <hr className="border-gray-200 transition-colors duration-300 dark:border-[#3a3a3a]" />

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

                                {/* Dropdown Content - Centered within sidebar */}
                                <div
                                    className="fixed bottom-16 z-50 mb-1"
                                    style={{
                                        left: '12px',
                                        width: isVisuallyExpanded ? 'calc(256px - 24px)' : '240px'
                                    }}
                                >
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
                            <div className={`flex flex-1 min-w-0 items-center justify-between overflow-hidden transition-all duration-300 ease-in-out ${isVisuallyExpanded
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

            {/* Floating Menu for Collapsed State */}
            {hoveredMenu && (
                <div
                    className="fixed left-20 z-50 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-[#3a3a3a] dark:bg-[#2a2a2a]"
                    style={{ top: hoveredMenu.top }}
                    onMouseEnter={handleFloatingMenuEnter}
                    onMouseLeave={handleFloatingMenuLeave}
                >
                    <div className="px-4 py-2 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                        {hoveredMenu.name}
                    </div>
                    {hoveredMenu.children?.map((child) => {
                        const ChildComponent = child.href ? Link : 'button';
                        const childProps = child.href
                            ? { href: route(child.href) }
                            : {
                                type: 'button' as const,
                                onClick: child.onClick
                            };

                        return (
                            <ChildComponent
                                key={child.name}
                                {...childProps}
                                className={`block w-full px-4 py-2 text-left text-sm transition-colors ${child.active
                                        ? 'bg-gray-100 text-black font-bold dark:bg-[#3a3a3a] dark:text-gray-100'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#3a3a3a]'
                                    }`}
                            >
                                {child.name}
                            </ChildComponent>
                        );
                    })}
                </div>
            )}

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