import Modal from '@/components/modals/Modal';
import DangerButton from '@/components/buttons/DangerButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';

interface Author {
    id: number;
    name: string;
    items_count: number;
}

interface AuthorDeleteModalProps {
    show: boolean;
    author: Author | null;
    processing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function AuthorDeleteModal({
    show,
    author,
    processing,
    onConfirm,
    onCancel,
}: AuthorDeleteModalProps) {
    return (
        <Modal show={show} onClose={onCancel}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">Delete Author</h2>
                <p className="mt-4 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                    Are you sure you want to delete{' '}
                    <strong className="transition-colors duration-200 dark:text-gray-200">
                        {author?.name}
                    </strong>
                    {author && author.items_count > 0 && (
                        <>
                            {' '}who has <strong className="transition-colors duration-200 dark:text-gray-200">{author.items_count} items</strong>
                        </>
                    )}
                    ? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
                    <DangerButton onClick={onConfirm} disabled={processing}>
                        Delete Author
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
