import Modal from '@/components/modals/Modal';
import { CheckCircle2 } from 'lucide-react';
import PrimaryButton from '@/components/buttons/PrimaryButton';

interface SuccessModalProps {
    show: boolean;
    title?: string;
    message: string;
    buttonText?: string;
    onClose: () => void;
}

export default function SuccessModal({
    show,
    title = 'Success!',
    message,
    buttonText = 'OK, got it!',
    onClose,
}: SuccessModalProps) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-8">
                <div className="flex flex-col items-center text-center">
                    {/* Hero Icon Section */}
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
                        <CheckCircle2 className="h-12 w-12 text-green-500 animate-in zoom-in duration-300" />
                    </div>

                    {/* Content Section */}
                    <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                        {title}
                    </h3>
                    <p className="mb-8 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {message}
                    </p>

                    {/* Action Section */}
                    <div className="w-full">
                        <PrimaryButton
                            onClick={onClose}
                            className="w-full py-2.5 justify-center shadow-lg shadow-indigo-200 dark:shadow-none"
                        >
                            {buttonText}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
