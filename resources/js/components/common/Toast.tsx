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
            toastClassName={() =>
                "relative flex p-3 min-h-14 rounded-lg justify-between overflow-hidden cursor-pointer bg-white dark:bg-[#2a2a2a] shadow-lg border border-gray-200 dark:border-[#3a3a3a] mb-2"
            }
            bodyClassName={() => "flex items-center text-sm font-medium text-gray-900 dark:text-gray-100"}
            progressClassName="bg-blue-600"
        />
    );
}

