import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Toast() {
    return (
        <>
            <style>{`
                .custom-toast-container {
                    bottom: 1.5rem !important;
                    right: 2rem !important;
                    width: auto !important;
                    max-width: 350px !important;
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
                    font-size: 0.8125rem !important;
                    font-weight: 500 !important;
                    color: #111827 !important;
                }
                
                .dark .custom-toast-container .Toastify__toast-body {
                    color: #f3f4f6 !important;
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
                position="bottom-right"
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
                progressClassName="bg-blue-600"
            />
        </>
    );
}

