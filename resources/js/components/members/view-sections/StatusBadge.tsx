interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusClasses = () => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'Suspended':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusClasses()}`}>
            {status}
        </span>
    );
}
