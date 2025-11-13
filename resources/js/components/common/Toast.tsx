import { Toaster } from 'sonner';
import { useLayoutEffect } from 'react';
import '@/assets/css/toast.css';

interface ToastProps {
    sidebarCollapsed?: boolean;
}

export default function Toast({ sidebarCollapsed = false }: ToastProps) {
    // Use useLayoutEffect to update position synchronously before paint
    useLayoutEffect(() => {
        const updateToastPosition = () => {
            // Check if we're on mobile (< 1024px)
            const isMobile = window.innerWidth < 1024;
            
            if (isMobile) {
                // On mobile, CSS handles positioning with left/right padding
                return;
            }
            
            // Desktop positioning logic
            let rightPosition: string;
            
            if (sidebarCollapsed) {
                // When collapsed: content is full-width with px-8 (2rem) padding
                // Toast should align with the right padding
                rightPosition = '2rem'; // Matches the px-8 padding
            } else {
                // When expanded: content uses max-w-7xl (80rem) centered
                // Calculate centered position with sidebar offset
                const sidebarWidth = '16rem';
                rightPosition = `calc((100vw - ${sidebarWidth} - 80rem) / 2 + 2rem)`;
            }
            
            document.documentElement.style.setProperty('--toast-right-position', rightPosition);
        };
        
        updateToastPosition();
        
        // Update on window resize
        window.addEventListener('resize', updateToastPosition);
        return () => window.removeEventListener('resize', updateToastPosition);
    }, [sidebarCollapsed]);

    return (
        <Toaster 
            position="top-right" 
            closeButton 
            duration={3000}
            toastOptions={{
                className: 'custom-toast',
                unstyled: false,
            }}
            visibleToasts={5}
            expand={false}
        />
    );
}

