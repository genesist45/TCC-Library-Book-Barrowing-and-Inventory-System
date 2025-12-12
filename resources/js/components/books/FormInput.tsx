import { LucideIcon } from "lucide-react";
import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon: LucideIcon;
}

export default function FormInput({ icon: Icon, className = "", ...props }: FormInputProps) {
    return (
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
                {...props}
                className={`w-full rounded-lg border py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 ${className || "border-gray-300 focus:ring-indigo-500"
                    }`}
            />
        </div>
    );
}
