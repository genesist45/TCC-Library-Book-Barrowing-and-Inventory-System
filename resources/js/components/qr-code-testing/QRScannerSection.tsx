import { PropsWithChildren } from 'react';

interface QRScannerSectionProps extends PropsWithChildren {
    title: string;
    description: string;
}

export default function QRScannerSection({ title, description, children }: QRScannerSectionProps) {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {children}
            </div>
        </div>
    );
}

