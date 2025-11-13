import { FC } from 'react';

// Re-export shimmer components for easier imports
export {
    HeaderSkeleton,
    SidebarSkeleton,
    BreadcrumbsSkeleton,
    ContentSkeleton,
    PageSkeleton,
    ModalSkeleton,
    TableRowSkeleton,
} from '@/components/skeletons/ShimmerEffect';

interface LoadingProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

export const Loading: FC<LoadingProps> = ({ 
    text = 'Loading...', 
    size = 'md',
    fullScreen = false 
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6 border-2',
        md: 'h-10 w-10 border-3',
        lg: 'h-16 w-16 border-4',
    };

    const Spinner = () => (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-gray-300 border-t-blue-600 dark:border-[#3a3a3a] dark:border-t-blue-400`}
            />
            {text && (
                <p className="animate-pulse text-sm text-gray-600 dark:text-gray-400">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/60">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex min-h-[200px] items-center justify-center">
            <Spinner />
        </div>
    );
};

export const PageLoading: FC = () => (
    <Loading text="Loading page..." size="lg" fullScreen />
);

export const ComponentLoading: FC<{ text?: string }> = ({ text }) => (
    <Loading text={text} size="md" />
);

export const ModalLoading: FC = () => (
    <div className="flex min-h-[300px] items-center justify-center">
        <Loading text="Loading..." size="md" />
    </div>
);

