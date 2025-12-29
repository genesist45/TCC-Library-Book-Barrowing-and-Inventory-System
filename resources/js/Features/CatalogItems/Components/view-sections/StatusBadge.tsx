interface StatusBadgeProps {
    isActive: boolean;
}

export default function StatusBadge({ isActive }: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                isActive
                    ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/30'
                    : 'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-900/30 dark:text-gray-400 dark:ring-gray-500/30'
            }`}
        >
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
}
