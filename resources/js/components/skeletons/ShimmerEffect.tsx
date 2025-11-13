/**
 * Shimmer Effect Components
 * Professional skeleton loading screens for layout components
 * Colors match the app theme with dark mode support
 */

// Base shimmer animation classes - light and dark mode variants with better contrast
export const shimmerClass = "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] dark:from-[#3a3a3a] dark:via-[#4a4a4a] dark:to-[#3a3a3a]";
export const shimmerClassDark = "animate-shimmer bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] dark:from-[#4a4a4a] dark:via-[#5a5a5a] dark:to-[#4a4a4a]";

// Header Shimmer Skeleton - matches header with dark mode support
export function HeaderSkeleton({ sidebarCollapsed = false }: { sidebarCollapsed?: boolean }) {
    return (
        <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-1.5">
                {/* Left side - Toggle buttons */}
                <div className="flex items-center">
                    {/* Desktop sidebar toggle */}
                    <div className={`${shimmerClass} hidden lg:block h-8 w-8 rounded-md`} />
                    
                    {/* Mobile menu button */}
                    <div className={`${shimmerClass} h-8 w-8 rounded-md lg:hidden`} />
                </div>

                {/* Right side - Notification bell & Dark mode toggle */}
                <div className="flex items-center gap-1">
                    {/* Notification bell */}
                    <div className={`${shimmerClass} h-8 w-8 rounded-md`} />
                    
                    {/* Dark mode toggle */}
                    <div className={`${shimmerClass} h-8 w-8 rounded-md`} />
                </div>
            </div>
        </nav>
    );
}

// Sidebar Shimmer Skeleton - matches sidebar with dark mode support
export function SidebarSkeleton({ collapsed = false }: { collapsed?: boolean }) {
    const menuItems = 2; // Exact number of menu items in actual sidebar

    return (
        <aside className={`fixed left-0 top-0 z-50 h-screen bg-white shadow-lg transition-all duration-300 dark:bg-[#2a2a2a] ${
            collapsed ? 'w-20' : 'w-64'
        }`}>
            <div className="flex h-full flex-col">
                {/* Logo area */}
                <div className={`flex h-14 items-center overflow-hidden transition-all duration-300 ${
                    !collapsed ? 'px-5' : 'justify-center px-3'
                }`}>
                    <div className={`${shimmerClass} ${collapsed ? 'h-8 w-8' : 'h-10 w-32'} rounded`} />
                </div>

                {/* Divider */}
                <hr className="border-gray-200 dark:border-[#3a3a3a]" />

                {/* Menu items */}
                <nav className={`flex-1 space-y-1 overflow-y-auto py-4 transition-all duration-300 ${
                    collapsed ? 'px-2' : 'px-3'
                }`}>
                    {/* Menu label */}
                    {!collapsed && (
                        <div className={`mb-3 px-3 ${shimmerClass} h-3 w-12 rounded`} />
                    )}
                    
                    {/* Menu items - exactly 2 items */}
                    {Array.from({ length: menuItems }).map((_, index) => (
                        <div key={index} className={`flex items-center rounded-lg py-2.5 transition-all duration-300 ${
                            !collapsed ? 'gap-3 px-3' : 'justify-center'
                        }`}>
                            <div className={`${shimmerClass} h-5 w-5 rounded`} />
                            {!collapsed && (
                                <div className={`${shimmerClass} h-4 rounded`} 
                                     style={{ width: index === 0 ? '70px' : '45px' }} />
                            )}
                        </div>
                    ))}
                </nav>

                {/* Account Section in Footer */}
                <div className={`pt-1 pb-3 transition-all duration-300 ${
                    collapsed ? 'px-3' : 'px-4'
                }`}>
                    <div className={`flex w-full items-center overflow-hidden rounded-lg py-2 ${
                        !collapsed ? 'gap-3 px-2' : 'justify-center px-0'
                    }`}>
                        <div className={`${shimmerClass} h-8 w-8 rounded-full border-2 border-transparent`} />
                        {!collapsed && (
                            <div className="flex flex-1 items-center justify-between gap-2">
                                <div className={`${shimmerClass} h-4 w-24 rounded`} />
                                <div className={`${shimmerClass} h-4 w-4 rounded`} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}

// Breadcrumbs Shimmer Skeleton
export function BreadcrumbsSkeleton() {
    return (
        <div className="flex items-center gap-2">
            <div className={`${shimmerClass} h-4 w-16 rounded`} />
            <div className="text-gray-400 dark:text-gray-500">/</div>
            <div className={`${shimmerClass} h-4 w-20 rounded`} />
        </div>
    );
}

// Content Shimmer Skeleton (for pages) - matches background with dark mode
export function ContentSkeleton() {
    return (
        <div className="p-6 space-y-4 bg-gray-50 transition-colors dark:bg-[#1a1a1a]">
            {/* Page header */}
            <div className="space-y-2">
                <div className={`${shimmerClassDark} h-8 w-48 rounded`} />
                <div className={`${shimmerClassDark} h-4 w-64 rounded`} />
            </div>

            {/* Content area */}
            <div className="space-y-3 pt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`${shimmerClassDark} h-16 w-full rounded-lg`} />
                ))}
            </div>
        </div>
    );
}

