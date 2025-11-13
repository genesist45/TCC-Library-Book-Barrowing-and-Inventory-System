import { HTMLAttributes } from 'react';

export default function InputError({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return (
        <div className="h-5">
            {message && (
                <p
                    {...props}
                    className={`text-sm leading-5 text-red-600 dark:text-red-400 ${className}`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
