import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";

interface PhysicalDescriptionSectionProps {
    data: {
        extent: string;
        other_physical_details: string;
        dimensions: string;
    };
    errors: {
        extent?: string;
        other_physical_details?: string;
        dimensions?: string;
    };
    onDataChange: (field: string, value: any) => void;
    onClearErrors: (field: string) => void;
}

export default function PhysicalDescriptionSection({
    data,
    errors,
    onDataChange,
    onClearErrors,
}: PhysicalDescriptionSectionProps) {
    return (
        <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Physical Description
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Physical characteristics of the item
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <InputLabel htmlFor="extent" value="Extent" />
                    <TextInput
                        id="extent"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.extent}
                        onChange={(e) => {
                            onDataChange("extent", e.target.value);
                            onClearErrors("extent");
                        }}
                        placeholder="e.g., 320 pages"
                    />
                    <InputError message={errors.extent} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="other_physical_details" value="Other Physical Details" />
                    <TextInput
                        id="other_physical_details"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.other_physical_details}
                        onChange={(e) => {
                            onDataChange("other_physical_details", e.target.value);
                            onClearErrors("other_physical_details");
                        }}
                        placeholder="e.g., illustrations, maps"
                    />
                    <InputError message={errors.other_physical_details} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="dimensions" value="Dimensions" />
                    <TextInput
                        id="dimensions"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.dimensions}
                        onChange={(e) => {
                            onDataChange("dimensions", e.target.value);
                            onClearErrors("dimensions");
                        }}
                        placeholder="e.g., 24 cm"
                    />
                    <InputError message={errors.dimensions} className="mt-1" />
                </div>
            </div>
        </div>
    );
}
