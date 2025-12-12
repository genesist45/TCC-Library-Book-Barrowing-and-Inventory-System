import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";

interface DetailTabContentProps {
    data: {
        volume: string;
        page_duration: string;
        abstract: string;
        biblio_info: string;
        url_visibility: string;
        library_branch: string;
    };
    errors: {
        volume?: string;
        page_duration?: string;
        abstract?: string;
        biblio_info?: string;
        url_visibility?: string;
        library_branch?: string;
    };
    onDataChange: (field: string, value: any) => void;
    onClearErrors: (field: string) => void;
}

export default function DetailTabContent({
    data,
    errors,
    onDataChange,
    onClearErrors,
}: DetailTabContentProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Detail Information
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Additional details for general materials
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="volume" value="Volume" />
                    <TextInput
                        id="volume"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.volume}
                        onChange={(e) => {
                            onDataChange("volume", e.target.value);
                            onClearErrors("volume");
                        }}
                        placeholder="e.g., Vol. 1"
                    />
                    <InputError message={errors.volume} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="page_duration" value="Page / Duration" />
                    <TextInput
                        id="page_duration"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.page_duration}
                        onChange={(e) => {
                            onDataChange("page_duration", e.target.value);
                            onClearErrors("page_duration");
                        }}
                        placeholder="e.g., 320 pages or 90 minutes"
                    />
                    <InputError message={errors.page_duration} className="mt-1" />
                </div>

                <div className="sm:col-span-2">
                    <InputLabel htmlFor="abstract" value="Abstract" />
                    <textarea
                        id="abstract"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        value={data.abstract}
                        onChange={(e) => {
                            onDataChange("abstract", e.target.value);
                            onClearErrors("abstract");
                        }}
                        placeholder="Short summary of the content..."
                    />
                    <InputError message={errors.abstract} className="mt-1" />
                </div>

                <div className="sm:col-span-2">
                    <InputLabel htmlFor="biblio_info" value="Biblio Information" />
                    <textarea
                        id="biblio_info"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        value={data.biblio_info}
                        onChange={(e) => {
                            onDataChange("biblio_info", e.target.value);
                            onClearErrors("biblio_info");
                        }}
                        placeholder="Staff-only notes..."
                    />
                    <InputError message={errors.biblio_info} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="url_visibility" value="URL Visibility" />
                    <select
                        id="url_visibility"
                        value={data.url_visibility}
                        onChange={(e) => {
                            onDataChange("url_visibility", e.target.value);
                            onClearErrors("url_visibility");
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                        <option value="">Select Visibility</option>
                        <option value="Public">Public</option>
                        <option value="Staff Only">Staff Only</option>
                    </select>
                    <InputError message={errors.url_visibility} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="library_branch" value="Library Branch" />
                    <TextInput
                        id="library_branch"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.library_branch}
                        onChange={(e) => {
                            onDataChange("library_branch", e.target.value);
                            onClearErrors("library_branch");
                        }}
                        placeholder="e.g., Main Library"
                    />
                    <InputError message={errors.library_branch} className="mt-1" />
                </div>
            </div>
        </div>
    );
}
