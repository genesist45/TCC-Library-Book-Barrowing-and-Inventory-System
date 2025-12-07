import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";

interface AdditionalDetailsSectionProps {
    data: {
        isbn: string;
        isbn13: string;
        call_no: string;
        subject: string;
        series: string;
        edition: string;
        url: string;
        description: string;
        location: string;
    };
    errors: {
        isbn?: string;
        isbn13?: string;
        call_no?: string;
        subject?: string;
        series?: string;
        edition?: string;
        url?: string;
        description?: string;
        location?: string;
    };
    onDataChange: (field: string, value: any) => void;
    onClearErrors: (field: string) => void;
}

export default function AdditionalDetailsSection({
    data,
    errors,
    onDataChange,
    onClearErrors,
}: AdditionalDetailsSectionProps) {
    return (
        <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Additional Details
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Optional metadata and cataloging information
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="isbn" value="ISBN" />
                    <TextInput
                        id="isbn"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.isbn}
                        onChange={(e) => {
                            onDataChange("isbn", e.target.value);
                            onClearErrors("isbn");
                        }}
                    />
                    <InputError message={errors.isbn} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="isbn13" value="ISBN-13" />
                    <TextInput
                        id="isbn13"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.isbn13}
                        onChange={(e) => {
                            onDataChange("isbn13", e.target.value);
                            onClearErrors("isbn13");
                        }}
                    />
                    <InputError message={errors.isbn13} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="call_no" value="Call Number" />
                    <TextInput
                        id="call_no"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.call_no}
                        onChange={(e) => {
                            onDataChange("call_no", e.target.value);
                            onClearErrors("call_no");
                        }}
                    />
                    <InputError message={errors.call_no} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="subject" value="Subject" />
                    <TextInput
                        id="subject"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.subject}
                        onChange={(e) => {
                            onDataChange("subject", e.target.value);
                            onClearErrors("subject");
                        }}
                    />
                    <InputError message={errors.subject} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="series" value="Series" />
                    <TextInput
                        id="series"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.series}
                        onChange={(e) => {
                            onDataChange("series", e.target.value);
                            onClearErrors("series");
                        }}
                    />
                    <InputError message={errors.series} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="edition" value="Edition" />
                    <TextInput
                        id="edition"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.edition}
                        onChange={(e) => {
                            onDataChange("edition", e.target.value);
                            onClearErrors("edition");
                        }}
                    />
                    <InputError message={errors.edition} className="mt-1" />
                </div>

                <div className="sm:col-span-2">
                    <InputLabel htmlFor="url" value="URL" />
                    <TextInput
                        id="url"
                        type="url"
                        className="mt-1 block w-full"
                        value={data.url}
                        onChange={(e) => {
                            onDataChange("url", e.target.value);
                            onClearErrors("url");
                        }}
                        placeholder="https://..."
                    />
                    <InputError message={errors.url} className="mt-1" />
                </div>

                <div className="sm:col-span-2">
                    <InputLabel htmlFor="description" value="Description" />
                    <textarea
                        id="description"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        value={data.description}
                        onChange={(e) => {
                            onDataChange("description", e.target.value);
                            onClearErrors("description");
                        }}
                        placeholder="Brief description of this item..."
                    />
                    <InputError message={errors.description} className="mt-1" />
                </div>

                <div className="sm:col-span-2">
                    <InputLabel htmlFor="location" value="Location" />
                    <select
                        id="location"
                        value={data.location}
                        onChange={(e) => {
                            onDataChange("location", e.target.value);
                            onClearErrors("location");
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                        <option value="">Select Location</option>
                        <option value="Filipianna">Filipianna</option>
                        <option value="Circulation">Circulation</option>
                        <option value="Theses">Theses</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Reserve">Reserve</option>
                    </select>
                    <InputError message={errors.location} className="mt-1" />
                </div>
            </div>
        </div>
    );
}
