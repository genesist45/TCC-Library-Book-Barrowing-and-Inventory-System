import InputLabel from "@/components/forms/InputLabel";

interface StatusToggleSectionProps {
    isActive: boolean;
    onToggle: () => void;
}

export default function StatusToggleSection({
    isActive,
    onToggle,
}: StatusToggleSectionProps) {
    return (
        <div>
            <div className="mt-4">
                <div className="sm:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <InputLabel htmlFor="is_active" value="Status" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Make this item available in the catalog
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onToggle}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                isActive
                                    ? "bg-indigo-600"
                                    : "bg-gray-200 dark:bg-gray-700"
                            }`}
                            role="switch"
                            aria-checked={isActive}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    isActive ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>
                    <div className="mt-2">
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                isActive
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                            }`}
                        >
                            {isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
