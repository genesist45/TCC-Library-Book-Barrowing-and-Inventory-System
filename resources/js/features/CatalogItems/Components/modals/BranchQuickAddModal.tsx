import { useState, useEffect } from "react";
import Modal from "@/components/modals/Modal";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";

interface BranchQuickAddModalProps {
    show: boolean;
    onClose: () => void;
    onBranchAdded: (name: string, address?: string, description?: string) => Promise<void>;
}

export default function BranchQuickAddModal({
    show,
    onClose,
    onBranchAdded,
}: BranchQuickAddModalProps) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal closes
    useEffect(() => {
        if (!show) {
            setName("");
            setAddress("");
            setDescription("");
            setIsSubmitting(false);
        }
    }, [show]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onBranchAdded(name.trim(), address.trim() || undefined, description.trim() || undefined);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="sm">
            <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Add New Branch
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Create a new library branch
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* Branch Name Field */}
                    <div>
                        <InputLabel htmlFor="branch_name" value="Branch Name" required />
                        <TextInput
                            id="branch_name"
                            type="text"
                            className="mt-1 block w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Main Library, Extension Library"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Address Field */}
                    <div>
                        <InputLabel htmlFor="branch_address" value="Address (Optional)" />
                        <TextInput
                            id="branch_address"
                            type="text"
                            className="mt-1 block w-full"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Street address, City..."
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <InputLabel htmlFor="branch_description" value="Description (Optional)" />
                        <textarea
                            id="branch_description"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description..."
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-2">
                        <SecondaryButton
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                        >
                            {isSubmitting ? "Adding..." : "Add Branch"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
