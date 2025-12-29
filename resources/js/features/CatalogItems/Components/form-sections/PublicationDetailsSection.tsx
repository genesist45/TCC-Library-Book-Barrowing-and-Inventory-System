import { Plus } from "lucide-react";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import SearchableSelect from "@/components/common/SearchableSelect";
import { Publisher } from "@/types";

interface PublicationDetailsSectionProps {
    data: {
        place_of_publication: string;
        publisher_id: string;
        year: string;
    };
    errors: {
        place_of_publication?: string;
        publisher_id?: string;
        year?: string;
    };
    publishers: Publisher[];
    onDataChange: (field: string, value: any) => void;
    onClearErrors: (field: string) => void;
    onShowPublisherModal: () => void;
}

export default function PublicationDetailsSection({
    data,
    errors,
    publishers,
    onDataChange,
    onClearErrors,
    onShowPublisherModal,
}: PublicationDetailsSectionProps) {
    return (
        <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Publication Details
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Information about the publication
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <InputLabel htmlFor="place_of_publication" value="Place of Publication" />
                    <TextInput
                        id="place_of_publication"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.place_of_publication}
                        onChange={(e) => {
                            onDataChange("place_of_publication", e.target.value);
                            onClearErrors("place_of_publication");
                        }}
                        placeholder="e.g., New York, London"
                    />
                    <InputError message={errors.place_of_publication} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="publisher_id" value="Publisher" />
                    <div className="mt-1">
                        <SearchableSelect
                            options={publishers.map(pub => ({ id: pub.id, label: pub.name }))}
                            value={data.publisher_id}
                            onChange={(value) => {
                                onDataChange("publisher_id", value);
                                onClearErrors("publisher_id");
                            }}
                            placeholder="Search publishers..."
                        />
                    </div>
                    <button
                        type="button"
                        onClick={onShowPublisherModal}
                        className="mt-2 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        <Plus className="h-3 w-3" />
                        Publisher not listed? Click here to add.
                    </button>
                    <InputError message={errors.publisher_id} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="year" value="Year of Publication" />
                    <TextInput
                        id="year"
                        type="number"
                        className="mt-1 block w-full"
                        value={data.year}
                        onChange={(e) => {
                            onDataChange("year", e.target.value);
                            onClearErrors("year");
                        }}
                        placeholder="e.g., 2024"
                        min="1000"
                        max={new Date().getFullYear() + 10}
                    />
                    <InputError message={errors.year} className="mt-1" />
                </div>
            </div>
        </div>
    );
}
