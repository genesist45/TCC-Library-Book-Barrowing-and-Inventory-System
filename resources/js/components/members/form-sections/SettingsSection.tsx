import Checkbox from '@/components/forms/Checkbox';
import InputError from '@/components/forms/InputError';

interface SettingsSectionProps {
    data: {
        allow_login: boolean;
    };
    errors: {
        allow_login?: string;
    };
    showErrors: {
        allow_login: boolean;
    };
    onDataChange: (field: any, value: string | boolean | number) => void;
}

export default function SettingsSection({
    data,
    errors,
    showErrors,
    onDataChange,
}: SettingsSectionProps) {
    return (
        <div className="mt-4">
            <label className="flex items-center">
                <Checkbox
                    checked={data.allow_login}
                    onChange={(e) => onDataChange('allow_login', e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Allow this member to login to the system
                </span>
            </label>
            <InputError message={showErrors.allow_login ? errors.allow_login : ''} className="mt-1" />
        </div>
    );
}
