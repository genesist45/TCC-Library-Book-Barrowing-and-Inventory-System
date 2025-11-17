import { FormEventHandler, useState, useEffect, useCallback } from 'react';
import InputLabel from '@/components/forms/InputLabel';
import TextInput from '@/components/forms/TextInput';
import InputError from '@/components/forms/InputError';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';

interface PublisherFormProps {
    mode: 'add' | 'edit';
    data: {
        name: string;
        country: string;
        description: string;
        is_published: boolean;
    };
    errors: {
        name?: string;
        country?: string;
        description?: string;
        is_published?: string;
    };
    processing: boolean;
    onSubmit: FormEventHandler;
    onChange: (field: string, value: string | boolean) => void;
    onCancel: () => void;
}

export default function PublisherForm({
    mode,
    data,
    errors,
    processing,
    onSubmit,
    onChange,
    onCancel,
}: PublisherFormProps) {
    const [localErrors, setLocalErrors] = useState({
        name: '',
        country: '',
        description: '',
    });

    const [touched, setTouched] = useState({
        name: false,
        country: false,
        description: false,
    });

    useEffect(() => {
        const errorKeys = Object.keys(errors);
        const hasErrors = errorKeys.length > 0 && errorKeys.some(key => errors[key as keyof typeof errors]);
        
        if (!hasErrors) {
            setTouched({
                name: false,
                country: false,
                description: false,
            });
            setLocalErrors({
                name: '',
                country: '',
                description: '',
            });
        }
    }, [errors]);

    const validateField = useCallback((field: string, value: string) => {
        let error = '';

        switch (field) {
            case 'name':
                if (!value.trim()) {
                    error = 'Publisher name is required';
                }
                break;
            case 'country':
                if (!value.trim()) {
                    error = 'Country is required';
                }
                break;
        }

        return error;
    }, []);

    const handleChange = (field: string, value: string) => {
        onChange(field, value);
        setTouched({ ...touched, [field]: true });
        const error = validateField(field, value);
        setLocalErrors({ ...localErrors, [field]: error });
    };

    useEffect(() => {
        if (errors.name || errors.country || errors.description) {
            setTouched(prev => ({
                ...prev,
                name: errors.name ? true : prev.name,
                country: errors.country ? true : prev.country,
                description: errors.description ? true : prev.description,
            }));
        }
    }, [errors]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        const newTouched = {
            name: true,
            country: true,
            description: true,
        };
        setTouched(newTouched);

        const newErrors = {
            name: validateField('name', data.name),
            country: validateField('country', data.country),
            description: '',
        };
        setLocalErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== '');
        if (!hasErrors) {
            onSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">
                {mode === 'add' ? 'Add New Publisher' : 'Edit Publisher'}
            </h2>
            <p className="mt-1 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                {mode === 'add' 
                    ? 'Fill in the information below to create a new publisher'
                    : 'Update the publisher information below'
                }
            </p>

            <div className="mt-4">
                <InputLabel htmlFor="name" value="Name" required />
                <TextInput
                    id="name"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
                <InputError message={touched.name ? (localErrors.name || errors.name) : ''} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="country" value="Country" required />
                <TextInput
                    id="country"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="e.g., United States"
                />
                <InputError message={touched.country ? (localErrors.country || errors.country) : ''} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="description" value="Description" />
                <textarea
                    id="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                    value={data.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Brief description of this publisher..."
                />
                <InputError message={touched.description ? (localErrors.description || errors.description) : ''} className="mt-1" />
            </div>

            <div className="mt-3">
                <div className="flex items-center justify-between">
                    <div>
                        <InputLabel htmlFor="is_published" value="Status" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Make this publisher visible to users</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onChange('is_published', !data.is_published)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            data.is_published ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        role="switch"
                        aria-checked={data.is_published}
                        aria-labelledby="is_published"
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                data.is_published ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                    </button>
                </div>
                <div className="mt-1">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        data.is_published
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    }`}>
                        {data.is_published ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
                <SecondaryButton type="button" onClick={onCancel}>
                    Cancel
                </SecondaryButton>
                <PrimaryButton disabled={processing}>
                    {mode === 'add' ? 'Add Publisher' : 'Update Publisher'}
                </PrimaryButton>
            </div>
        </form>
    );
}
