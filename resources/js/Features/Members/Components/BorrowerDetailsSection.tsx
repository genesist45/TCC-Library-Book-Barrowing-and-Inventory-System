import InputLabel from '@/components/forms/InputLabel';
import TextInput from '@/components/forms/TextInput';
import InputError from '@/components/forms/InputError';

interface BorrowerDetailsSectionProps {
    data: {
        borrower_category: string;
        member_group: string;
        booking_quota: string | number;
    };
    errors: {
        borrower_category?: string;
        member_group?: string;
        booking_quota?: string;
    };
    showErrors: {
        borrower_category: boolean;
        member_group: boolean;
        booking_quota: boolean;
    };
    onDataChange: (field: any, value: string | boolean | number) => void;
}

export default function BorrowerDetailsSection({
    data,
    errors,
    showErrors,
    onDataChange,
}: BorrowerDetailsSectionProps) {
    return (
        <>
            <div>
                <InputLabel htmlFor="borrower_category" value="Borrower Category" required />
                <select
                    id="borrower_category"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                    value={data.borrower_category}
                    onChange={(e) => onDataChange('borrower_category', e.target.value)}
                >
                    <option value="">Select a borrower</option>
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                </select>
                <InputError message={showErrors.borrower_category ? errors.borrower_category : ''} className="mt-1" />
            </div>

            <div>
                <InputLabel htmlFor="member_group" value="Member Group" />
                <TextInput
                    id="member_group"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.member_group}
                    onChange={(e) => onDataChange('member_group', e.target.value)}
                    placeholder="e.g., Students, Faculty"
                />
                <InputError message={showErrors.member_group ? errors.member_group : ''} className="mt-1" />
            </div>

            <div>
                <InputLabel htmlFor="booking_quota" value="Booking Quota" />
                <TextInput
                    id="booking_quota"
                    type="number"
                    className="mt-1 block w-full"
                    value={data.booking_quota}
                    onChange={(e) => onDataChange('booking_quota', e.target.value)}
                    placeholder="e.g., 5"
                    min="0"
                />
                <InputError message={showErrors.booking_quota ? errors.booking_quota : ''} className="mt-1" />
            </div>
        </>
    );
}
