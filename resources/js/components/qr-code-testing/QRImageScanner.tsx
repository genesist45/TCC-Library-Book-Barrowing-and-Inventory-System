import { Upload, ScanBarcode } from 'lucide-react';
import { useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRImageScannerProps {
    onScanSuccess: (result: string) => void;
    onScanError: (error: string) => void;
}

export default function QRImageScanner({ onScanSuccess, onScanError }: QRImageScannerProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            onScanError('Please select a valid image file');
            return;
        }

        onScanError('');
        onScanSuccess('');

        try {
            const html5QrCode = new Html5Qrcode('temp-qr-reader');
            const result = await html5QrCode.scanFile(file, false);
            onScanSuccess(result);
        } catch (error) {
            onScanError('No QR code detected. Please try another image.');
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    return (
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#2a2a2a]">
            <div className="mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Select QR Image</h2>
            </div>

            <div 
                className={`flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors ${
                    isDragging 
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950' 
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-[#1a1a1a] dark:hover:border-gray-500'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Upload className="mb-4 h-16 w-16 text-yellow-500 dark:text-yellow-400" />
                <p className="mb-1 text-base font-medium text-gray-700 dark:text-gray-200">Drag & Drop or Browse</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">All image types allowed.</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                />
            </div>

            <p className="mt-4 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <ScanBarcode className="h-4 w-4" />
                Built with the most used and secure Google's Zxing library
            </p>
        </div>
    );
}

