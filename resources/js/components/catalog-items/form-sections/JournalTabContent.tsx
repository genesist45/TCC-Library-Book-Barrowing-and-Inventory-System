import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";

interface JournalTabContentProps {
    data: {
        issn: string;
        frequency: string;
        journal_type: string;
        issue_type: string;
        issue_period: string;
    };
    errors: {
        issn?: string;
        frequency?: string;
        journal_type?: string;
        issue_type?: string;
        issue_period?: string;
    };
    onDataChange: (field: string, value: any) => void;
    onClearErrors: (field: string) => void;
}

export default function JournalTabContent({
    data,
    errors,
    onDataChange,
    onClearErrors,
}: JournalTabContentProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Journal Information
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Specific fields for journal and periodical materials
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="issn" value="ISSN" />
                    <TextInput
                        id="issn"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.issn}
                        onChange={(e) => {
                            onDataChange("issn", e.target.value);
                            onClearErrors("issn");
                        }}
                        placeholder="e.g., 1234-5678"
                    />
                    <InputError message={errors.issn} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="frequency" value="Frequency" />
                    <select
                        id="frequency"
                        value={data.frequency}
                        onChange={(e) => {
                            onDataChange("frequency", e.target.value);
                            onClearErrors("frequency");
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                        <option value="">Select Frequency</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Annually">Annually</option>
                        <option value="Biannually">Biannually</option>
                    </select>
                    <InputError message={errors.frequency} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="journal_type" value="Journal Type" />
                    <TextInput
                        id="journal_type"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.journal_type}
                        onChange={(e) => {
                            onDataChange("journal_type", e.target.value);
                            onClearErrors("journal_type");
                        }}
                        placeholder="e.g., Academic, Trade"
                    />
                    <InputError message={errors.journal_type} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="issue_type" value="Issue Type" />
                    <TextInput
                        id="issue_type"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.issue_type}
                        onChange={(e) => {
                            onDataChange("issue_type", e.target.value);
                            onClearErrors("issue_type");
                        }}
                        placeholder="e.g., Special Issue"
                    />
                    <InputError message={errors.issue_type} className="mt-1" />
                </div>

                <div className="sm:col-span-2">
                    <InputLabel htmlFor="issue_period" value="Issue Period" />
                    <TextInput
                        id="issue_period"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.issue_period}
                        onChange={(e) => {
                            onDataChange("issue_period", e.target.value);
                            onClearErrors("issue_period");
                        }}
                        placeholder="e.g., Summer, Q3"
                    />
                    <InputError message={errors.issue_period} className="mt-1" />
                </div>
            </div>
        </div>
    );
}
