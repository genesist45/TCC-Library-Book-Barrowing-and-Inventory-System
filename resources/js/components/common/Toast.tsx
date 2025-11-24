import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Toast() {
    return (
        <>
            <style>{`
                .custom-toast-container {
                    top: 68px !important;
                    right: 2rem !important;
                    width: auto !important;
                    max-width: 350px !important;
                }
                
                @media (min-width: 1024px) {
                    .custom-toast-container {
                        top: 80px !important;
                    }
                }
                
                .custom-toast-container .Toastify__toast {
                    min-height: auto !important;
                    padding: 10px 14px !important;
                    margin-bottom: 8px !important;
                    min-width: 250px !important;
                    max-width: 350px !important;
                }
                
                .custom-toast-container .Toastify__toast-body {
                    padding: 0 !important;
                    margin: 0 !important;
                }
                
                .custom-toast-container .Toastify__toast-icon {
                    width: 20px !important;
                    margin-right: 10px !important;
                }
                
                .custom-toast-container .Toastify__close-button {
                    align-self: center !important;
                    margin-left: 8px !important;
                }
                
                .custom-toast-container .Toastify__progress-bar {
                    height: 3px !important;
                }
            `}</style>
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
                className="custom-toast-container"
                toastClassName="bg-white dark:bg-[#2a2a2a] shadow-lg border border-gray-200 dark:border-[#3a3a3a] rounded-lg"
                bodyClassName="text-sm font-medium text-gray-900 dark:text-gray-100"
                progressClassName="bg-blue-600"
            />
        </>
    );
}

