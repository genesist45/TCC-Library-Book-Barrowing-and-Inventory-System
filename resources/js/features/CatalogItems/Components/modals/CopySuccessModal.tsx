import Modal from '@/components/modals/Modal';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

interface CopySuccessModalProps {
    show: boolean;
    catalogItemId: number | null;
    onClose: () => void;
    onAddAnother: () => void;
}

export default function CopySuccessModal({
    show,
    catalogItemId,
    onClose,
    onAddAnother,
}: CopySuccessModalProps) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">
                            Copy Created Successfully
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                            The new copy has been added to the catalog item.
                        </p>
                    </div>
                </div>

                {catalogItemId && (
                    <div className="mt-4">
                        <Link
                            href={route('admin.catalog-items.show', catalogItemId)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            View Catalog Item Details →
                        </Link>
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>
                        Close
                    </SecondaryButton>
                    <PrimaryButton onClick={onAddAnother}>
                        Add Another Copy
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
