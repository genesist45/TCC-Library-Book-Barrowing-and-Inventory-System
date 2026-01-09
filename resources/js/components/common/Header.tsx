import Dropdown from "@/components/common/Dropdown";
import {
    Menu,
    X,
    PanelLeftClose,
    PanelLeft,
    Bell,
    ChevronDown,
    Settings,
    LogOut,
    Maximize,
    Minimize,
    BookOpen,
    AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { router, usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import defaultUserImage from "@/assets/images/avatars/default-user.png";

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
        role: "admin" | "staff";
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

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { auth } = usePage().props as any;
    const notifications = auth.notifications || [];
    const unreadCount = auth.unreadCount || 0;

    // Check fullscreen status on mount and when it changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const handleLogout = () => {
        setProcessing(true);
        router.post(
            route("logout"),
            {},
            {
                onFinish: () => {
                    setProcessing(false);
                    setShowLogoutModal(false);
                },
            },
        );
    };

    const handleNotificationClick = (notification: any) => {
        router.post(
            route("notifications.read", notification.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (notification.data.action_url) {
                        router.get(notification.data.action_url);
                    }
                },
            },
        );
    };

    const handleMarkAllRead = () => {
        router.post(
            route("notifications.read-all"),
            {},
            {
                preserveScroll: true,
            },
        );
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
                            {showingMobileSidebar ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={toggleFullscreen}
                            className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:bg-[#3a3a3a] dark:hover:text-gray-200"
                            title={
                                isFullscreen
                                    ? "Exit Fullscreen"
                                    : "Enter Fullscreen"
                            }
                            aria-label={
                                isFullscreen
                                    ? "Exit Fullscreen"
                                    : "Enter Fullscreen"
                            }
                        >
                            {isFullscreen ? (
                                <Minimize size={20} />
                            ) : (
                                <Maximize size={20} />
                            )}
                        </button>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center gap-1">


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
                                    {unreadCount > 0 && (
                                        <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                                        </span>
                                    )}
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content width="80">
                                <div>
                                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-[#3a3a3a]">
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                            Notifications
                                        </h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllRead}
                                                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-[400px] overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map(
                                                (notification: any) => {
                                                    const isOverdue =
                                                        notification.data
                                                            .type ===
                                                        "overdue_book";
                                                    const iconBgClass =
                                                        isOverdue
                                                            ? !notification.read_at
                                                                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                                                : "bg-gray-100 text-gray-500 dark:bg-[#3a3a3a] dark:text-gray-400"
                                                            : !notification.read_at
                                                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                                                : "bg-gray-100 text-gray-500 dark:bg-[#3a3a3a] dark:text-gray-400";
                                                    const bgClass = isOverdue
                                                        ? !notification.read_at
                                                            ? "bg-red-50 dark:bg-red-900/20"
                                                            : ""
                                                        : !notification.read_at
                                                            ? "bg-blue-50 dark:bg-blue-900/20"
                                                            : "";
                                                    const dotClass = isOverdue
                                                        ? "bg-red-600"
                                                        : "bg-blue-600";

                                                    return (
                                                        <div
                                                            key={
                                                                notification.id
                                                            }
                                                            className={`group relative flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:border-[#3a3a3a] dark:hover:bg-[#3a3a3a] ${bgClass}`}
                                                        >
                                                            <button
                                                                onClick={() =>
                                                                    handleNotificationClick(
                                                                        notification,
                                                                    )
                                                                }
                                                                className="flex flex-1 items-start gap-3 text-left"
                                                            >
                                                                <div
                                                                    className={`mt-1 rounded-full p-1.5 ${iconBgClass}`}
                                                                >
                                                                    {isOverdue ? (
                                                                        <AlertTriangle
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <BookOpen
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p
                                                                        className={`text-sm font-medium ${!notification.read_at ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"}`}
                                                                    >
                                                                        {
                                                                            notification
                                                                                .data
                                                                                .message
                                                                        }
                                                                    </p>
                                                                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                                        {isOverdue ? (
                                                                            <>
                                                                                <span
                                                                                    className={`font-medium ${!notification.read_at ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-500"}`}
                                                                                >
                                                                                    {
                                                                                        notification
                                                                                            .data
                                                                                            .member_name
                                                                                    }
                                                                                </span>
                                                                                {" has not returned "}
                                                                                <span className="italic">
                                                                                    {
                                                                                        notification
                                                                                            .data
                                                                                            .book_title
                                                                                    }
                                                                                </span>
                                                                                {notification
                                                                                    .data
                                                                                    .days_overdue >
                                                                                    0 && (
                                                                                        <span className="ml-1 text-red-500 dark:text-red-400 font-medium">
                                                                                            - {
                                                                                                notification
                                                                                                    .data
                                                                                                    .days_overdue
                                                                                            }{" "}
                                                                                            {notification
                                                                                                .data
                                                                                                .days_overdue ===
                                                                                                1
                                                                                                ? "day"
                                                                                                : "days"}{" "}
                                                                                            overdue
                                                                                        </span>
                                                                                    )}
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <span
                                                                                    className={`font-medium ${!notification.read_at ? "text-gray-700 dark:text-gray-300" : "text-gray-600 dark:text-gray-500"}`}
                                                                                >
                                                                                    {
                                                                                        notification
                                                                                            .data
                                                                                            .member_name
                                                                                    }
                                                                                </span>{" "}
                                                                                requested{" "}
                                                                                <span className="italic">
                                                                                    {
                                                                                        notification
                                                                                            .data
                                                                                            .book_title
                                                                                    }
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </p>
                                                                    <p className="mt-1 text-[10px] text-gray-400">
                                                                        {new Date(
                                                                            notification.created_at,
                                                                        ).toLocaleString()}
                                                                    </p>
                                                                </div>

                                                            </button>

                                                            <button
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    router.delete(
                                                                        route(
                                                                            "notifications.destroy",
                                                                            notification.id,
                                                                        ),
                                                                        {
                                                                            preserveScroll: true,
                                                                        },
                                                                    );
                                                                }}
                                                                className="absolute right-2 top-2 hidden rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 group-hover:block dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                                                title="Remove notification"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    );
                                                },
                                            )
                                        ) : (
                                            <div className="px-4 py-8 text-center">
                                                <Bell
                                                    size={32}
                                                    className="mx-auto mb-2 text-gray-300 dark:text-gray-600"
                                                />
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    No notifications yet
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Dropdown.Content>
                        </Dropdown>

                        {/* Profile Dropdown - Mobile Only */}
                        <div className="relative lg:hidden">
                            <button
                                onClick={() =>
                                    setShowProfileDropdown(!showProfileDropdown)
                                }
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
                                <ChevronDown
                                    size={16}
                                    className="text-gray-500 dark:text-gray-400"
                                />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {showProfileDropdown && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() =>
                                            setShowProfileDropdown(false)
                                        }
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
                                                            src={
                                                                defaultUserImage
                                                            }
                                                            alt={user.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {user.first_name}{" "}
                                                        {user.last_name}
                                                    </p>
                                                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="border-t border-gray-100 py-1 dark:border-[#3a3a3a]/50">
                                                <Link
                                                    href={route("profile.edit")}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-[#3a3a3a]"
                                                    onClick={() =>
                                                        setShowProfileDropdown(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    <Settings
                                                        size={18}
                                                        className="text-gray-500 dark:text-gray-400"
                                                    />
                                                    <span>
                                                        Account Settings
                                                    </span>
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setShowProfileDropdown(
                                                            false,
                                                        );
                                                        setShowLogoutModal(
                                                            true,
                                                        );
                                                    }}
                                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-[#3a3a3a]"
                                                >
                                                    <LogOut
                                                        size={18}
                                                        className="text-gray-500 dark:text-gray-400"
                                                    />
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
