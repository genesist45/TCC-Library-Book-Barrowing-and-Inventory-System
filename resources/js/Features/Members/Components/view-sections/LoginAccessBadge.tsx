interface LoginAccessBadgeProps {
    allowLogin: boolean;
}

export default function LoginAccessBadge({ allowLogin }: LoginAccessBadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                allowLogin
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
            }`}
        >
            {allowLogin ? 'Enabled' : 'Disabled'}
        </span>
    );
}
