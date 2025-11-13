import { ScanBarcode, Copy, Check, X } from 'lucide-react';
import { useState } from 'react';

interface QRScanResultProps {
    result: string;
    error: string;
    onCopy?: (text: string) => void;
}

export default function QRScanResult({ result, error, onCopy }: QRScanResultProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!result) return;
        
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            onCopy?.(result);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    return (
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#2a2a2a]">
            <div className="mb-4 flex items-center gap-2">
                <ScanBarcode className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Scanned Data</h2>
            </div>

            <div className="mb-4 flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-[#1a1a1a]">
                {error ? (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <X className="h-5 w-5" />
                        <p className="text-center text-sm">{error}</p>
                    </div>
                ) : result ? (
                    <div className="w-full">
                        <p className="break-all text-sm text-gray-800 dark:text-gray-200">{result}</p>
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Scan a QR code to view the results here.
                    </p>
                )}
            </div>

            <button 
                onClick={handleCopy}
                disabled={!result}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-gray-600"
            >
                {copied ? (
                    <>
                        <Check className="h-4 w-4" />
                        Copied!
                    </>
                ) : (
                    <>
                        <Copy className="h-4 w-4" />
                        Copy Results
                    </>
                )}
            </button>
        </div>
    );
}

