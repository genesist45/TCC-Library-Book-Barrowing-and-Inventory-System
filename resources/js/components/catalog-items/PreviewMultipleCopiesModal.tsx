import { useState } from "react";
import Modal from "@/components/modals/Modal";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";

interface PreviewMultipleCopiesModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (count: number, branch: string, location: string) => void;
}

export default function PreviewMultipleCopiesModal({
    show,
    onClose,
    onSave,
}: PreviewMultipleCopiesModalProps) {
    const [count, setCount] = useState(1);
    const [branch, setBranch] = useState("");
    const [location, setLocation] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (count > 0) {
            onSave(count, branch, location);
            // Reset form
            setCount(1);
            setBranch("");
            setLocation("");
        }
    };

    const handleClose = () => {
        setCount(1);
        setBranch("");
        setLocation("");
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">
                    Add Multiple Copies
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Add multiple copies with the same branch and location.
                </p>

                <div className="mt-6 space-y-4">
                    <div>
                        <InputLabel htmlFor="count" value="Number of Copies" />
                        <TextInput
                            id="count"
                            type="number"
                            min={1}
                            max={100}
                            className="mt-1 block w-full"
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Enter the number of copies to add (1-100)
                        </p>
                    </div>

                    <div>
                        <InputLabel htmlFor="branch" value="Branch (Optional)" />
                        <TextInput
                            id="branch"
                            type="text"
                            className="mt-1 block w-full"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            placeholder="All copies will have this branch"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="location" value="Location (Optional)" />
                        <TextInput
                            id="location"
                            type="text"
                            className="mt-1 block w-full"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="All copies will have this location"
                        />
                    </div>
                </div>

                <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Note:</strong> Accession numbers will be automatically generated for all copies.
                    </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton type="button" onClick={handleClose}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton type="submit">
                        Add {count} {count === 1 ? "Copy" : "Copies"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
