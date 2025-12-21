import Modal from '@/components/modals/Modal';
import DangerButton from '@/components/buttons/DangerButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { Member } from '@/types';

interface MemberDeleteModalProps {
    show: boolean;
    member: Member | null;
    processing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function MemberDeleteModal({
    show,
    member,
    processing,
    onConfirm,
    onCancel,
}: MemberDeleteModalProps) {
    return (
        <Modal show={show} onClose={onCancel}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100">Delete Member</h2>
                <p className="mt-4 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
                    Are you sure you want to delete member{' '}
                    <strong className="transition-colors duration-200 dark:text-gray-200">
                        {member?.name}
                    </strong>
                    {' '}({member?.member_no})? This action cannot be undone and will remove all associated records.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
                    <DangerButton onClick={onConfirm} disabled={processing}>
                        Delete Member
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
