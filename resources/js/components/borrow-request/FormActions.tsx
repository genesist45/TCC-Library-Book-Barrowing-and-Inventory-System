interface FormActionsProps {
    onCancel: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    processing?: boolean;
}

export default function FormActions({
    onCancel,
    submitLabel = "Submit",
    cancelLabel = "Cancel",
    processing = false,
}: FormActionsProps) {
    return (
        <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border-2 border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
            >
                {cancelLabel}
            </button>
            <button
                type="submit"
                disabled={processing}
                className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
                {processing ? "Submitting..." : submitLabel}
            </button>
        </div>
    );
}
