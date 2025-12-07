interface MemberTypeBadgeProps {
    type: string;
}

export default function MemberTypeBadge({ type }: MemberTypeBadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                type === 'Privileged'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            }`}
        >
            {type}
        </span>
    );
}
