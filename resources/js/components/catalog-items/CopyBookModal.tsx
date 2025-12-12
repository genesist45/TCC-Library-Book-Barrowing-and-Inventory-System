import Modal from "@/components/modals/Modal";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import { useState, useEffect } from "react";
import axios from "axios";
import { CatalogItem } from "@/types";
import { Copy, Layers } from "lucide-react";

type TabType = "single" | "multiple";

interface Tab {
    id: TabType;
    label: string;
    icon: typeof Copy;
}

const TABS: Tab[] = [
    { id: "single", label: "Single Copy", icon: Copy },
    { id: "multiple", label: "Multiple Copies", icon: Layers },
];

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
    const [activeTab, setActiveTab] = useState<TabType>("single");

    // Single copy state
    const [accessionNo, setAccessionNo] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Available");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Multiple copies state
    const [numberOfCopies, setNumberOfCopies] = useState(2);
    const [multiLocation, setMultiLocation] = useState("");
    const [multiStatus, setMultiStatus] = useState("Available");
    const [multiProcessing, setMultiProcessing] = useState(false);
    const [multiErrors, setMultiErrors] = useState<Record<string, string>>({});
    const [createdCopies, setCreatedCopies] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (show && item) {
            generateAccessionNo();
        }
    }, [show, item]);

    const generateAccessionNo = async () => {
        try {
            const response = await axios.get(
                route("admin.copies.generate-accession-no"),
            );
            setAccessionNo(response.data.accession_no);
        } catch (error) {
            console.error("Failed to generate accession number:", error);
        }
    };

    const validateAccessionNo = async (value: string) => {
        if (value.length !== 7) return;

        try {
            const response = await axios.post(
                route("admin.copies.validate-accession-no"),
                {
                    accession_no: value,
                },
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

    const handleSingleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!item) return;

        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.post(
                route("admin.catalog-items.copies.store", item.id),
                {
                    accession_no: accessionNo,
                    location: location || null,
                    status,
                },
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

    const handleMultipleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!item) return;

        setMultiProcessing(true);
        setMultiErrors({});
        setCreatedCopies([]);

        try {
            const response = await axios.post(
                route("admin.catalog-items.copies.store-bulk", item.id),
                {
                    number_of_copies: numberOfCopies,
                    location: multiLocation || null,
                    status: multiStatus,
                },
            );

            if (response.data.success) {
                setCreatedCopies(response.data.copies);
                setShowResults(true);
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setMultiErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setMultiErrors({ general: error.response.data.message });
            }
        } finally {
            setMultiProcessing(false);
        }
    };

    const resetForm = () => {
        setAccessionNo("");
        setLocation("");
        setStatus("Available");
        setErrors({});
        setNumberOfCopies(2);
        setMultiLocation("");
        setMultiStatus("Available");
        setMultiErrors({});
        setCreatedCopies([]);
        setShowResults(false);
    };

    const handleClose = () => {
        resetForm();
        setActiveTab("single");
        onClose();
    };

    const handleResultsClose = () => {
        onSuccess(createdCopies);
        resetForm();
    };

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setErrors({});
        setMultiErrors({});
    };

    const selectClassName =
        "mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600";

    const renderTabContent = () => {
        if (activeTab === "single") {
            return (
                <form onSubmit={handleSingleSubmit} className="space-y-3">
                    <div>
                        <InputLabel
                            htmlFor="accession_no"
                            value="Accession No."
                        />
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
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            Auto-generated. You can edit if needed (must be 7
                            digits and unique).
                        </p>
                        <InputError
                            message={errors.accession_no}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="location"
                            value="Location (Optional)"
                        />
                        <select
                            id="location"
                            className={selectClassName}
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
                        <InputLabel htmlFor="status" value="Status" />
                        <select
                            id="status"
                            className={selectClassName}
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
                        <InputError message={errors.status} className="mt-1" />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <SecondaryButton
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Close
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? "Saving..." : "Save Copy"}
                        </PrimaryButton>
                    </div>
                </form>
            );
        }

        // Multiple copies tab - results view
        if (showResults) {
            return (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 dark:border-green-800 dark:bg-green-900/20">
                        <svg
                            className="h-4 w-4 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            Successfully created {createdCopies.length} copies!
                        </span>
                    </div>

                    <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                        Copy No.
                                    </th>
                                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                        Accession No.
                                    </th>
                                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                        Location
                                    </th>
                                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {createdCopies.map((copy, index) => (
                                    <tr key={copy.id || index}>
                                        <td className="whitespace-nowrap px-3 py-1.5 text-xs text-gray-900 dark:text-gray-100">
                                            {copy.copy_no}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-1.5 text-xs font-medium text-gray-900 dark:text-gray-100">
                                            {copy.accession_no}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400">
                                            {copy.location || "-"}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-1.5 text-xs">
                                            <span
                                                className={`inline-flex rounded-full px-1.5 py-0.5 text-xs font-medium ${
                                                    copy.status === "Available"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                            >
                                                {copy.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-3 pt-1">
                        <SecondaryButton
                            type="button"
                            onClick={() => setShowResults(false)}
                        >
                            Add More
                        </SecondaryButton>
                        <PrimaryButton
                            type="button"
                            onClick={handleResultsClose}
                        >
                            Done
                        </PrimaryButton>
                    </div>
                </div>
            );
        }

        // Multiple copies tab - form view
        return (
            <form onSubmit={handleMultipleSubmit} className="space-y-3">
                {multiErrors.general && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 dark:border-red-800 dark:bg-red-900/20">
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {multiErrors.general}
                        </p>
                    </div>
                )}

                <div>
                    <InputLabel
                        htmlFor="number_of_copies"
                        value="Number of Copies"
                    />
                    <TextInput
                        id="number_of_copies"
                        type="number"
                        className="mt-1 block w-full"
                        value={numberOfCopies}
                        onChange={(e) =>
                            setNumberOfCopies(
                                Math.max(
                                    2,
                                    Math.min(50, parseInt(e.target.value) || 2),
                                ),
                            )
                        }
                        min={2}
                        max={50}
                        required
                    />
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        Enter the number of copies to create (2-50). Accession
                        numbers will be auto-generated.
                    </p>
                    <InputError
                        message={multiErrors.number_of_copies}
                        className="mt-1"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="multi_location"
                        value="Location (Optional)"
                    />
                    <select
                        id="multi_location"
                        className={selectClassName}
                        value={multiLocation}
                        onChange={(e) => setMultiLocation(e.target.value)}
                    >
                        <option value="">Select location</option>
                        <option value="Filipianna">Filipianna</option>
                        <option value="Circulation">Circulation</option>
                        <option value="Theses">Theses</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Reserve">Reserve</option>
                    </select>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        All copies will be assigned to this location.
                    </p>
                    <InputError
                        message={multiErrors.location}
                        className="mt-1"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="multi_status" value="Status" />
                    <select
                        id="multi_status"
                        className={selectClassName}
                        value={multiStatus}
                        onChange={(e) => setMultiStatus(e.target.value)}
                        required
                    >
                        <option value="Available">Available</option>
                        <option value="Borrowed">Borrowed</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Lost">Lost</option>
                        <option value="Under Repair">Under Repair</option>
                    </select>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        All copies will have this status.
                    </p>
                    <InputError message={multiErrors.status} className="mt-1" />
                </div>

                <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-800 dark:bg-blue-900/20">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong>Note:</strong> This will create {numberOfCopies}{" "}
                        copies with auto-generated accession numbers.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-1">
                    <SecondaryButton
                        type="button"
                        onClick={handleClose}
                        disabled={multiProcessing}
                    >
                        Close
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={multiProcessing}>
                        {multiProcessing
                            ? "Creating..."
                            : `Create ${numberOfCopies} Copies`}
                    </PrimaryButton>
                </div>
            </form>
        );
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <div className="p-5">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">
                    Copy Book
                </h2>
                <p className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                    Create new copies of{" "}
                    <strong className="dark:text-gray-200">
                        {item?.title}
                    </strong>
                </p>

                {/* Tabs */}
                <div className="mt-3 border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-4">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                                >
                                    <Icon size={15} className="flex-shrink-0" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-4">{renderTabContent()}</div>
            </div>
        </Modal>
    );
}
