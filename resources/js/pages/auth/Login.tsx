import GuestLayout from '@/layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import LoginHeader from '@/components/auth/LoginHeader';
import ValidationAlert from '@/components/auth/ValidationAlert';
import LoginForm from '@/components/auth/LoginForm';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        username: '',
        password: '',
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState<string>('');
    const [showAlert, setShowAlert] = useState(false);

    // Handle alert animation
    useEffect(() => {
        const hasError = !!(validationError || errors.username || errors.password);

        if (hasError) {
            // Trigger entrance animation
            setShowAlert(true);
        } else if (showAlert) {
            // Trigger exit animation then hide
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 300); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [validationError, errors.username, errors.password]);

    // Email validation regex
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Real-time username validation
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('username', value);

        // Clear validation error and server errors when username has content
        if (value && value.length >= 3) {
            setValidationError('');
            clearErrors('username');
        }
    };

    // Real-time password validation
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('password', value);

        // Clear validation error and server errors only when password reaches 8+ characters
        if (value.length >= 8) {
            setValidationError('');
            clearErrors('password');
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Client-side validation - show only first error
        if (!data.username) {
            setValidationError('Username is required');
            return;
        }

        if (data.username.length < 3) {
            setValidationError('Username must be at least 3 characters');
            return;
        }

        if (!data.password) {
            setValidationError('Password is required');
            return;
        }

        if (data.password.length < 8) {
            setValidationError('Password must be at least 8 characters');
            return;
        }

        // Clear validation errors before submit
        setValidationError('');

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <LoginHeader status={status} />

            <ValidationAlert
                message={validationError || errors.username || errors.password}
                show={!!(validationError || errors.username || errors.password)}
            />

            <LoginForm
                data={data}
                setData={setData}
                processing={processing}
                onSubmit={submit}
                onUsernameChange={handleUsernameChange}
                onPasswordChange={handlePasswordChange}
            />
        </GuestLayout>
    );
}
