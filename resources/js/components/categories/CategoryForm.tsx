import { FormEventHandler, useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/components/forms/InputLabel';
import TextInput from '@/components/forms/TextInput';
import InputError from '@/components/forms/InputError';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    is_published: boolean;
}

interface CategoryFormProps {
    mode: 'add' | 'edit';
    category?: Category | null;
    onCancel: () => void;
}

export default function CategoryForm({
    mode,
    category,
    onCancel,
}: CategoryFormProps) {
    const { data, setData, post, patch, processing, errors, clearErrors } = useForm({
        name: category?.name || '',
        slug: category?.slug || '',
        description: category?.description || '',
        is_published: category?.is_published ?? true,
    });

    const [showErrors, setShowErrors] = useState({
        name: true,
        slug: true,
        description: true,
        is_published: true,
    });

    useEffect(() => {
        if (category && mode === 'edit') {
            setData({
                name: category.name,
                slug: category.slug || '',
                description: category.description || '',
                is_published: category.is_published,
            });
        }
    }, [category, mode]);

    const handleChange = (field: keyof typeof data, value: string | boolean) => {
        setData(field, value);
        setShowErrors({ ...showErrors, [field]: false });
        if (errors[field]) {
            clearErrors(field);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        setShowErrors({
            name: true,
            slug: true,
            description: true,
            is_published: true,
        });

        if (mode === 'add') {
            post(route('admin.categories.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Category created successfully!');
                    onCancel();
                },
            });
        } else if (mode === 'edit' && category) {
            patch(route('admin.categories.update', category.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Category updated successfully!');
                    onCancel();
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">
                {mode === 'add' ? 'Add New Category' : 'Edit Category'}
            </h2>
            <p className="mt-1 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                {mode === 'add'
                    ? 'Fill in the information below to create a new category'
                    : 'Update the category information below'
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
                <InputError message={showErrors.name ? errors.name : ''} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="slug" value="Slug" />
                <TextInput
                    id="slug"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    placeholder="e.g., science-fiction"
                />
                <InputError message={showErrors.slug ? errors.slug : ''} className="mt-1" />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional. Used for URLs. Leave blank to auto-generate.</p>
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="description" value="Description" />
                <textarea
                    id="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                    value={data.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Brief description of this category..."
                />
                <InputError message={showErrors.description ? errors.description : ''} className="mt-1" />
            </div>

            <div className="mt-3">
                <div className="flex items-center justify-between">
                    <div>
                        <InputLabel htmlFor="is_published" value="Status" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Make this category visible to users</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleChange('is_published', !data.is_published)}
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
                    {mode === 'add' ? 'Add Category' : 'Update Category'}
                </PrimaryButton>
            </div>
        </form>
    );
}
