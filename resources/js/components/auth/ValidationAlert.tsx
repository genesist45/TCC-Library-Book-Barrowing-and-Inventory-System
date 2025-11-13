import { AlertCircle } from 'lucide-react';

interface ValidationAlertProps {
    message: string | undefined;
    show: boolean;
}

export default function ValidationAlert({ message, show }: ValidationAlertProps) {
    if (!show || !message) return null;

    return (
        <div 
            className={`mb-2 transition-all duration-300 ease-out ${
                show
                    ? 'translate-y-0 opacity-100'
                    : '-translate-y-2 opacity-0'
            }`}
        >
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-1 shadow-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-sm font-medium text-red-600">
                    {message}
                </p>
            </div>
        </div>
    );
}
