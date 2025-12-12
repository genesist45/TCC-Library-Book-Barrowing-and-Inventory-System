import Modal from "@/components/modals/Modal";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import { useState, useEffect } from "react";
import axios from "axios";
import { CatalogItem } from "@/types";
import { ChevronUp, ChevronDown, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";

interface CopyData {
    accessionNo: string;
    location: string;
    status: string;
    errors: Record<string, string>;
}

interface AddMultipleCopiesModalProps {
    show: boolean;
    item: CatalogItem | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddMultipleCopiesModal({
    show,
    item,
    onClose,
    onSuccess,
}: AddMultipleCopiesModalProps) {
    const [copyCount, setCopyCount] = useState(1);
    const [activeTab, setActiveTab] = useState(0);
    const [copies, setCopies] = useState<CopyData[]>([]);
    const [processing, setProcessing] = useState(false);
    const [baseAccessionNo, setBaseAccessionNo] = useState(0);

    useEffect(() => {
        if (show && item) {
            initializeCopies(1);
            fetchBaseAccessionNo();
        }
    }, [show, item]);

    const fetchBaseAccessionNo = async () => {
        try {
            const response = await axios.get(
                route("admin.copies.generate-accession-no"),
            );
            const accNo = parseInt(response.data.accession_no, 10);
            setBaseAccessionNo(accNo);
            setCopies([createNewCopy(accNo)]);
        } catch (error) {
            console.error("Failed to generate accession number:", error);
        }
    };

    const createNewCopy = (accessionNo: number): CopyData => ({
        accessionNo: accessionNo.toString().padStart(7, "0"),
        location: "",
        status: "Available",
        errors: {},
    });

    const initializeCopies = (count: number) => {
        const newCopies: CopyData[] = [];
        for (let i = 0; i < count; i++) {
            newCopies.push(createNewCopy(baseAccessionNo + i));
        }
        setCopies(newCopies);
        setCopyCount(count);
        setActiveTab(0);
    };

    const handleCopyCountChange = (newCount: number) => {
        if (newCount < 1) newCount = 1;
        if (newCount > 50) newCount = 50; // Max 50 copies at once

        const currentCount = copies.length;

        if (newCount > currentCount) {
            // Add new copies
            const newCopies = [...copies];
            for (let i = currentCount; i < newCount; i++) {
                newCopies.push(createNewCopy(baseAccessionNo + i));
            }
            setCopies(newCopies);
        } else if (newCount < currentCount) {
            // Remove copies from the end
            setCopies(copies.slice(0, newCount));
            if (activeTab >= newCount) {
                setActiveTab(newCount - 1);
            }
        }

        setCopyCount(newCount);
    };

    const updateCopyField = (
        index: number,
        field: keyof Omit<CopyData, "errors">,
        value: string,
    ) => {
        const newCopies = [...copies];
        newCopies[index] = {
            ...newCopies[index],
            [field]: value,
            errors: { ...newCopies[index].errors, [field]: "" },
        };
        setCopies(newCopies);
    };

    const handleAccessionNoChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 7);
        updateCopyField(index, "accessionNo", value);
    };

    const validateAllCopies = (): boolean => {
        let isValid = true;
        const newCopies = copies.map((copy, index) => {
            const errors: Record<string, string> = {};

            if (!copy.accessionNo || copy.accessionNo.length !== 7) {
                errors.accessionNo = "Accession number must be 7 digits";
                isValid = false;
            }

            // Check for duplicate accession numbers within the batch
            const duplicateIndex = copies.findIndex(
                (c, i) => i !== index && c.accessionNo === copy.accessionNo,
            );
            if (duplicateIndex !== -1) {
                errors.accessionNo = `Duplicate accession number (same as Copy #${duplicateIndex + 1})`;
                isValid = false;
            }

            return { ...copy, errors };
        });

        setCopies(newCopies);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!item) return;

        if (!validateAllCopies()) {
            toast.error("Please fix the errors before submitting");
            // Find the first copy with errors and switch to that tab
            const errorIndex = copies.findIndex(
                (copy) => Object.keys(copy.errors).length > 0,
            );
            if (errorIndex !== -1) {
                setActiveTab(errorIndex);
            }
            return;
        }

        setProcessing(true);

        try {
            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < copies.length; i++) {
                const copy = copies[i];
                try {
                    await axios.post(
                        route("admin.catalog-items.copies.store", item.id),
                        {
                            accession_no: copy.accessionNo,
                            location: copy.location || null,
                            status: copy.status,
                        },
                    );
                    successCount++;
                } catch (error: any) {
                    failCount++;
                    if (error.response?.data?.errors) {
                        const newCopies = [...copies];
                        newCopies[i] = {
                            ...newCopies[i],
                            errors: error.response.data.errors,
                        };
                        setCopies(newCopies);
                    }
                }
            }

            if (failCount > 0) {
                toast.warning(
                    `${successCount} copies added, ${failCount} failed. Please check errors.`,
                );
                // Find first error tab
                const errorIndex = copies.findIndex(
                    (copy) => Object.keys(copy.errors).length > 0,
                );
                if (errorIndex !== -1) {
                    setActiveTab(errorIndex);
                }
            } else {
                toast.success(`${successCount} copies added successfully!`);
                onSuccess();
                resetForm();
            }
        } catch (error) {
            toast.error("Failed to add copies");
            console.error("Submit error:", error);
        } finally {
            setProcessing(false);
        }
    };

    const resetForm = () => {
        setCopyCount(1);
        setActiveTab(0);
        setCopies([createNewCopy(baseAccessionNo)]);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const currentCopy = copies[activeTab] || createNewCopy(baseAccessionNo);

    return (
        <Modal show={show} onClose={handleClose} maxWidth="lg">
            <div className="p-4">
                <h2 className="text-base font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">
                    Add Multiple Copies
                </h2>
                <p className="mt-1 text-xs text-gray-600 transition-colors duration-200 dark:text-gray-400">
                    Create multiple copies of{" "}
                    <strong className="dark:text-gray-200">
                        {item?.title}
                    </strong>
                    . Use the stepper to set the number of copies.
                </p>

                {/* Number Stepper */}
                <div className="mt-3 flex items-center gap-3">
                    <InputLabel
                        value="Number of Copies:"
                        className="mb-0 text-sm"
                    />
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => handleCopyCountChange(copyCount - 1)}
                            disabled={copyCount <= 1 || processing}
                            className="flex h-8 w-8 items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            <Minus size={14} />
                        </button>
                        <input
                            type="number"
                            value={copyCount}
                            onChange={(e) =>
                                handleCopyCountChange(
                                    parseInt(e.target.value, 10) || 1,
                                )
                            }
                            min={1}
                            max={50}
                            disabled={processing}
                            className="h-8 w-12 border-y border-gray-300 bg-white text-center text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                            type="button"
                            onClick={() => handleCopyCountChange(copyCount + 1)}
                            disabled={copyCount >= 50 || processing}
                            className="flex h-8 w-8 items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        (max 50)
                    </span>
                </div>

                {/* Tabs */}
                <div className="mt-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-0.5 overflow-x-auto pb-px">
                        {copies.map((copy, index) => {
                            const hasError =
                                Object.keys(copy.errors).length > 0;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setActiveTab(index)}
                                    className={`relative whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-colors ${
                                        activeTab === index
                                            ? "border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                                            : hasError
                                              ? "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                                >
                                    #{index + 1}
                                    {hasError && (
                                        <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content - Form Fields */}
                <form onSubmit={handleSubmit} className="mt-3 space-y-3">
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                        <h3 className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Copy #{activeTab + 1} Details
                        </h3>

                        <div className="space-y-2.5">
                            <div>
                                <InputLabel
                                    htmlFor={`accession_no_${activeTab}`}
                                    value="Accession No."
                                    className="text-xs"
                                />
                                <TextInput
                                    id={`accession_no_${activeTab}`}
                                    type="text"
                                    className="mt-1 block w-full text-sm py-1.5"
                                    value={currentCopy.accessionNo}
                                    onChange={(e) =>
                                        handleAccessionNoChange(activeTab, e)
                                    }
                                    placeholder="0000000"
                                    maxLength={7}
                                    disabled={processing}
                                    required
                                />
                                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                                    Auto-generated (7 digits, unique).
                                </p>
                                <InputError
                                    message={
                                        currentCopy.errors.accession_no ||
                                        currentCopy.errors.accessionNo
                                    }
                                    className="mt-1"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel
                                        htmlFor={`location_${activeTab}`}
                                        value="Location"
                                        className="text-xs"
                                    />
                                    <select
                                        id={`location_${activeTab}`}
                                        className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                        value={currentCopy.location}
                                        onChange={(e) =>
                                            updateCopyField(
                                                activeTab,
                                                "location",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                    >
                                        <option value="">Select</option>
                                        <option value="Filipianna">
                                            Filipianna
                                        </option>
                                        <option value="Circulation">
                                            Circulation
                                        </option>
                                        <option value="Theses">Theses</option>
                                        <option value="Fiction">Fiction</option>
                                        <option value="Reserve">Reserve</option>
                                    </select>
                                    <InputError
                                        message={currentCopy.errors.location}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor={`status_${activeTab}`}
                                        value="Status"
                                        className="text-xs"
                                    />
                                    <select
                                        id={`status_${activeTab}`}
                                        className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                        value={currentCopy.status}
                                        onChange={(e) =>
                                            updateCopyField(
                                                activeTab,
                                                "status",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        required
                                    >
                                        <option value="Available">
                                            Available
                                        </option>
                                        <option value="Borrowed">
                                            Borrowed
                                        </option>
                                        <option value="Reserved">
                                            Reserved
                                        </option>
                                        <option value="Lost">Lost</option>
                                        <option value="Under Repair">
                                            Under Repair
                                        </option>
                                    </select>
                                    <InputError
                                        message={currentCopy.errors.status}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-800 dark:bg-blue-900/20">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            <strong>Summary:</strong> Creating{" "}
                            <strong>{copyCount}</strong>{" "}
                            {copyCount === 1 ? "copy" : "copies"}.
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                        <SecondaryButton
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="text-sm px-3 py-1.5"
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="text-sm px-3 py-1.5"
                        >
                            {processing
                                ? "Saving..."
                                : `Save ${copyCount} ${copyCount === 1 ? "Copy" : "Copies"}`}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
