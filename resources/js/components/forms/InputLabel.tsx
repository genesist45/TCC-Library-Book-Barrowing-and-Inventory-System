import { LabelHTMLAttributes } from 'react';

export default function InputLabel({
    value,
    className = '',
    required = false,
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string; required?: boolean }) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-gray-700 dark:text-gray-300 ` +
                className
            }
        >
            {value ? value : children}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>
    );
}