// Full Page Shimmer (with Header + Sidebar + Content)
export function PageSkeleton({ sidebarCollapsed = false }: { sidebarCollapsed?: boolean }) {
    return (
        <div className="min-h-screen bg-gray-50 transition-colors dark:bg-[#1a1a1a]">
            {/* Sidebar */}
            <div className="hidden lg:block">
                <SidebarSkeleton collapsed={sidebarCollapsed} />
            </div>

            {/* Main content area */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                {/* Header */}
                <HeaderSkeleton sidebarCollapsed={sidebarCollapsed} />

                {/* Content */}
                <ContentSkeleton />
            </div>
        </div>
    );
}

// Modal Shimmer Skeleton - matches modal with dark mode support
export function ModalSkeleton({ maxWidth = '2xl' }: { maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' }) {
    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 dark:bg-black/60">
            <div className={`bg-white rounded-lg shadow-xl w-full ${maxWidthClass} mx-4 p-6 space-y-4 transition-all duration-300 dark:bg-[#2a2a2a]`}>
                {/* Modal Title */}
                <div className={`${shimmerClass} h-6 w-32 rounded`} />
                
                {/* Form Fields */}
                <div className="space-y-3 pt-2">
                    <div className={`${shimmerClass} h-10 w-full rounded-lg`} />
                    <div className={`${shimmerClass} h-10 w-full rounded-lg`} />
                    <div className={`${shimmerClass} h-10 w-full rounded-lg`} />
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 transition-colors duration-300 dark:border-[#3a3a3a]">
                    <div className={`${shimmerClass} h-10 w-20 rounded-md`} />
                    <div className={`${shimmerClass} h-10 w-24 rounded-md`} />
                </div>
            </div>
        </div>
    );
}

// Table Row Shimmer Skeleton - for loading table data
export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
    return (
        <tr className="border-b border-gray-200 transition-colors duration-300 dark:border-[#3a3a3a]">
            {/* ID Column */}
            <td className="whitespace-nowrap px-4 py-2">
                <div className={`${shimmerClass} h-4 w-8 rounded`} />
            </td>
            {/* Name Column with Avatar */}
            <td className="whitespace-nowrap px-4 py-2">
                <div className="flex items-center gap-2">
                    <div className={`${shimmerClass} h-7 w-7 rounded-full`} />
                    <div className={`${shimmerClass} h-4 w-32 rounded`} />
                </div>
            </td>
            {/* Email Column */}
            <td className="whitespace-nowrap px-4 py-2">
                <div className={`${shimmerClass} h-4 w-48 rounded`} />
            </td>
            {/* Role Column - Badge Style */}
            <td className="whitespace-nowrap px-4 py-2">
                <div className={`${shimmerClass} h-5 w-16 rounded-full`} />
            </td>
            {/* Created At Column */}
            <td className="whitespace-nowrap px-4 py-2">
                <div className={`${shimmerClass} h-4 w-24 rounded`} />
            </td>
            {/* Actions Column */}
            <td className="whitespace-nowrap px-4 py-2 text-center">
                <div className="flex items-center justify-center gap-2">
                    <div className={`${shimmerClass} h-6 w-6 rounded`} />
                    <div className={`${shimmerClass} h-6 w-6 rounded`} />
                    <div className={`${shimmerClass} h-6 w-6 rounded`} />
                </div>
            </td>
        </tr>
    );
}

