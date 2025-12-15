import { useState, useEffect } from "react";
import Modal from "@/components/modals/Modal";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import { PreviewCopy } from "./RelatedCopiesPreview";

interface PreviewCopyModalProps {
    show: boolean;
    copy?: PreviewCopy | null;
    onClose: () => void;
    onSave: (data: { accession_no: string; branch: string; location: string }) => void;
    nextAccessionNo?: string;
}

export default function PreviewCopyModal({
    show,
    copy,
    onClose,
    onSave,
    nextAccessionNo,
}: PreviewCopyModalProps) {
    const [accessionNo, setAccessionNo] = useState("");
    const [branch, setBranch] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        if (copy) {
            setAccessionNo(copy.accession_no);
            setBranch(copy.branch || "");
            setLocation(copy.location || "");
        } else {
            setAccessionNo(nextAccessionNo || "");
            setBranch("");
            setLocation("");
        }
    }, [copy, nextAccessionNo, show]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            accession_no: accessionNo,
            branch: branch,
            location: location,
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">
                    {copy ? "Edit Copy" : "Add New Copy"}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {copy
                        ? "Update the copy information below."
                        : "Enter the details for the new copy."}
                </p>

                <div className="mt-6 space-y-4">
                    <div>
                        <InputLabel htmlFor="accession_no" value="Accession No." />
                        <TextInput
                            id="accession_no"
                            type="text"
                            className="mt-1 block w-full"
                            value={accessionNo}
                            onChange={(e) => setAccessionNo(e.target.value)}
                            placeholder="Auto-generated if left empty"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Leave empty to auto-generate
                        </p>
                    </div>

                    <div>
                        <InputLabel htmlFor="branch" value="Branch" />
                        <TextInput
                            id="branch"
                            type="text"
                            className="mt-1 block w-full"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            placeholder="Optional"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="location" value="Location" />
                        <TextInput
                            id="location"
                            type="text"
                            className="mt-1 block w-full"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Optional"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton type="button" onClick={onClose}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton type="submit">
                        {copy ? "Update Copy" : "Add Copy"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
