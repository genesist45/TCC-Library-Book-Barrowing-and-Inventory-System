import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Calendar, Clock, BookOpen } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { CatalogItem } from '@/types';
import { toast } from 'react-toastify';
import axios from 'axios';

interface BorrowBookModalProps {
    book: CatalogItem;
    isOpen: boolean;
    onClose: () => void;
}

export default function BorrowBookModal({ book, isOpen, onClose }: BorrowBookModalProps) {
    const [memberValidation, setMemberValidation] = useState<{
        isValid: boolean | null;
        isChecking: boolean;
        message: string;
    }>({ isValid: null, isChecking: false, message: '' });

    const [dateError, setDateError] = useState<string>('');
    const [daysRemaining, setDaysRemaining] = useState<number>(0);
    const [borrowerCategory, setBorrowerCategory] = useState<'Student' | 'Faculty' | null>(null);

    const getMaxBorrowDays = (category: 'Student' | 'Faculty' | null): number => {
        if (category === 'Faculty') return 5;
        if (category === 'Student') return 2;
        return 2;
    };

    const calculateReturnDate = (category: 'Student' | 'Faculty'): string => {
        const date = new Date();
        date.setDate(date.getDate() + getMaxBorrowDays(category));
        return date.toISOString().split('T')[0];
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        member_id: '',
        catalog_item_id: book.id,
        full_name: '',
        email: '',
        quota: '',
        phone: '',
        address: '',
        return_date: new Date().toISOString().split('T')[0],
        return_time: '13:00',
        notes: '',
    });

    // Validate member number and auto-fill form fields
    useEffect(() => {
        if (data.member_id) {
            setMemberValidation({ isValid: null, isChecking: true, message: 'Checking...' });

            const timer = setTimeout(() => {
                axios
                    .get(`/api/members/${data.member_id}`)
                    .then((response) => {
                        const memberData = response.data;
                        const category = memberData.borrower_category || 'Student';
                        setBorrowerCategory(category);

                        // Auto-fill form fields from member data and set return date based on borrower category
                        setData((prevData) => ({
                            ...prevData,
                            full_name: memberData.name || '',
                            email: memberData.email || '',
                            quota: memberData.booking_quota?.toString() || '',
                            phone: memberData.phone || '',
                            return_date: calculateReturnDate(category),
                        }));

                        setMemberValidation({
                            isValid: true,
                            isChecking: false,
                            message: `Valid member (${category}) - Return date set to ${getMaxBorrowDays(category)} days`,
                        });
                    })
                    .catch(() => {
                        // Clear auto-filled fields if member not found
                        setBorrowerCategory(null);
                        setData((prevData) => ({
                            ...prevData,
                            full_name: '',
                            email: '',
                            quota: '',
                            phone: '',
                        }));

                        setMemberValidation({
                            isValid: false,
                            isChecking: false,
                            message: 'Member number does not exist',
                        });
                    });
            }, 500);

            return () => clearTimeout(timer);
        } else {
            // Clear fields when member_id is empty
            setBorrowerCategory(null);
            setData((prevData) => ({
                ...prevData,
                full_name: '',
                email: '',
                quota: '',
                phone: '',
            }));
            setMemberValidation({ isValid: null, isChecking: false, message: '' });
        }
    }, [data.member_id]);

    // Validate return date based on borrower category
    const validateReturnDate = (date: string): boolean => {
        if (!date) return false;

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        const maxDays = getMaxBorrowDays(borrowerCategory);
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + maxDays);

        const diffTime = selectedDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (selectedDate < today) {
            setDateError('Return date cannot be in the past');
            return false;
        }

        if (selectedDate > maxDate) {
            const categoryLabel = borrowerCategory === 'Faculty' ? 'Faculty' : 'Student';
            setDateError(`${categoryLabel} return date must be within ${maxDays} days from today`);
            return false;
        }

        setDateError('');
        return true;
    };

    // Validate date when it changes or borrower category changes
    useEffect(() => {
        if (data.return_date && borrowerCategory) {
            validateReturnDate(data.return_date);
        }
    }, [data.return_date, borrowerCategory]);

    // Calculate days remaining when return_date changes
    useEffect(() => {
        if (data.return_date) {
            const returnDate = new Date(data.return_date);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            returnDate.setHours(0, 0, 0, 0);

            const diffTime = returnDate.getTime() - todayDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysRemaining(diffDays);
        } else {
            setDaysRemaining(0);
        }
    }, [data.return_date]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('books.borrow-request.store'), {
            onSuccess: () => {
                toast.success('Borrow request submitted successfully!');
                reset();
                setMemberValidation({ isValid: null, isChecking: false, message: '' });
                setBorrowerCategory(null);
                setDateError('');
                setDaysRemaining(0);
                onClose();
            },
            onError: () => {
                toast.error('Failed to submit borrow request');
            },
            preserveScroll: true,
        });
    };

    const handleClose = () => {
        reset();
        setMemberValidation({ isValid: null, isChecking: false, message: '' });
        setBorrowerCategory(null);
        setDateError('');
        setDaysRemaining(0);
        onClose();
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Get max date based on borrower category
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + getMaxBorrowDays(borrowerCategory));
    const maxDateString = maxDate.toISOString().split('T')[0];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all dark:bg-[#2a2a2a]">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-[#3a3a3a]">
                                    <div>
                                        <Dialog.Title as="h3" className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                            Borrow Request
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#3a3a3a] dark:hover:text-gray-300"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Book Summary - Compact */}
                                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]/30">
                                    <div className="flex items-center gap-3">
                                        <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded border border-gray-200 bg-white shadow-sm dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                                            {book.cover_image ? (
                                                <img src={`/storage/${book.cover_image}`} alt={book.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-[#3a3a3a]">
                                                    <BookOpen className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="truncate font-bold text-sm text-gray-900 dark:text-gray-100">{book.title}</h4>
                                            {book.authors && book.authors.length > 0 && (
                                                <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                                                    {book.authors.map((a) => a.name).join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-4">
                                    <div className="space-y-4">
                                        {/* Member Number */}
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                                Member Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={data.member_id}
                                                    onChange={(e) => setData('member_id', e.target.value)}
                                                    className={`w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100 ${
                                                        memberValidation.isValid === true
                                                            ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                                                            : memberValidation.isValid === false
                                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                            : ''
                                                    }`}
                                                    placeholder="Enter member number"
                                                    autoFocus
                                                    required
                                                />
                                                {memberValidation.isValid === true && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {memberValidation.isChecking && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
                                                    </div>
                                                )}
                                            </div>
                                            {memberValidation.isValid === true && (
                                                <p className="mt-1 text-xs text-green-600 dark:text-green-400">{memberValidation.message}</p>
                                            )}
                                            {memberValidation.isValid === false && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{memberValidation.message}</p>
                                            )}
                                        </div>

                                        {/* Auto-filled Member Information */}
                                        {memberValidation.isValid && (
                                            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-900/30 dark:bg-indigo-900/10">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Name</label>
                                                        <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100">{data.full_name}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Borrower Category</label>
                                                        <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${borrowerCategory === 'Faculty' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                                                {borrowerCategory} ({getMaxBorrowDays(borrowerCategory)} days)
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Email</label>
                                                        <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100">{data.email}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Quota</label>
                                                        <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100">{data.quota}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Hidden Inputs for Auto-filled Data */}
                                        {memberValidation.isValid && (
                                            <>
                                                <input type="hidden" name="full_name" value={data.full_name} />
                                                <input type="hidden" name="email" value={data.email} />
                                                <input type="hidden" name="quota" value={data.quota} />
                                                <input type="hidden" name="phone" value={data.phone} />
                                            </>
                                        )}

                                        {/* Return Schedule */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    Return Date <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="date"
                                                        value={data.return_date}
                                                        onChange={(e) => setData('return_date', e.target.value)}
                                                        min={today}
                                                        max={maxDateString}
                                                        className={`w-full rounded-md py-1.5 pl-8 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-[#2a2a2a] dark:text-gray-100 ${dateError
                                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500'
                                                                : 'border-gray-300 dark:border-[#3a3a3a]'
                                                            }`}
                                                        required
                                                    />
                                                </div>
                                                {dateError ? (
                                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{dateError}</p>
                                                ) : (
                                                    <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
                                                        {daysRemaining === 0 ? 'Due today' :
                                                            daysRemaining === 1 ? '1 day remaining' :
                                                                `${daysRemaining} days remaining`}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    Return Time <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Clock className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="time"
                                                        value={data.return_time}
                                                        onChange={(e) => setData('return_time', e.target.value)}
                                                        className="w-full rounded-md py-1.5 pl-8 text-sm shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                                            <textarea
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                rows={2}
                                                className="w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                                placeholder="Any additional notes..."
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-5 flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-[#3a3a3a]">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100 dark:hover:bg-[#3a3a3a]"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing || !memberValidation.isValid || !!dateError}
                                            className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Submitting...' : 'Confirm Request'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
