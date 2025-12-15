import Modal from "@/components/modals/Modal";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface CopyItem {
    id: number;
    accession_no: string;
    copy_no: number;
    branch?: string;
    location?: string;
    status: string;
}

interface EditCopyModalProps {
    show: boolean;
    copy: CopyItem | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditCopyModal({
    show,
    copy,
    onClose,
    onSuccess,
}: EditCopyModalProps) {
    const [accessionNo, setAccessionNo] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Available");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (show && copy) {
            setAccessionNo(copy.accession_no || "");
            setLocation(copy.location || "");
            setStatus(copy.status || "Available");
            setErrors({});
        }
    }, [show, copy]);

    const validateAccessionNo = async (value: string) => {
        if (value.length !== 7) return;
        if (value === copy?.accession_no) {
            const { accession_no, ...rest } = errors;
            setErrors(rest);
            return;
        }

        try {
            const response = await axios.post(
                route("admin.copies.validate-accession-no"),
                { accession_no: value },
            );

            if (!response.data.valid) {
                setErrors({ ...errors, accession_no: response.data.message });
            } else {
                const { accession_no, ...rest } = errors;
                setErrors(rest);
            }
        } catch (error) {
            console.error("Failed to validate accession number:", error);
        }
    };

    const handleAccessionNoChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 7);
        setAccessionNo(value);

        if (value.length === 7) {
            validateAccessionNo(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!copy) return;

        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.put(
                route("admin.copies.update", copy.id),
                {
                    accession_no: accessionNo,
                    location: location || null,
                    status,
                },
            );

            if (response.data.success) {
                toast.success("Copy updated successfully");
                onSuccess();
                handleClose();
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error("Failed to update copy");
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        setAccessionNo("");
        setLocation("");
        setStatus("Available");
        setErrors({});
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="sm">
            <div className="p-4">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
                            Edit Copy #{copy?.copy_no}
                        </h2>
                        <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                            Update copy details
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <InputLabel
                            htmlFor="edit_accession_no"
                            value="Accession No."
                            className="text-xs"
                        />
                        <TextInput
                            id="edit_accession_no"
                            type="text"
                            className="mt-1 block w-full text-sm"
                            value={accessionNo}
                            onChange={handleAccessionNoChange}
                            placeholder="0000000"
                            maxLength={7}
                            required
                        />
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            Must be 7 digits and unique.
                        </p>
                        <InputError
                            message={errors.accession_no}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="edit_location"
                            value="Location (Optional)"
                            className="text-xs"
                        />
                        <select
                            id="edit_location"
                            className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
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
                        <InputError
                            message={errors.location}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="edit_status"
                            value="Status"
                            className="text-xs"
                        />
                        <select
                            id="edit_status"
                            className={`mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 ${copy?.status === 'Paid'
                                    ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                                    : ''
                                }`}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                            disabled={copy?.status === 'Paid'}
                        >
                            <option value="Available">Available</option>
                            <option value="Borrowed">Borrowed</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Lost">Lost</option>
                            <option value="Under Repair">Under Repair</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                        </select>
                        {copy?.status === 'Paid' && (
                            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                Status cannot be changed for copies with payment-related status.
                            </p>
                        )}
                        <InputError message={errors.status} className="mt-1" />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <SecondaryButton
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="text-sm"
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="text-sm"
                        >
                            {processing ? "Saving..." : "Save"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
