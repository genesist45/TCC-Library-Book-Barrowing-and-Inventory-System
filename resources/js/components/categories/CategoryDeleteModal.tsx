import Modal from '@/components/modals/Modal';
import DangerButton from '@/components/buttons/DangerButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';

interface Category {
    id: number;
    name: string;
    items_count: number;
}

interface CategoryDeleteModalProps {
    show: boolean;
    category: Category | null;
    processing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function CategoryDeleteModal({
    show,
    category,
    processing,
    onConfirm,
    onCancel,
}: CategoryDeleteModalProps) {
    return (
        <Modal show={show} onClose={onCancel}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">Delete Category</h2>
                <p className="mt-4 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                    Are you sure you want to delete{' '}
                    <strong className="transition-colors duration-200 dark:text-gray-200">
                        {category?.name}
                    </strong>
                    {category && category.items_count > 0 && (
                        <>
                            {' '}which contains <strong className="transition-colors duration-200 dark:text-gray-200">{category.items_count} items</strong>
                        </>
                    )}
                    ? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
                    <DangerButton onClick={onConfirm} disabled={processing}>
                        Delete Category
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
