interface CoverImageDisplayProps {
    coverImage?: string | null;
    title: string;
}

export default function CoverImageDisplay({ coverImage, title }: CoverImageDisplayProps) {
    return (
        <div className="flex-shrink-0">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                {coverImage ? (
                    <img
                        src={`/storage/${coverImage}`}
                        alt={title}
                        className="h-48 w-auto object-cover"
                    />
                ) : (
                    <div className="flex h-48 w-32 items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <div className="text-center">
                            <div className="mb-2 text-4xl font-bold text-gray-300 dark:text-gray-600">N/A</div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">No Cover Image</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
