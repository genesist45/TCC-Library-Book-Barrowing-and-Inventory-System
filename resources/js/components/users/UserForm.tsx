import { FormEventHandler, useState, useEffect, useCallback } from 'react';
import InputLabel from '@/components/forms/InputLabel';
import TextInput from '@/components/forms/TextInput';
import InputError from '@/components/forms/InputError';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';

interface UserFormProps {
    mode: 'add' | 'edit';
    data: {
        name: string;
        first_name?: string;
        last_name?: string;
        email: string;
        role: 'admin' | 'staff' | '';
        password: string;
        password_confirmation: string;
    };
    errors: {
        name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        role?: string;
        password?: string;
        password_confirmation?: string;
    };
    processing: boolean;
    onSubmit: FormEventHandler;
    onChange: (field: string, value: string) => void;
    onCancel: () => void;
}

export default function UserForm({
    mode,
    data,
    errors,
    processing,
    onSubmit,
    onChange,
    onCancel,
}: UserFormProps) {
    const [localErrors, setLocalErrors] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: '',
    });

    const [touched, setTouched] = useState({
        first_name: false,
        last_name: false,
        email: false,
        role: false,
        password: false,
        password_confirmation: false,
    });

    const [backendEmailError, setBackendEmailError] = useState('');
    const [showEmailError, setShowEmailError] = useState(false);

    // Reset touched state when errors object becomes empty (modal reopened)
    useEffect(() => {
        const errorKeys = Object.keys(errors);
        const hasErrors = errorKeys.length > 0 && errorKeys.some(key => errors[key as keyof typeof errors]);
        
        if (!hasErrors) {
            setTouched({
                first_name: false,
                last_name: false,
                email: false,
                role: false,
                password: false,
                password_confirmation: false,
            });
            setLocalErrors({
                first_name: '',
                last_name: '',
                email: '',
                role: '',
                password: '',
                password_confirmation: '',
            });
            setBackendEmailError('');
            setShowEmailError(false);
        }
    }, [errors]);

    // Auto-dismiss email backend error after 3 seconds with fade
    useEffect(() => {
        if (errors.email) {
            setBackendEmailError(errors.email);
            setShowEmailError(true);
            
            const timer = setTimeout(() => {
                setShowEmailError(false);
                setTimeout(() => setBackendEmailError(''), 300); // Clear after fade out
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [errors.email]);

    const validateField = useCallback((field: string, value: string) => {
        let error = '';

        switch (field) {
            case 'first_name':
                if (!value.trim()) {
                    error = 'First name is required';
                }
                break;
            case 'last_name':
                if (!value.trim()) {
                    error = 'Last name is required';
                }
                break;
            case 'email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'role':
                if (!value) {
                    error = 'Please select a role';
                }
                break;
            case 'password':
                if (mode === 'add' && !value) {
                    error = 'Password is required';
                } else if (value && value.length < 8) {
                    error = 'Password must be at least 8 characters';
                }
                break;
            case 'password_confirmation':
                if (mode === 'add' && !value) {
                    error = 'Please confirm your password';
                } else if (value && value !== data.password) {
                    error = 'Passwords do not match';
                }
                break;
        }

        return error;
    }, [mode, data.password]);

    const handleChange = (field: string, value: string) => {
        onChange(field, value);
        
        // Only mark non-password fields as touched while typing
        if (field !== 'password' && field !== 'password_confirmation') {
            setTouched({ ...touched, [field]: true });
        }
        
        const error = validateField(field, value);
        setLocalErrors({ ...localErrors, [field]: error });

        if (field === 'password' && data.password_confirmation) {
            const confirmError = validateField('password_confirmation', data.password_confirmation);
            setLocalErrors(prev => ({ ...prev, password_confirmation: confirmError }));
        }
    };

    useEffect(() => {
        // Only update validation state, but don't show error until form submission
        if (data.password_confirmation) {
            const confirmError = validateField('password_confirmation', data.password_confirmation);
            setLocalErrors(prev => ({ ...prev, password_confirmation: confirmError }));
        }
    }, [data.password, data.password_confirmation, validateField]);

    useEffect(() => {
        // Mark fields as touched when backend errors arrive
        if (errors.email || errors.password || errors.password_confirmation || errors.first_name || errors.last_name || errors.role) {
            setTouched(prev => ({
                ...prev,
                email: errors.email ? true : prev.email,
                password: errors.password ? true : prev.password,
                password_confirmation: errors.password_confirmation ? true : prev.password_confirmation,
                first_name: errors.first_name ? true : prev.first_name,
                last_name: errors.last_name ? true : prev.last_name,
                role: errors.role ? true : prev.role,
            }));
        }
    }, [errors]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        const newTouched = {
            first_name: true,
            last_name: true,
            email: true,
            role: true,
            password: true,
            password_confirmation: true,
        };
        setTouched(newTouched);

        const newErrors = {
            first_name: validateField('first_name', data.first_name || ''),
            last_name: validateField('last_name', data.last_name || ''),
            email: validateField('email', data.email),
            role: validateField('role', data.role),
            password: validateField('password', data.password),
            password_confirmation: validateField('password_confirmation', data.password_confirmation),
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
                {mode === 'add' ? 'Add New User' : 'Edit User'}
            </h2>
            <p className="mt-1 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                {mode === 'add' 
                    ? 'Fill in the information below to create a new user account'
                    : 'Update the user information below'
                }
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                    <InputLabel htmlFor="first_name" value="First Name" />
                    <TextInput
                        id="first_name"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.first_name || ''}
                        onChange={(e) => handleChange('first_name', e.target.value)}
                    />
                    <InputError message={touched.first_name ? localErrors.first_name : ''} className="mt-1" />
                </div>
                <div>
                    <InputLabel htmlFor="last_name" value="Last Name" />
                    <TextInput
                        id="last_name"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.last_name || ''}
                        onChange={(e) => handleChange('last_name', e.target.value)}
                    />
                    <InputError message={touched.last_name ? localErrors.last_name : ''} className="mt-1" />
                </div>
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="email" value="Email" />
                <TextInput
                    id="email"
                    type="email"
                    className="mt-1 block w-full"
                    value={data.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                />
                {touched.email && localErrors.email && (
                    <InputError message={localErrors.email} className="mt-1" />
                )}
                {touched.email && !localErrors.email && backendEmailError && (
                    <div className={`transition-opacity duration-300 ${showEmailError ? 'opacity-100' : 'opacity-0'}`}>
                        <InputError message={backendEmailError} className="mt-1" />
                    </div>
                )}
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="role" value="Role" />
                <select
                    id="role"
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                    value={data.role || ''}
                    onChange={(e) => {
                        onChange('role', e.target.value);
                        setTouched({ ...touched, role: true });
                        const error = validateField('role', e.target.value);
                        setLocalErrors({ ...localErrors, role: error });
                    }}
                >
                    {mode === 'add' && <option value="">Select a role</option>}
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                </select>
                <InputError message={touched.role ? (localErrors.role || errors.role) : ''} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel
                    htmlFor="password"
                    value={mode === 'edit' ? 'Password (leave blank to keep current)' : 'Password'}
                />
                <TextInput
                    id="password"
                    type="password"
                    className="mt-1 block w-full"
                    value={data.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                />
                <InputError message={touched.password ? (localErrors.password || errors.password) : ''} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                <TextInput
                    id="password_confirmation"
                    type="password"
                    className="mt-1 block w-full"
                    value={data.password_confirmation}
                    onChange={(e) => handleChange('password_confirmation', e.target.value)}
                />
                <InputError message={touched.password_confirmation ? (localErrors.password_confirmation || errors.password_confirmation) : ''} className="mt-1" />
            </div>

            <div className="mt-4 flex justify-end gap-3">
                <SecondaryButton type="button" onClick={onCancel}>
                    Cancel
                </SecondaryButton>
                <PrimaryButton disabled={processing}>
                    {mode === 'add' ? 'Add User' : 'Update User'}
                </PrimaryButton>
            </div>
        </form>
    );
}

