import InputLabel from '@/components/forms/InputLabel';
import InputError from '@/components/forms/InputError';

interface AddressSectionProps {
    data: {
        address: string;
    };
    errors: {
        address?: string;
    };
    showErrors: {
        address: boolean;
    };
    onDataChange: (field: any, value: string | boolean | number) => void;
}

export default function AddressSection({
    data,
    errors,
    showErrors,
    onDataChange,
}: AddressSectionProps) {
    return (
        <div className="mt-4">
            <InputLabel htmlFor="address" value="Address" />
            <textarea
                id="address"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                value={data.address}
                onChange={(e) => onDataChange('address', e.target.value)}
                placeholder="Member's address..."
            />
            <InputError message={showErrors.address ? errors.address : ''} className="mt-1" />
        </div>
    );
}
