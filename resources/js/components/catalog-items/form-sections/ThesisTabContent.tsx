import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";

interface ThesisTabContentProps {
    data: {
        type: string;
        granting_institution: string;
        degree_qualification: string;
        supervisor: string;
        thesis_date: string;
        thesis_period: string;
        publication_type: string;
    };
    errors: {
        granting_institution?: string;
        degree_qualification?: string;
        supervisor?: string;
        thesis_date?: string;
        thesis_period?: string;
        publication_type?: string;
    };
    onDataChange: (field: string, value: any) => void;
    onClearErrors: (field: string) => void;
}

export default function ThesisTabContent({
    data,
    errors,
    onDataChange,
    onClearErrors,
}: ThesisTabContentProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Thesis Information
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Academic thesis and dissertation details
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <InputLabel
                        htmlFor="granting_institution"
                        value="Granting Institution"
                        required={data.type === "Thesis"}
                    />
                    <TextInput
                        id="granting_institution"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.granting_institution}
                        onChange={(e) => {
                            onDataChange("granting_institution", e.target.value);
                            onClearErrors("granting_institution");
                        }}
                        placeholder="e.g., University of the Philippines"
                    />
                    <InputError message={errors.granting_institution} className="mt-1" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="degree_qualification"
                        value="Degree / Qualification"
                        required={data.type === "Thesis"}
                    />
                    <select
                        id="degree_qualification"
                        value={data.degree_qualification}
                        onChange={(e) => {
                            onDataChange("degree_qualification", e.target.value);
                            onClearErrors("degree_qualification");
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                        <option value="">Select Degree</option>
                        <option value="Ph.D.">Ph.D.</option>
                        <option value="M.A.">M.A.</option>
                        <option value="M.S.">M.S.</option>
                        <option value="MBA">MBA</option>
                        <option value="Ed.D.">Ed.D.</option>
                        <option value="Other">Other</option>
                    </select>
                    <InputError message={errors.degree_qualification} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="supervisor" value="Supervisor" />
                    <TextInput
                        id="supervisor"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.supervisor}
                        onChange={(e) => {
                            onDataChange("supervisor", e.target.value);
                            onClearErrors("supervisor");
                        }}
                        placeholder="e.g., Dr. Juan Dela Cruz"
                    />
                    <InputError message={errors.supervisor} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="thesis_date" value="Date" />
                    <TextInput
                        id="thesis_date"
                        type="date"
                        className="mt-1 block w-full"
                        value={data.thesis_date}
                        onChange={(e) => {
                            onDataChange("thesis_date", e.target.value);
                            onClearErrors("thesis_date");
                        }}
                    />
                    <InputError message={errors.thesis_date} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="thesis_period" value="Period" />
                    <TextInput
                        id="thesis_period"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.thesis_period}
                        onChange={(e) => {
                            onDataChange("thesis_period", e.target.value);
                            onClearErrors("thesis_period");
                        }}
                        placeholder="e.g., 2023-2024"
                    />
                    <InputError message={errors.thesis_period} className="mt-1" />
                </div>

                <div className="sm:col-span-2">
                    <InputLabel htmlFor="publication_type" value="Publication Type" />
                    <select
                        id="publication_type"
                        value={data.publication_type}
                        onChange={(e) => {
                            onDataChange("publication_type", e.target.value);
                            onClearErrors("publication_type");
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                        <option value="">Select Type</option>
                        <option value="Master's Thesis">Master's Thesis</option>
                        <option value="Doctoral Dissertation">Doctoral Dissertation</option>
                        <option value="Undergraduate Thesis">Undergraduate Thesis</option>
                        <option value="Research Paper">Research Paper</option>
                    </select>
                    <InputError message={errors.publication_type} className="mt-1" />
                </div>
            </div>
        </div>
    );
}
