import InputError from '@/components/forms/InputError';
import InputLabel from '@/components/forms/InputLabel';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import TextInput from '@/components/forms/TextInput';
import ConfirmModal from '@/components/modals/ConfirmModal';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useRef, useState, useEffect } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import defaultUserImage from '@/assets/images/avatars/default-user.png';
import { toast } from 'sonner';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [removingAvatar, setRemovingAvatar] = useState(false);
    const [successMessage, setSuccessMessage] = useState<'updated' | 'removed' | null>(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Auto-hide success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            onSuccess: () => {
                toast.success('Profile updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update profile');
            },
        });
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setValidationError('File size must be less than 5MB');
                setTimeout(() => setValidationError(null), 3000);
                return;
            }

            // Validate file type
            if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                setValidationError('Only PNG, JPG, and JPEG files are allowed');
                setTimeout(() => setValidationError(null), 3000);
                return;
            }

            setUploadingAvatar(true);
            router.post(route('profile.avatar.upload'), {
                profile_picture: file,
            }, {
                forceFormData: true,
                onSuccess: () => {
                    setSuccessMessage('updated');
                    toast.success('Profile picture uploaded!');
                    // Reset file input so same file can be selected again
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                },
                onError: () => {
                    toast.error('Failed to upload photo');
                },
                onFinish: () => setUploadingAvatar(false),
            });
        }
    };

    const handleAvatarRemove = () => {
        setShowRemoveModal(true);
    };

    const confirmRemoveAvatar = () => {
        setRemovingAvatar(true);
        router.delete(route('profile.avatar.remove'), {
            onSuccess: () => {
                setSuccessMessage('removed');
                setShowRemoveModal(false);
                toast.success('Profile picture removed!');
            },
            onError: () => {
                toast.error('Failed to remove photo');
            },
            onFinish: () => setRemovingAvatar(false),
        });
    };

    const getAvatarUrl = () => {
        if (user.profile_picture) {
            return `/storage/${user.profile_picture}`;
        }
        return defaultUserImage;
    };

    const hasCustomAvatar = () => {
        return !!user.profile_picture;
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Layout: Avatar on left, Form fields on right */}
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                    {/* Avatar Section - Left Side */}
                    <div className="flex w-full flex-col items-center space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6 transition-colors dark:border-[#3a3a3a] dark:bg-[#3a3a3a] lg:w-auto lg:items-center">

                        {/* Validation Error Message */}
                        {validationError && (
                            <div className="w-full rounded-md bg-red-50 p-3 lg:w-auto lg:min-w-[240px]">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-2">
                                        <p className="text-xs font-medium text-red-800">
                                            {validationError}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Avatar Circle */}
                        <div className="relative">
                            <img
                                src={getAvatarUrl()}
                                alt={user.name}
                                className="h-32 w-32 rounded-full object-cover ring-4 ring-gray-100 dark:ring-[#4a4a4a]"
                            />
                        </div>

                        {/* Avatar Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingAvatar}
                                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-[#1a1a1a]"
                            >
                                <Upload size={16} />
                                {uploadingAvatar ? 'Uploading...' : 'Upload'}
                            </button>

                            {hasCustomAvatar() && (
                                <button
                                    type="button"
                                    onClick={handleAvatarRemove}
                                    disabled={removingAvatar}
                                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:border-white dark:bg-[#3a3a3a] dark:text-gray-200 dark:hover:bg-[#4a4a4a] dark:focus:ring-offset-[#1a1a1a]"
                                >
                                    <Trash2 size={16} />
                                    {removingAvatar ? 'Removing...' : 'Remove'}
                                </button>
                            )}
                        </div>

                        <p className="text-center text-xs text-gray-500 dark:text-gray-200">
                            PNG, JPG or JPEG (Max 5MB)
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                    </div>

                    {/* Form Fields - Right Side */}
                    <div className="flex-1 space-y-6">
                        {/* First Name and Last Name in one row */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="first_name" value="First Name" />

                                <TextInput
                                    id="first_name"
                                    className="mt-1 block w-full"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    required
                                    isFocused
                                    autoComplete="given-name"
                                />

                                <InputError className="mt-2" message={errors.first_name} />
                            </div>

                            <div>
                                <InputLabel htmlFor="last_name" value="Last Name" />

                                <TextInput
                                    id="last_name"
                                    className="mt-1 block w-full"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    required
                                    autoComplete="family-name"
                                />

                                <InputError className="mt-2" message={errors.last_name} />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && user.email_verified_at === null && (
                            <div>
                                <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                                    Your email address is unverified.
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        Click here to re-send the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                        A new verification link has been sent to your
                                        email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing}>Save</PrimaryButton>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Saved.
                                </p>
                            </Transition>
                        </div>
                    </div>
                </div>
            </form>

            {/* Confirm Remove Avatar Modal */}
            <ConfirmModal
                show={showRemoveModal}
                title="Remove Profile Picture"
                message="Are you sure you want to remove your profile picture? This action will revert to the default avatar."
                confirmText="Remove"
                cancelText="Cancel"
                onConfirm={confirmRemoveAvatar}
                onCancel={() => setShowRemoveModal(false)}
                processing={removingAvatar}
            />
        </section>
    );
}
