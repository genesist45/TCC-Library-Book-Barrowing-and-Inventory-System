interface DetailFieldProps {
    label: string;
    value?: string | number | null;
    className?: string;
    children?: React.ReactNode;
}

export default function DetailField({ label, value, className = '', children }: DetailFieldProps) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                {label}
            </label>
            {children || (
                <p className="mt-1.5 text-base text-gray-900 transition-colors duration-200 dark:text-gray-100">
                    {value || '-'}
                </p>
            )}
        </div>
    );
}
