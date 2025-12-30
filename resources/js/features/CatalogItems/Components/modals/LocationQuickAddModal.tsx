import { useState, useEffect } from "react";
import Modal from "@/components/modals/Modal";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { MapPin } from "lucide-react";

interface LocationQuickAddModalProps {
    show: boolean;
    onClose: () => void;
    onLocationAdded: (name: string) => Promise<void>;
}

export default function LocationQuickAddModal({
    show,
    onClose,
    onLocationAdded,
}: LocationQuickAddModalProps) {
    const [building, setBuilding] = useState("");
    const [section, setSection] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal closes
    useEffect(() => {
        if (!show) {
            setBuilding("");
            setSection("");
            setIsSubmitting(false);
        }
    }, [show]);

    // Generate preview location name with en dash
    const previewLocation = building && section
        ? `${building} – ${section}`
        : building || section || "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!building.trim() || !section.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onLocationAdded(previewLocation);
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
                    Add New Location
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Create a new library location by specifying the building and section
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* Building/Floor Field */}
                    <div>
                        <InputLabel htmlFor="location_building" value="Building/Floor" required />
                        <TextInput
                            id="location_building"
                            type="text"
                            className="mt-1 block w-full"
                            value={building}
                            onChange={(e) => setBuilding(e.target.value)}
                            placeholder="e.g., Main Library, 2nd Floor, Ground Floor"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Section/Department Field */}
                    <div>
                        <InputLabel htmlFor="location_section" value="Section/Department" required />
                        <TextInput
                            id="location_section"
                            type="text"
                            className="mt-1 block w-full"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            placeholder="e.g., IT Section, Reference, Fiction Section"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Preview Section */}
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Preview
                        </p>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                            <span className={`text-sm font-medium ${previewLocation
                                ? "text-gray-900 dark:text-gray-100"
                                : "text-gray-400 dark:text-gray-500 italic"
                                }`}>
                                {previewLocation || "Enter building and section above..."}
                            </span>
                        </div>
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
                            disabled={isSubmitting || !building.trim() || !section.trim()}
                        >
                            {isSubmitting ? "Adding..." : "Add Location"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
