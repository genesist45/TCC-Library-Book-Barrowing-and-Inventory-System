import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useState, useEffect, Suspense, lazy } from 'react';
import { generateBreadcrumbs } from '@/utils/breadcrumbGenerator';
import { HeaderSkeleton, SidebarSkeleton, BreadcrumbsSkeleton } from '@/components/common/Loading';
import { PageProps } from '@/types';

// Lazy load heavy UI components
const Header = lazy(() => import('@/components/common/Header'));
const Sidebar = lazy(() => import('@/components/common/Sidebar'));
const Breadcrumbs = lazy(() => import('@/components/common/Breadcrumbs'));
const Toast = lazy(() => import('@/components/common/Toast'));

export default function Authenticated({ children }: PropsWithChildren) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const currentRoute = route().current() || '';

    const [showingMobileSidebar, setShowingMobileSidebar] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Initialize sidebar state from localStorage
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarCollapsed');
            return saved === 'true';
        }
        return false;
    });

    // Persist sidebar state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
    }, [sidebarCollapsed]);

    // Trigger slide-in animation when sidebar opens
    useEffect(() => {
        if (showingMobileSidebar) {
            // Small delay to ensure the initial state is rendered before animating
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true);
                });
            });
        }
    }, [showingMobileSidebar]);

    // Handle mobile sidebar close with animation
    const handleCloseMobileSidebar = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setShowingMobileSidebar(false);
        }, 300); // Match transition duration
    };

    // Handle mobile sidebar open
    const handleOpenMobileSidebar = () => {
        setIsAnimating(false);
        setShowingMobileSidebar(true);
    };

    // Determine if sidebar should show expanded (only based on collapsed state now)
    const showExpanded = !sidebarCollapsed;

    return (
        <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-[#1a1a1a]">
            <Suspense fallback={null}>
                <Toast />
            </Suspense>

            {/* Sidebar for desktop */}
            <div className="hidden lg:block">
                <Suspense fallback={<SidebarSkeleton collapsed={sidebarCollapsed} />}>
                    <Sidebar
                        currentRoute={currentRoute}
                        collapsed={sidebarCollapsed}
                        showExpanded={showExpanded}
                        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                        user={user}
                    />
                </Suspense>
            </div>

            {/* Mobile sidebar overlay */}
            {showingMobileSidebar && (
                <div
                    className={`fixed inset-0 z-50 bg-gray-900 transition-opacity duration-300 dark:bg-black lg:hidden ${isAnimating ? 'bg-opacity-50 dark:bg-opacity-60' : 'bg-opacity-0 dark:bg-opacity-0'
                        }`}
                    onClick={handleCloseMobileSidebar}
                >
                    <div
                        className={`fixed left-0 top-0 h-screen w-64 transform transition-transform duration-300 ease-in-out ${isAnimating ? 'translate-x-0' : '-translate-x-full'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Suspense fallback={<SidebarSkeleton collapsed={false} />}>
                            <Sidebar
                                currentRoute={currentRoute}
                                collapsed={false}
                                showExpanded={true}
                                user={user}
                            />
                        </Suspense>
                    </div>
                </div>
            )}

            {/* Main content area */}
            <div className={`transition-[padding-left] duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                {/* Top header */}
                <Suspense fallback={<HeaderSkeleton sidebarCollapsed={sidebarCollapsed} />}>
                    <Header
                        currentRoute={currentRoute}
                        showingMobileSidebar={showingMobileSidebar}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleMobileSidebar={() => {
                            if (showingMobileSidebar) {
                                handleCloseMobileSidebar();
                            } else {
                                handleOpenMobileSidebar();
                            }
                        }}
                        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                        user={user}
                    />
                </Suspense>

                {/* Breadcrumbs */}
                {currentRoute && (
                    <div className="bg-gray-50 py-3 transition-colors duration-300 dark:bg-[#1a1a1a]">
                        <div className={`mx-auto px-4 will-change-[max-width] transition-[max-width] duration-300 ease-in-out sm:px-6 lg:px-8 ${sidebarCollapsed ? 'max-w-[90rem]' : 'max-w-7xl'}`}>
                            <Suspense fallback={<BreadcrumbsSkeleton />}>
                                <Breadcrumbs items={generateBreadcrumbs(currentRoute, user.role)} />
                            </Suspense>
                        </div>
                    </div>
                )}

                {/* Main content */}
                <main className="bg-gray-50 transition-colors duration-300 dark:bg-[#1a1a1a]">
                    <style>{`
                        .content-container .max-w-7xl {
                            max-width: ${sidebarCollapsed ? '90rem' : '80rem'};
                            transition: max-width 300ms ease-in-out;
                            will-change: max-width;
                        }
                    `}</style>
                    <div className="content-container">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
