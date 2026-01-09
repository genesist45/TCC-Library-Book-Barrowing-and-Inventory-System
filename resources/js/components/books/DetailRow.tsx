interface DetailRowProps {
    label: string;
    value: string | undefined | null;
    isLink?: boolean;
}

export default function DetailRow({ label, value, isLink = false }: DetailRowProps) {
    if (!value) return null;

    return (
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-4 border-b border-gray-100 py-3">
            <dt className="text-xs sm:text-sm font-medium text-gray-500">{label}</dt>
            <dd
                className={`sm:col-span-2 text-sm break-words ${isLink ? "font-semibold text-indigo-600" : "text-gray-900"}`}
            >
                {value}
            </dd>
        </div>
    );
}
