import InputLabel from '@/components/forms/InputLabel';
import TextInput from '@/components/forms/TextInput';
import InputError from '@/components/forms/InputError';

interface ContactInfoSectionProps {
    data: {
        email: string;
        phone: string;
    };
    errors: {
        email?: string;
        phone?: string;
    };
    showErrors: {
        email: boolean;
        phone: boolean;
    };
    onDataChange: (field: any, value: string | boolean | number) => void;
}

export default function ContactInfoSection({
    data,
    errors,
    showErrors,
    onDataChange,
}: ContactInfoSectionProps) {
    return (
        <>
            <div>
                <InputLabel htmlFor="email" value="Email" />
                <TextInput
                    id="email"
                    type="email"
                    className="mt-1 block w-full"
                    value={data.email}
                    onChange={(e) => onDataChange('email', e.target.value)}
                    placeholder="member@example.com"
                />
                <InputError message={showErrors.email ? errors.email : ''} className="mt-1" />
            </div>

            <div>
                <InputLabel htmlFor="phone" value="Phone Number" />
                <TextInput
                    id="phone"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.phone}
                    onChange={(e) => onDataChange('phone', e.target.value)}
                    placeholder="+1234567890"
                />
                <InputError message={showErrors.phone ? errors.phone : ''} className="mt-1" />
            </div>
        </>
    );
}
