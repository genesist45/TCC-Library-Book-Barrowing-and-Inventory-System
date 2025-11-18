import Modal from '@/components/modals/Modal';
import DangerButton from '@/components/buttons/DangerButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';

interface CatalogItem {
    id: number;
    title: string;
}

interface CatalogItemDeleteModalProps {
    show: boolean;
    item: CatalogItem | null;
    processing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function CatalogItemDeleteModal({
    show,
    item,
    processing,
    onConfirm,
    onCancel,
}: CatalogItemDeleteModalProps) {
    return (
        <Modal show={show} onClose={onCancel}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">Delete Catalog Item</h2>
                <p className="mt-4 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                    Are you sure you want to delete{' '}
                    <strong className="transition-colors duration-200 dark:text-gray-200">
                        {item?.title}
                    </strong>
                    ? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
                    <DangerButton onClick={onConfirm} disabled={processing}>
                        Delete Item
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
