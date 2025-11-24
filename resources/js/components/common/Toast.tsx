import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Toast() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="mt-16"
            toastClassName="bg-white dark:bg-[#2a2a2a] shadow-lg border border-gray-200 dark:border-[#3a3a3a] rounded-lg mb-2 min-h-14"
            bodyClassName="text-sm font-medium text-gray-900 dark:text-gray-100 p-3"
            progressClassName="bg-blue-600"
        />
    );
}

