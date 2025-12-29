import Modal from '@/components/modals/Modal';
import DangerButton from '@/components/buttons/DangerButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';

interface Publisher {
    id: number;
    name: string;
    items_count: number;
}

interface PublisherDeleteModalProps {
    show: boolean;
    publisher: Publisher | null;
    processing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function PublisherDeleteModal({
    show,
    publisher,
    processing,
    onConfirm,
    onCancel,
}: PublisherDeleteModalProps) {
    return (
        <Modal show={show} onClose={onCancel}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">Delete Publisher</h2>
                <p className="mt-4 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                    Are you sure you want to delete{' '}
                    <strong className="transition-colors duration-200 dark:text-gray-200">
                        {publisher?.name}
                    </strong>
                    {publisher && publisher.items_count > 0 && (
                        <>
                            {' '}which has <strong className="transition-colors duration-200 dark:text-gray-200">{publisher.items_count} items</strong>
                        </>
                    )}
                    ? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
                    <DangerButton onClick={onConfirm} disabled={processing}>
                        Delete Publisher
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
