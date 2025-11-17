import { HTMLAttributes } from 'react';

export default function InputError({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return (
        <div className="h-4">
            {message && (
                <p
                    {...props}
                    className={`text-xs leading-4 text-red-600 dark:text-red-400 ${className}`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
