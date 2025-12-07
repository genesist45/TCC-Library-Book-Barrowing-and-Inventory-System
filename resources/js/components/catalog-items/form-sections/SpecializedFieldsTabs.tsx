import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";

interface SpecializedFieldsData {
    volume: string;
    page_duration: string;
    abstract: string;
    biblio_info: string;
    url_visibility: string;
    library_branch: string;
    issn: string;
    frequency: string;
    journal_type: string;
    issue_type: string;
    issue_period: string;
    granting_institution: string;
    degree_qualification: string;
    supervisor: string;
    thesis_date: string;
    thesis_period: string;
    publication_type: string;
    type: string;
}

interface SpecializedFieldsErrors {
    volume?: string;
    page_duration?: string;
    abstract?: string;
    biblio_info?: string;
    url_visibility?: string;
    library_branch?: string;
    issn?: string;
    frequency?: string;
    journal_type?: string;
    issue_type?: string;
    issue_period?: string;
    granting_institution?: string;
    degree_qualification?: string;
    supervisor?: string;
    thesis_date?: string;
    thesis_period?: string;
    publication_type?: string;
}

interface SpecializedFieldsTabsProps {
    data: SpecializedFieldsData;
    errors: SpecializedFieldsErrors;
    activeTab: 'detail' | 'journal' | 'thesis';
    onTabChange: (tab: 'detail' | 'journal' | 'thesis') => void;
    onDataChange: (field: string, value: any) => void;
    onClearErrors: (field: string) => void;
}

export default function SpecializedFieldsTabs({
    data,
    errors,
    activeTab,
    onTabChange,
    onDataChange,
    onClearErrors,
}: SpecializedFieldsTabsProps) {
    return (
        <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Specialized Fields
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Additional information for specific material types
            </p>

            <div className="mt-4">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            type="button"
                            onClick={() => onTabChange('detail')}
                            className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                                activeTab === 'detail'
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            DETAIL
                        </button>
                        <button
                            type="button"
                            onClick={() => onTabChange('journal')}
                            className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                                activeTab === 'journal'
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            JOURNAL
                        </button>
                        <button
                            type="button"
                            onClick={() => onTabChange('thesis')}
                            className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                                activeTab === 'thesis'
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            THESIS
                        </button>
                    </nav>
                </div>

                <div className="mt-6">
                    {activeTab === 'detail' && (
                        <DetailTabContent
                            data={data}
                            errors={errors}
                            onDataChange={onDataChange}
                            onClearErrors={onClearErrors}
                        />
                    )}

                    {activeTab === 'journal' && (
                        <JournalTabContent
                            data={data}
                            errors={errors}
                            onDataChange={onDataChange}
                            onClearErrors={onClearErrors}
                        />
                    )}

                    {activeTab === 'thesis' && (
                        <ThesisTabContent
                            data={data}
                            errors={errors}
                            onDataChange={onDataChange}
                            onClearErrors={onClearErrors}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

interface TabContentProps {
    data: SpecializedFieldsData;
    errors: SpecializedFieldsErrors;
    onDataChange: (field: string, value: any) => void;
    onClearErrors: (field: string) => void;
}

function DetailTabContent({ data, errors, onDataChange, onClearErrors }: TabContentProps) {
    return (
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
    );
}

function JournalTabContent({ data, errors, onDataChange, onClearErrors }: TabContentProps) {
    return (
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
    );
}

function ThesisTabContent({ data, errors, onDataChange, onClearErrors }: TabContentProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
                <InputLabel htmlFor="granting_institution" value="Granting Institution" required={data.type === 'Thesis'} />
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
                <InputLabel htmlFor="degree_qualification" value="Degree / Qualification" required={data.type === 'Thesis'} />
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
    );
}
