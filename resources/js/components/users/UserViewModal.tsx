import Modal from '@/components/modals/Modal';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import defaultUserImage from '@/assets/images/avatars/default-user.png';
import { useRef, useEffect } from 'react';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    username: string;
    email: string;
    role: 'admin' | 'staff';
    profile_picture?: string;
    created_at: string;
}

interface UserViewModalProps {
    show: boolean;
    user: User | null;
    onClose: () => void;
}

export default function UserViewModal({ show, user, onClose }: UserViewModalProps) {
    // Keep a stable reference to user data during close animation
    const userDataRef = useRef<User | null>(null);

    useEffect(() => {
        // Update ref when modal is shown and user data exists
        if (show && user) {
            userDataRef.current = user;
        }
    }, [show, user]);

    // Use actual user data when modal is open, ref data during close animation
    const displayUser = show && user ? user : userDataRef.current;

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-4 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100 sm:text-xl">User Details</h2>

                {displayUser && (
                    <div className="mt-4 sm:mt-6">
                        {/* Profile Picture */}
                        <div className="mb-6 flex justify-center sm:mb-8">
                            <div className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-gray-100 transition-all duration-200 dark:ring-gray-700 sm:h-28 sm:w-28">
                                {displayUser.profile_picture ? (
                                    <img
                                        src={`/storage/${displayUser.profile_picture}`}
                                        alt={displayUser.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={defaultUserImage}
                                        alt={displayUser.name}
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-5">
                            {/* First Name and Last Name in one row */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                        First Name
                                    </label>
                                    <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayUser.first_name}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                        Last Name
                                    </label>
                                    <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayUser.last_name}</p>
                                </div>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Username
                                </label>
                                <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayUser.username}</p>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Email
                                </label>
                                <p className="mt-1.5 break-all text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayUser.email}</p>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Role
                                </label>
                                <p className="mt-1.5">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${displayUser.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                        }`}>
                                        {displayUser.role.charAt(0).toUpperCase() + displayUser.role.slice(1)}
                                    </span>
                                </p>
                            </div>

                            {/* Created At */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Created At
                                </label>
                                <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                    {new Date(displayUser.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-5 flex justify-end sm:mt-6">
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}

