import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
    onClick: () => void;
    icon: LucideIcon;
    title: string;
    variant: "approve" | "disapprove" | "view" | "edit" | "delete" | "primary";
    disabled?: boolean;
}

const variantStyles = {
    approve: "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50",
    disapprove: "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50",
    view: "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50",
    edit: "bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50",
    delete: "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50",
    primary: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50",
};

export default function ActionButton({
    onClick,
    icon: Icon,
    title,
    variant,
    disabled = false,
}: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center rounded-lg p-1.5 transition disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]}`}
            title={title}
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}

interface ActionButtonGroupProps {
    children: React.ReactNode;
}

export function ActionButtonGroup({ children }: ActionButtonGroupProps) {
    return <div className="flex items-center gap-2">{children}</div>;
}
