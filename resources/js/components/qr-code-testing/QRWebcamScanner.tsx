import { Video } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRWebcamScannerProps {
    onScanSuccess: (result: string) => void;
    onScanError: (error: string) => void;
}

export default function QRWebcamScanner({ onScanSuccess, onScanError }: QRWebcamScannerProps) {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

    const startCamera = async () => {
        onScanError('');
        onScanSuccess('');

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            onScanError('Camera API is not supported in this browser.');
            return;
        }

        setIsCameraActive(true);
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const html5QrCode = new Html5Qrcode('webcam-reader');
            html5QrCodeRef.current = html5QrCode;

            try {
                const permissionStream = await navigator.mediaDevices.getUserMedia({ video: true });
                permissionStream.getTracks().forEach(track => track.stop());
            } catch (permError: any) {
                if (permError.name === 'NotAllowedError') {
                    throw new Error('Camera access was denied. Please allow camera access in your browser.');
                }
                throw permError;
            }

            const devices = await Html5Qrcode.getCameras();
            
            if (!devices || devices.length === 0) {
                throw new Error('No camera found on this device.');
            }

            const cameraId = devices[0].id;

            await html5QrCode.start(
                cameraId,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    onScanSuccess(decodedText);
                    onScanError('');
                },
                () => {
                    // Silent - scanning in progress
                }
            );

        } catch (error: any) {
            console.error('Camera error:', error);
            
            let errorMsg = 'Failed to start camera. ';
            if (error.name === 'NotAllowedError') {
                errorMsg = 'Camera access was denied. Please allow camera access in your browser.';
            } else if (error.name === 'NotFoundError') {
                errorMsg = 'No camera found on this device.';
            } else if (error.name === 'NotReadableError') {
                errorMsg = 'Camera is already in use by another application.';
            } else if (error.message) {
                errorMsg = error.message;
            } else {
                errorMsg += 'Please check permissions and try again.';
            }
            
            onScanError(errorMsg);
            setIsCameraActive(false);
            
            if (html5QrCodeRef.current) {
                try {
                    await html5QrCodeRef.current.stop();
                } catch (e) {
                    // Ignore
                }
                html5QrCodeRef.current = null;
            }
        }
    };

    const stopCamera = async () => {
        try {
            if (html5QrCodeRef.current) {
                await html5QrCodeRef.current.stop();
                await html5QrCodeRef.current.clear();
                html5QrCodeRef.current = null;
            }
            setIsCameraActive(false);
        } catch (error) {
            console.error('Error stopping camera:', error);
            setIsCameraActive(false);
            html5QrCodeRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop()
                    .then(() => html5QrCodeRef.current?.clear())
                    .catch(console.error);
            }
        };
    }, []);

    return (
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#2a2a2a]">
            <div className="mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Webcam</h2>
            </div>

            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-100 overflow-hidden dark:border-gray-700 dark:bg-[#1a1a1a]">
                {isCameraActive ? (
                    <div id="webcam-reader" className="w-full min-h-[16rem]"></div>
                ) : (
                    <div className="flex h-64 items-center justify-center p-4">
                        <p className="flex items-center gap-2 text-center text-sm text-gray-700 dark:text-gray-300">
                            <span className="text-lg">ⓘ</span>
                            Make sure to allow camera access!
                        </p>
                    </div>
                )}
            </div>

            <button 
                onClick={isCameraActive ? stopCamera : startCamera}
                className={`w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                    isCameraActive 
                        ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800' 
                        : 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800'
                }`}
            >
                <Video className="h-4 w-4" />
                {isCameraActive ? 'Stop Camera' : 'Open Camera'}
            </button>
        </div>
    );
}

