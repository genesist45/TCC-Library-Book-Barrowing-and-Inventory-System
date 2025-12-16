import { ChangeEvent, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import InputLabel from "@/components/forms/InputLabel";
import InputError from "@/components/forms/InputError";

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    children: ReactNode;
    className?: string;
}

export function FormField({ label, required = false, error, children, className = "" }: FormFieldProps) {
    return (
        <div className={className}>
            <InputLabel value={label} required={required} />
            <div className="mt-1.5">{children}</div>
            <InputError message={error} />
        </div>
    );
}

interface TextFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
    error?: string;
    placeholder?: string;
    className?: string;
    icon?: LucideIcon;
    min?: string;
    validationState?: "valid" | "invalid" | "checking" | null;
    validationMessage?: string;
}

export function TextField({
    label,
    value,
    onChange,
    type = "text",
    required = false,
    error,
    placeholder,
    className = "",
    icon: Icon,
    min,
    validationState,
    validationMessage,
}: TextFieldProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const getBorderClass = () => {
        if (validationState === "valid") return "border-green-500 focus:border-green-500 focus:ring-green-500";
        if (validationState === "invalid") return "border-red-500 focus:border-red-500 focus:ring-red-500";
        return "border-gray-300";
    };

    return (
        <div className={className}>
            <InputLabel value={label} required={required} />
            <div className="relative mt-1.5">
                {Icon && (
                    <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                )}
                <input
                    type={type}
                    value={value}
                    onChange={handleChange}
                    min={min}
                    className={`w-full rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${Icon ? "pl-10" : ""
                        } ${getBorderClass()}`}
                    placeholder={placeholder}
                    required={required}
                />
                {validationState === "valid" && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                )}
                {validationState === "checking" && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"></div>
                    </div>
                )}
            </div>
            {error && <InputError message={error} />}
            {validationState === "valid" && validationMessage && (
                <p className="mt-1 flex items-center text-sm text-green-600">
                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {(() => {
                        // Parse message to make member name bold
                        // Format: "Valid member (Category) - Name - Return date set to X days"
                        const match = validationMessage.match(/^(Valid member \([^)]+\) - )([^-]+)( - Return date set to \d+ days)$/);
                        if (match) {
                            return (
                                <>
                                    {match[1]}
                                    <span className="font-bold">{match[2]}</span>
                                    {match[3]}
                                </>
                            );
                        }
                        return validationMessage;
                    })()}
                </p>
            )}
            {validationState === "invalid" && validationMessage && (
                <p className="mt-1 text-sm text-red-600">{validationMessage}</p>
            )}
        </div>
    );
}

interface TextAreaFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    error?: string;
    className?: string;
}

export function TextAreaField({
    label,
    value,
    onChange,
    rows = 3,
    error,
    className = "",
}: TextAreaFieldProps) {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={className}>
            <InputLabel value={label} />
            <textarea
                value={value}
                onChange={handleChange}
                rows={rows}
                className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <InputError message={error} />
        </div>
    );
}

interface SelectFieldProps {
    label: string;
    value: string | number | null;
    onChange: (value: number | null) => void;
    options: { value: number; label: string }[];
    required?: boolean;
    error?: string;
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
}

export function SelectField({
    label,
    value,
    onChange,
    options,
    required = false,
    error,
    placeholder = "-- Select --",
    emptyMessage,
    className = "",
}: SelectFieldProps) {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value ? parseInt(e.target.value) : null);
    };

    return (
        <div className={className}>
            <InputLabel value={label} required={required} />
            <select
                value={value ?? ""}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required={required}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {options.length === 0 && emptyMessage && (
                <p className="mt-1 text-sm text-amber-600">{emptyMessage}</p>
            )}
            <InputError message={error} />
        </div>
    );
}
