import Modal from '@/components/modals/Modal';
import DangerButton from '@/components/buttons/DangerButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';

interface ConfirmModalProps {
    show: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    processing?: boolean;
    variant?: 'danger' | 'primary';
}

export default function ConfirmModal({
    show,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    processing = false,
    variant = 'danger',
}: ConfirmModalProps) {
    const ConfirmButton = variant === 'danger' ? DangerButton : PrimaryButton;

    return (
        <Modal show={show} onClose={onCancel} maxWidth="md">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">
                    {title}
                </h2>

                <p className="mt-3 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                    {message}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onCancel} disabled={processing}>
                        {cancelText}
                    </SecondaryButton>

                    <ConfirmButton onClick={onConfirm} disabled={processing}>
                        {processing ? 'Processing...' : confirmText}
                    </ConfirmButton>
                </div>
            </div>
        </Modal>
    );
}
