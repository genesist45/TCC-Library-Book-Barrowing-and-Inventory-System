import { FormEventHandler, useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/components/forms/InputLabel';
import TextInput from '@/components/forms/TextInput';
import InputError from '@/components/forms/InputError';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { toast } from 'react-toastify';

interface Author {
    id: number;
    name: string;
    country: string;
    bio?: string;
    is_published: boolean;
}

interface AuthorFormProps {
    mode: 'add' | 'edit';
    author?: Author | null;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function AuthorForm({
    mode,
    author,
    onCancel,
    onSuccess,
}: AuthorFormProps) {
    const { data, setData, post, patch, processing, errors, clearErrors, reset } = useForm({
        name: author?.name || '',
        country: author?.country || '',
        bio: author?.bio || '',
        is_published: author?.is_published ?? true,
    });

    const [fieldTouched, setFieldTouched] = useState({
        name: false,
        country: false,
        bio: false,
    });

    useEffect(() => {
        if (mode === 'add') {
            reset();
            setFieldTouched({
                name: false,
                country: false,
                bio: false,
            });
        } else if (author) {
            setData({
                name: author.name || '',
                country: author.country || '',
                bio: author.bio || '',
                is_published: author.is_published ?? true,
            });
            setFieldTouched({
                name: false,
                country: false,
                bio: false,
            });
        }
    }, [mode, author]);

    const handleFieldChange = (field: keyof typeof fieldTouched, value: string) => {
        setData(field, value);

        if (errors[field]) {
            clearErrors(field);
        }

        if (!fieldTouched[field]) {
            setFieldTouched(prev => ({ ...prev, [field]: true }));
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        setFieldTouched({
            name: true,
            country: true,
            bio: true,
        });

        if (mode === 'add') {
            post(route('admin.authors.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Author created successfully!');
                    reset();
                    setFieldTouched({
                        name: false,
                        country: false,
                        bio: false,
                    });
                    onSuccess();
                },
            });
        } else if (author) {
            patch(route('admin.authors.update', author.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Author updated successfully!');
                    onSuccess();
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">
                {mode === 'add' ? 'Add New Author' : 'Edit Author'}
            </h2>
            <p className="mt-1 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                {mode === 'add'
                    ? 'Fill in the information below to create a new author'
                    : 'Update the author information below'
                }
            </p>

            <div className="mt-4">
                <InputLabel htmlFor="name" value="Name" required />
                <TextInput
                    id="name"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                />
                <InputError message={errors.name} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="country" value="Country" required />
                <TextInput
                    id="country"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.country}
                    onChange={(e) => handleFieldChange('country', e.target.value)}
                    placeholder="e.g., United States"
                />
                <InputError message={errors.country} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="bio" value="Bio" />
                <textarea
                    id="bio"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                    value={data.bio}
                    onChange={(e) => handleFieldChange('bio', e.target.value)}
                    placeholder="Brief biography of this author..."
                />
                <InputError message={errors.bio} className="mt-1" />
            </div>

            <div className="mt-3">
                <div className="flex items-center justify-between">
                    <div>
                        <InputLabel htmlFor="is_published" value="Status" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Make this author visible to users</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setData('is_published', !data.is_published)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${data.is_published ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                        role="switch"
                        aria-checked={data.is_published}
                        aria-labelledby="is_published"
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${data.is_published ? 'translate-x-5' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>
                <div className="mt-1">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${data.is_published
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
                    {mode === 'add' ? 'Add Author' : 'Update Author'}
                </PrimaryButton>
            </div>
        </form>
    );
}
