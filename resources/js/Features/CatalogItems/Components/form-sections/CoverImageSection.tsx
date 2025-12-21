import { Upload, X } from "lucide-react";
import InputLabel from "@/components/forms/InputLabel";
import InputError from "@/components/forms/InputError";

interface CoverImageSectionProps {
    coverImagePreview: string | null;
    coverImageName: string;
    error?: string;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
}

export default function CoverImageSection({
    coverImagePreview,
    coverImageName,
    error,
    onImageChange,
    onRemoveImage,
}: CoverImageSectionProps) {
    return (
        <div>
            <div className="mt-4">
                <div className="sm:col-span-2">
                    <InputLabel htmlFor="cover_image" value="Cover Image" />
                    <div className="mt-1 flex flex-wrap items-center gap-4">
                        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                            <Upload className="h-4 w-4" />
                            Choose File
                            <input
                                type="file"
                                id="cover_image"
                                className="hidden"
                                accept="image/*"
                                onChange={onImageChange}
                            />
                        </label>
                        <span className="text-sm text-gray-500 dark:text-gray-400 break-all">
                            {coverImageName || "No file chosen"}
                        </span>
                        {coverImageName && (
                            <button
                                type="button"
                                onClick={onRemoveImage}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <div className="mt-3 flex justify-center">
                        {coverImagePreview ? (
                            <img
                                src={coverImagePreview}
                                alt="Cover preview"
                                className="h-48 w-auto max-w-full rounded-md border border-gray-300 object-cover shadow-sm dark:border-gray-700"
                            />
                        ) : (
                            <div className="flex h-48 w-32 items-center justify-center rounded-md border border-gray-300 bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <div className="text-center">
                                    <div className="mb-2 text-4xl font-bold text-gray-300 dark:text-gray-600">
                                        N/A
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        No Cover Image
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Recommended: JPG, PNG (Max 2MB)
                    </p>
                    <InputError message={error} className="mt-1" />
                </div>
            </div>
        </div>
    );
}
