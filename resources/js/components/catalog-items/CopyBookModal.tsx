import Modal from '@/components/modals/Modal';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import InputLabel from '@/components/forms/InputLabel';
import TextInput from '@/components/forms/TextInput';
import InputError from '@/components/forms/InputError';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { CatalogItem } from '@/types';

interface CopyBookModalProps {
    show: boolean;
    item: CatalogItem | null;
    onClose: () => void;
    onSuccess: (copy: any) => void;
}

export default function CopyBookModal({
    show,
    item,
    onClose,
    onSuccess,
}: CopyBookModalProps) {
    const [accessionNo, setAccessionNo] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('Available');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (show && item) {
            generateAccessionNo();
        }
    }, [show, item]);

    const generateAccessionNo = async () => {
        try {
            const response = await axios.get(route('admin.copies.generate-accession-no'));
            setAccessionNo(response.data.accession_no);
        } catch (error) {
            console.error('Failed to generate accession number:', error);
        }
    };

    const validateAccessionNo = async (value: string) => {
        if (value.length !== 7) return;

        try {
            const response = await axios.post(route('admin.copies.validate-accession-no'), {
                accession_no: value,
            });

            if (!response.data.valid) {
                setErrors({ ...errors, accession_no: response.data.message });
            } else {
                const { accession_no, ...rest } = errors;
                setErrors(rest);
            }
        } catch (error) {
            console.error('Failed to validate accession number:', error);
        }
    };

    const handleAccessionNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 7);
        setAccessionNo(value);

        if (value.length === 7) {
            validateAccessionNo(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!item) return;

        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.post(
                route('admin.catalog-items.copies.store', item.id),
                {
                    accession_no: accessionNo,
                    location: location || null,
                    status,
                }
            );

            if (response.data.success) {
                onSuccess(response.data.copy);
                resetForm();
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setProcessing(false);
        }
    };

    const resetForm = () => {
        setAccessionNo('');
        setLocation('');
        setStatus('Available');
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">
                    Copy Book
                </h2>
                <p className="mt-2 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                    Create a new copy of <strong className="dark:text-gray-200">{item?.title}</strong>.
                    This will generate a new catalog entry with a unique accession number.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <InputLabel htmlFor="accession_no" value="Accession No." />
                        <TextInput
                            id="accession_no"
                            type="text"
                            className="mt-1 block w-full"
                            value={accessionNo}
                            onChange={handleAccessionNoChange}
                            placeholder="0000000"
                            maxLength={7}
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Auto-generated. You can edit if needed (must be 7 digits and unique).
                        </p>
                        <InputError message={errors.accession_no} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="location" value="Location (Optional)" />
                        <select
                            id="location"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="">Select location</option>
                            <option value="Filipianna">Filipianna</option>
                            <option value="Circulation">Circulation</option>
                            <option value="Theses">Theses</option>
                            <option value="Fiction">Fiction</option>
                            <option value="Reserve">Reserve</option>
                        </select>
                        <InputError message={errors.location} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="status" value="Status" />
                        <select
                            id="status"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <option value="Available">Available</option>
                            <option value="Borrowed">Borrowed</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Lost">Lost</option>
                            <option value="Under Repair">Under Repair</option>
                        </select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton type="button" onClick={handleClose} disabled={processing}>
                            Close
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Copy'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
