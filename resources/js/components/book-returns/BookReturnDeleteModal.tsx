interface BookReturn {
    id: number;
    member?: {
        name: string;
    };
    catalog_item?: {
        title: string;
    };
}

interface BookReturnDeleteModalProps {
    show: boolean;
    bookReturn: BookReturn | null;
    processing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function BookReturnDeleteModal({
    show,
    bookReturn,
    processing,
    onConfirm,
    onCancel,
}: BookReturnDeleteModalProps) {
    if (!show || !bookReturn) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-[#2a2a2a]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Delete Return Record
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Are you sure you want to delete this return record? This action cannot be undone.
                </p>
                <div className="mt-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/10">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Return ID:</strong> {bookReturn.id}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Member:</strong> {bookReturn.member?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Book:</strong> {bookReturn.catalog_item?.title || 'N/A'}
                    </p>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-gray-200 dark:hover:bg-[#4a4a4a]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={processing}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                        {processing ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
