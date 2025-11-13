import Modal from '@/components/modals/Modal';
import DangerButton from '@/components/buttons/DangerButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    profile_picture?: string;
    created_at: string;
}

interface UserDeleteModalProps {
    show: boolean;
    user: User | null;
    processing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function UserDeleteModal({
    show,
    user,
    processing,
    onConfirm,
    onCancel,
}: UserDeleteModalProps) {
    return (
        <Modal show={show} onClose={onCancel}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">Delete User</h2>
                <p className="mt-4 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                    Are you sure you want to delete{' '}
                    <strong className="transition-colors duration-200 dark:text-gray-200">
                        {user?.first_name} {user?.last_name}
                    </strong>
                    ? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
                    <DangerButton onClick={onConfirm} disabled={processing}>
                        Delete User
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}

