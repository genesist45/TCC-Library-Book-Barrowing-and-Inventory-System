import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { QRImageScanner, QRWebcamScanner, QRScanResult, QRScannerSection } from '@/components/qr-code-testing';

export default function QRScanner() {
    const [imageResult, setImageResult] = useState<string>('');
    const [imageError, setImageError] = useState<string>('');
    const [webcamResult, setWebcamResult] = useState<string>('');
    const [webcamError, setWebcamError] = useState<string>('');

    return (
        <AuthenticatedLayout>
            <Head title="QR Scanner" />
            <div id="temp-qr-reader" style={{ display: 'none' }}></div>

            <div className="p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Section 1: Scan QR code from image */}
                    <div className="mb-12">
                        <QRScannerSection
                            title="Scan QR code from image"
                            description="Simply upload an image or take a photo of a QR code to reveal its content"
                        >
                            <QRImageScanner
                                onScanSuccess={setImageResult}
                                onScanError={setImageError}
                            />
                            <QRScanResult
                                result={imageResult}
                                error={imageError}
                            />
                        </QRScannerSection>
                    </div>

                    {/* Section 2: Webcam QR code scanner */}
                    <QRScannerSection
                        title="Webcam QR code scanner"
                        description="Click 'Open camera' & point the QR toward it"
                    >
                        <QRWebcamScanner
                            onScanSuccess={setWebcamResult}
                            onScanError={setWebcamError}
                        />
                        <QRScanResult
                            result={webcamResult}
                            error={webcamError}
                        />
                    </QRScannerSection>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

