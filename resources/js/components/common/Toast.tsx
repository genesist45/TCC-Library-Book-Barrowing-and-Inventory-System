import { Toaster } from 'sonner';

export default function Toast() {
    return (
        <Toaster 
            position="top-right" 
            closeButton 
            duration={3000}
            toastOptions={{
                classNames: {
                    toast: 'bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#3a3a3a] shadow-lg rounded-lg',
                    title: 'text-gray-900 dark:text-gray-100 font-medium',
                    description: 'text-gray-600 dark:text-gray-400',
                    actionButton: 'bg-indigo-600 text-white',
                    cancelButton: 'bg-gray-200 dark:bg-gray-700',
                    closeButton: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400',
                    success: 'border-green-200 dark:border-green-800',
                    error: 'border-red-200 dark:border-red-800',
                    warning: 'border-yellow-200 dark:border-yellow-800',
                    info: 'border-blue-200 dark:border-blue-800',
                },
            }}
            visibleToasts={5}
            expand={false}
            richColors
        />
    );
}

