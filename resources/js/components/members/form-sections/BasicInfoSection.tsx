import InputLabel from '@/components/forms/InputLabel';
import TextInput from '@/components/forms/TextInput';
import InputError from '@/components/forms/InputError';

interface BasicInfoSectionProps {
    data: {
        member_no: string;
        name: string;
        type: string;
        status: string;
    };
    errors: {
        member_no?: string;
        name?: string;
        type?: string;
        status?: string;
    };
    showErrors: {
        member_no: boolean;
        name: boolean;
        type: boolean;
        status: boolean;
    };
    onDataChange: (field: any, value: string | boolean | number) => void;
}

export default function BasicInfoSection({
    data,
    errors,
    showErrors,
    onDataChange,
}: BasicInfoSectionProps) {
    return (
        <>
            <div>
                <InputLabel htmlFor="member_no" value="Member Number" required />
                <TextInput
                    id="member_no"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.member_no}
                    onChange={(e) => onDataChange('member_no', e.target.value)}
                    placeholder="e.g., MEM-2025-001"
                />
                <InputError message={showErrors.member_no ? errors.member_no : ''} className="mt-1" />
            </div>

            <div>
                <InputLabel htmlFor="name" value="Full Name" required />
                <TextInput
                    id="name"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => onDataChange('name', e.target.value)}
                    placeholder="e.g., John Doe"
                />
                <InputError message={showErrors.name ? errors.name : ''} className="mt-1" />
            </div>

            <div>
                <InputLabel htmlFor="type" value="Member Type" required />
                <select
                    id="type"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                    value={data.type}
                    onChange={(e) => onDataChange('type', e.target.value)}
                >
                    <option value="Regular">Regular</option>
                    <option value="Privileged">Privileged</option>
                </select>
                <InputError message={showErrors.type ? errors.type : ''} className="mt-1" />
            </div>

            <div>
                <InputLabel htmlFor="status" value="Status" required />
                <select
                    id="status"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                    value={data.status}
                    onChange={(e) => onDataChange('status', e.target.value)}
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                </select>
                <InputError message={showErrors.status ? errors.status : ''} className="mt-1" />
            </div>
        </>
    );
}
