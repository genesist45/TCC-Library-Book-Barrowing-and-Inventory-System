interface DetailFieldProps {
    label: string;
    value?: string | number | null;
    className?: string;
    children?: React.ReactNode;
}

export default function DetailField({ label, value, className = '', children }: DetailFieldProps) {
    return (
        <div className={className}>
            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {label}
            </label>
            {children || (
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {value || '-'}
                </p>
            )}
        </div>
    );
}
