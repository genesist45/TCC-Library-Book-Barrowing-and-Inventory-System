import Modal from "@/components/modals/Modal";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import { useState, useEffect } from "react";
import axios from "axios";
import { Copy, Layers } from "lucide-react";
import { PreviewCopy } from "./RelatedCopiesPreview";

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

interface PreviewCopyBookModalProps {
    show: boolean;
    title: string;
    editingCopy?: PreviewCopy | null;
    onClose: () => void;
    onSaveSingle: (copy: PreviewCopy) => void;
    onSaveMultiple: (copies: PreviewCopy[]) => void;
    existingCopies: PreviewCopy[];
    nextCopyId: number;
}

export default function PreviewCopyBookModal({
    show,
    title,
    editingCopy,
    onClose,
    onSaveSingle,
    onSaveMultiple,
    existingCopies,
    nextCopyId,
}: PreviewCopyBookModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>("single");

    // Single copy state
    const [accessionNo, setAccessionNo] = useState("");
    const [branch, setBranch] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Available");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Multiple copies state
    const [numberOfCopies, setNumberOfCopies] = useState(2);
    const [multiBranch, setMultiBranch] = useState("");
    const [multiLocation, setMultiLocation] = useState("");
    const [multiStatus, setMultiStatus] = useState("Available");
    const [baseAccessionNo, setBaseAccessionNo] = useState(0);

    useEffect(() => {
        if (show) {
            if (editingCopy) {
                // Editing mode
                setActiveTab("single");
                setAccessionNo(editingCopy.accession_no);
                setBranch(editingCopy.branch || "");
                setLocation(editingCopy.location || "");
                setStatus(editingCopy.status);
            } else {
                // Adding mode - fetch next accession number
                generateAccessionNo();
            }
        }
    }, [show, editingCopy]);

    const generateAccessionNo = async () => {
        try {
            const response = await axios.get(
                route("admin.copies.generate-accession-no"),
            );
            const accNo = response.data.accession_no;
            setAccessionNo(accNo);
            setBaseAccessionNo(parseInt(accNo, 10));
        } catch (error) {
            console.error("Failed to generate accession number:", error);
            // Fallback to simple generation
            const maxExisting = Math.max(
                ...existingCopies.map(c => parseInt(c.accession_no) || 0),
                0
            );
            const nextNo = String(maxExisting + 1).padStart(7, "0");
            setAccessionNo(nextNo);
            setBaseAccessionNo(maxExisting + 1);
        }
    };

    const handleAccessionNoChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 7);
        setAccessionNo(value);

        // Clear error when user types
        if (errors.accession_no) {
            const { accession_no, ...rest } = errors;
            setErrors(rest);
        }
    };

    const validateSingle = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!accessionNo || accessionNo.length !== 7) {
            newErrors.accession_no = "Accession number must be 7 digits";
        }

        // Check for duplicates in existing copies (except if editing the same copy)
        const duplicate = existingCopies.find(
            c => c.accession_no === accessionNo && c.id !== editingCopy?.id
        );
        if (duplicate) {
            newErrors.accession_no = "This accession number already exists";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSingleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateSingle()) return;

        const copy: PreviewCopy = {
            id: editingCopy?.id || nextCopyId,
            copy_no: editingCopy?.copy_no || existingCopies.length + 1,
            accession_no: accessionNo,
            branch: branch || undefined,
            location: location || undefined,
            status: status,
        };

        onSaveSingle(copy);
        resetForm();
    };

    const handleMultipleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newCopies: PreviewCopy[] = [];
        let currentAccNo = baseAccessionNo;

        for (let i = 0; i < numberOfCopies; i++) {
            newCopies.push({
                id: nextCopyId + i,
                copy_no: existingCopies.length + i + 1,
                accession_no: String(currentAccNo + i).padStart(7, "0"),
                branch: multiBranch || undefined,
                location: multiLocation || undefined,
                status: multiStatus,
            });
        }

        onSaveMultiple(newCopies);
        resetForm();
    };

    const resetForm = () => {
        setAccessionNo("");
        setBranch("");
        setLocation("");
        setStatus("Available");
        setErrors({});
        setNumberOfCopies(2);
        setMultiBranch("");
        setMultiLocation("");
        setMultiStatus("Available");
    };

    const handleClose = () => {
        resetForm();
        setActiveTab("single");
        onClose();
    };

    const handleTabChange = (tab: TabType) => {
        if (editingCopy) return; // Can't switch tabs when editing
        setActiveTab(tab);
        setErrors({});
    };

    const selectClassName =
        "mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600";

    const renderSingleTab = () => (
        <form onSubmit={handleSingleSubmit} className="space-y-3">
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
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Auto-generated. You can edit if needed (must be 7 digits and unique).
                </p>
                <InputError message={errors.accession_no} className="mt-1" />
            </div>

            <div>
                <InputLabel htmlFor="branch" value="Branch" />
                <select
                    id="branch"
                    className={selectClassName}
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                >
                    <option value="">Select branch</option>
                    <option value="Main">Main</option>
                    <option value="Trial">Trial</option>
                </select>
            </div>

            <div>
                <InputLabel htmlFor="location" value="Location (Optional)" />
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
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <SecondaryButton type="button" onClick={handleClose}>
                    Close
                </SecondaryButton>
                <PrimaryButton type="submit">
                    {editingCopy ? "Update Copy" : "Save Copy"}
                </PrimaryButton>
            </div>
        </form>
    );

    const renderMultipleTab = () => (
        <form onSubmit={handleMultipleSubmit} className="space-y-3">
            <div>
                <InputLabel htmlFor="number_of_copies" value="Number of Copies" />
                <TextInput
                    id="number_of_copies"
                    type="number"
                    className="mt-1 block w-full"
                    value={numberOfCopies}
                    onChange={(e) =>
                        setNumberOfCopies(
                            Math.max(2, Math.min(50, parseInt(e.target.value) || 2)),
                        )
                    }
                    min={2}
                    max={50}
                    required
                />
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Enter the number of copies to create (2-50). Accession numbers will be auto-generated.
                </p>
            </div>

            <div>
                <InputLabel htmlFor="multi_branch" value="Branch" />
                <select
                    id="multi_branch"
                    className={selectClassName}
                    value={multiBranch}
                    onChange={(e) => setMultiBranch(e.target.value)}
                >
                    <option value="">Select branch</option>
                    <option value="Main">Main</option>
                    <option value="Trial">Trial</option>
                </select>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    All copies will be assigned to this branch.
                </p>
            </div>

            <div>
                <InputLabel htmlFor="multi_location" value="Location (Optional)" />
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
            </div>

            <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-800 dark:bg-blue-900/20">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> This will create {numberOfCopies} copies with auto-generated accession numbers.
                </p>
            </div>

            <div className="flex justify-end gap-3 pt-1">
                <SecondaryButton type="button" onClick={handleClose}>
                    Close
                </SecondaryButton>
                <PrimaryButton type="submit">
                    Create {numberOfCopies} Copies
                </PrimaryButton>
            </div>
        </form>
    );

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <div className="p-5">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">
                    {editingCopy ? "Edit Copy" : "Copy Book"}
                </h2>
                <p className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                    {editingCopy ? "Update copy details" : "Create new copies of"}{" "}
                    <strong className="dark:text-gray-200">{title}</strong>
                </p>

                {/* Tabs - Only show when not editing */}
                {!editingCopy && (
                    <div className="mt-3 border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-4">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium transition-colors ${activeTab === tab.id
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
                )}

                {/* Tab Content */}
                <div className="mt-4">
                    {activeTab === "single" || editingCopy
                        ? renderSingleTab()
                        : renderMultipleTab()}
                </div>
            </div>
        </Modal>
    );
}
