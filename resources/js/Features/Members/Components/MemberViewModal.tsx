import Modal from '@/components/modals/Modal';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { useRef, useEffect } from 'react';
import { Member } from '@/types';

interface MemberViewModalProps {
    show: boolean;
    member: Member | null;
    onClose: () => void;
}

export default function MemberViewModal({ show, member, onClose }: MemberViewModalProps) {
    const memberDataRef = useRef<Member | null>(null);

    useEffect(() => {
        if (show && member) {
            memberDataRef.current = member;
        }
    }, [show, member]);

    const displayMember = show && member ? member : memberDataRef.current;

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-4 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-gray-100 sm:text-xl">Member Details</h2>

                {displayMember && (
                    <div className="mt-4 sm:mt-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Member Number
                                </label>
                                <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayMember.member_no}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Full Name
                                </label>
                                <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayMember.name}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Member Type
                                </label>
                                <p className="mt-1.5">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${displayMember.type === 'Privileged'
                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                        }`}>
                                        {displayMember.type}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Status
                                </label>
                                <p className="mt-1.5">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${displayMember.status === 'Active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            : displayMember.status === 'Suspended'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                        }`}>
                                        {displayMember.status}
                                    </span>
                                </p>
                            </div>

                            {displayMember.email && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                        Email
                                    </label>
                                    <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayMember.email}</p>
                                </div>
                            )}

                            {displayMember.phone && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                        Phone Number
                                    </label>
                                    <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayMember.phone}</p>
                                </div>
                            )}

                            {displayMember.member_group && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                        Member Group
                                    </label>
                                    <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayMember.member_group}</p>
                                </div>
                            )}

                            {displayMember.booking_quota !== null && displayMember.booking_quota !== undefined && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                        Booking Quota
                                    </label>
                                    <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayMember.booking_quota}</p>
                                </div>
                            )}

                            {displayMember.address && (
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                        Address
                                    </label>
                                    <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">{displayMember.address}</p>
                                </div>
                            )}



                            <div>
                                <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300 sm:text-sm">
                                    Joined Date
                                </label>
                                <p className="mt-1.5 text-sm text-gray-900 transition-colors duration-200 dark:text-gray-100">
                                    {new Date(displayMember.created_at).toLocaleDateString()}
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
