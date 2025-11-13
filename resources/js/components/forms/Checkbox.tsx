import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-indigo-600 shadow-sm transition-colors focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-indigo-400 dark:focus:ring-indigo-400 dark:focus:ring-offset-[#1a1a1a] ' +
                className
            }
        />
    );
}
