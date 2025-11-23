import { CatalogItem } from '@/types';
import { useState, useEffect } from 'react';
import { X, BookOpen, Calendar, Clock } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import axios from 'axios';

interface BookDetailsModalProps {
    book: CatalogItem;
    isOpen: boolean;
    onClose: () => void;
}

export default function BookDetailsModal({ book, isOpen, onClose }: BookDetailsModalProps) {
    const { auth } = usePage().props as any;
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [memberValidation, setMemberValidation] = useState<{
        isValid: boolean | null;
        isChecking: boolean;
        message: string;
    }>({ isValid: null, isChecking: false, message: '' });

    // Get today's date and 1 month from today
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    const maxDateString = maxDate.toISOString().split('T')[0];

    // Format dates for display
    const todayFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const maxDateFormatted = maxDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        member_id: '',
        catalog_item_id: book.id,
        full_name: '',
        email: '',
        quota: '',
        phone: '',
        address: '',
        return_date: today,
        return_time: '07:00',
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

                        // Auto-fill form fields from member data
                        setData((prevData) => ({
                            ...prevData,
                            full_name: memberData.name || '',
                            email: memberData.email || '',
                            quota: memberData.booking_quota?.toString() || '',
                            phone: memberData.phone || '',
                        }));

                        setMemberValidation({
                            isValid: true,
                            isChecking: false,
                            message: 'Valid member number - Fields auto-filled',
                        });
                    })
                    .catch(() => {
                        // Clear auto-filled fields if member not found
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('books.borrow-request.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Book request submitted successfully!');
                reset();
                setShowRequestForm(false);
                onClose();
            },
        });
    };

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
            setDaysRemaining(null);
        }
    }, [data.return_date]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setShowRequestForm(false);
            reset();
            setMemberValidation({ isValid: null, isChecking: false, message: '' });
            setDaysRemaining(0); // Reset to 0 days (today)
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75 p-2 sm:p-4 transition-colors duration-200 dark:bg-black/60">
            <div className="relative w-full max-w-4xl animate-fade-in rounded-2xl sm:rounded-3xl bg-white shadow-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden dark:bg-[#2a2a2a]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 sm:right-6 sm:top-6 z-10 rounded-full bg-white p-2 sm:p-2.5 text-gray-400 shadow-lg ring-2 ring-gray-100 transition hover:bg-gray-50 hover:text-gray-600 hover:ring-gray-200 dark:bg-[#2a2a2a] dark:ring-[#3a3a3a] dark:hover:bg-[#3a3a3a] dark:hover:text-gray-300"
                >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                <div className="flex flex-col md:flex-row overflow-hidden">
                    {/* Left Side - Book Image */}
                    <div className={`relative flex flex-col items-center justify-start rounded-l-2xl sm:rounded-l-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-8 md:w-1/3 overflow-y-auto ${showRequestForm ? 'hidden md:flex' : 'flex'}`}>
                        <div className="w-full">
                            <div className="overflow-hidden rounded-md shadow-2xl ring-1 ring-black/5">
                                {book.cover_image ? (
                                    <img
                                        src={`/storage/${book.cover_image}`}
                                        alt={book.title}
                                        className="aspect-[2/3] w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex aspect-[2/3] items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                        <BookOpen className="h-24 w-24 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Book Details (Visible when Form is Open) */}
                            {showRequestForm && (
                                <div className="mt-6 animate-fade-in text-center">
                                    <h3 className="text-xl font-bold leading-tight text-gray-900">{book.title}</h3>

                                    {book.authors && book.authors.length > 0 && (
                                        <p className="mt-2 text-sm font-medium text-gray-600">
                                            By {book.authors.map((a) => a.name).join(', ')}
                                        </p>
                                    )}

                                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                                        <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 backdrop-blur-sm">
                                            {book.type}
                                        </span>
                                        {book.year && (
                                            <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200 backdrop-blur-sm">
                                                {book.year}
                                            </span>
                                        )}
                                        <span className={`rounded-full bg-white/60 px-3 py-1 text-xs font-semibold backdrop-blur-sm ${book.is_active ? 'text-green-700 ring-1 ring-green-200' : 'text-red-700 ring-1 ring-red-200'}`}>
                                            {book.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Separator Line */}
                    <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

                    {/* Right Side - Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Book Details View */}
                        <div
                            className={`grid transition-[grid-template-rows,opacity,transform] duration-500 ease-in-out ${showRequestForm ? 'grid-rows-[0fr] opacity-0 -translate-x-4 pointer-events-none' : 'grid-rows-[1fr] opacity-100 translate-x-0'
                                }`}
                        >
                            <div className="overflow-hidden">
                                <div className="p-4 sm:p-8 overflow-y-auto">
                                    <h2 className="text-xl sm:text-2xl font-bold leading-tight text-gray-900">{book.title}</h2>

                                    {book.authors && book.authors.length > 0 && (
                                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                                            By {book.authors.map((a) => a.name).join(', ')}
                                        </p>
                                    )}

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
                                            ID: #{book.id}
                                        </span>
                                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
                                            {book.type}
                                        </span>
                                        {book.year && (
                                            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
                                                {book.year}
                                            </span>
                                        )}
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${book.is_active ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : 'bg-red-100 text-red-700 ring-1 ring-red-200'}`}>
                                            {book.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${book.status === 'Available' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : 'bg-red-100 text-red-700 ring-1 ring-red-200'}`}>
                                            {book.status === 'Available' ? 'Available' : 'Borrowed'}
                                        </span>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="mt-5 space-y-2">
                                        {book.category && (
                                            <div className="rounded-lg bg-gray-50 p-2.5">
                                                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Category</h3>
                                                <p className="mt-0.5 text-sm font-medium text-gray-900">{book.category.name}</p>
                                            </div>
                                        )}

                                        {book.publisher && (
                                            <div className="rounded-lg bg-gray-50 p-2.5">
                                                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Publisher</h3>
                                                <p className="mt-0.5 text-sm font-medium text-gray-900">{book.publisher.name}</p>
                                            </div>
                                        )}

                                        {book.isbn && (
                                            <div className="rounded-lg bg-gray-50 p-2.5">
                                                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">ISBN</h3>
                                                <p className="mt-0.5 font-mono text-sm font-medium text-gray-900">{book.isbn}</p>
                                            </div>
                                        )}

                                        {book.call_no && (
                                            <div className="rounded-lg bg-gray-50 p-2.5">
                                                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Call Number</h3>
                                                <p className="mt-0.5 font-mono text-sm font-medium text-gray-900">{book.call_no}</p>
                                            </div>
                                        )}

                                        {book.description && (
                                            <div className="rounded-lg bg-gray-50 p-2.5">
                                                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Description</h3>
                                                <p className="mt-0.5 text-sm leading-relaxed text-gray-900">{book.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Book Request Button */}
                                    <div className="mt-6">
                                        {book.status === 'Borrowed' ? (
                                            <div className="w-full rounded-full bg-gray-100 px-8 py-2.5 text-center text-sm font-bold text-gray-500">
                                                <p>This book is currently borrowed</p>
                                                <p className="text-xs font-normal text-gray-400 mt-1">Not available for requests</p>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowRequestForm(true)}
                                                className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl active:scale-[0.98]"
                                            >
                                                Book a Request
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Borrow Request Form View */}
                        <div
                            className={`grid transition-[grid-template-rows,opacity,transform] duration-500 ease-in-out ${showRequestForm ? 'grid-rows-[1fr] opacity-100 translate-x-0' : 'grid-rows-[0fr] opacity-0 translate-x-4 pointer-events-none'
                                }`}
                        >
                            <div className="overflow-hidden">
                                <div className="p-4 sm:p-6 overflow-y-auto">
                                    <div className="mb-3">
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Borrow Request</h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Fill out the form to request borrowing this book
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-2">
                                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                            {/* Member Number */}
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-medium text-gray-700">
                                                    Member Number <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative mt-1">
                                                    <input
                                                        type="text"
                                                        value={data.member_id}
                                                        onChange={(e) => setData('member_id', e.target.value)}
                                                        className={`w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${memberValidation.isValid === true
                                                            ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                                                            : memberValidation.isValid === false
                                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                                : ''
                                                            }`}
                                                        placeholder="Enter member number"
                                                        required
                                                    />
                                                    {memberValidation.isValid === true && (
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {memberValidation.isChecking && (
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"></div>
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.member_id && <p className="mt-0.5 text-xs text-red-600">{errors.member_id}</p>}
                                                {memberValidation.isValid === true && (
                                                    <p className="mt-0.5 text-xs text-green-600">{memberValidation.message}</p>
                                                )}
                                                {memberValidation.isValid === false && (
                                                    <p className="mt-0.5 text-xs text-red-600">{memberValidation.message}</p>
                                                )}
                                            </div>

                                            {/* Member Information - Display as text when valid */}
                                            {memberValidation.isValid ? (
                                                <div className="sm:col-span-2 rounded-lg border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-900/30 dark:bg-indigo-900/10">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {/* Full Name */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Name</label>
                                                            <div className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                                {data.full_name}
                                                            </div>
                                                        </div>

                                                        {/* Email */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Email</label>
                                                            <div className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                                {data.email}
                                                            </div>
                                                        </div>

                                                        {/* Quota */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Quota</label>
                                                            <div className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                                {data.quota}
                                                            </div>
                                                        </div>

                                                        {/* Phone */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Phone</label>
                                                            <div className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                                {data.phone || '—'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}

                                            {/* Return Schedule Section */}
                                            <div className="sm:col-span-2">
                                                <h3 className="mb-1.5 text-sm font-semibold text-gray-700">Return Schedule</h3>
                                                <div className="grid grid-cols-2 gap-2.5">
                                                    {/* Return Date */}
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700">
                                                            Return Date <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="relative mt-1">
                                                            <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                            <input
                                                                type="date"
                                                                value={data.return_date}
                                                                onChange={(e) => setData('return_date', e.target.value)}
                                                                min={today}
                                                                max={maxDateString}
                                                                className="w-full rounded-md border-gray-300 py-1.5 pl-9 pr-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                required
                                                            />
                                                        </div>
                                                        {daysRemaining !== null && (
                                                            <p className="mt-1 text-xs font-medium text-indigo-600">
                                                                {daysRemaining === 0 ? 'Due today' :
                                                                    daysRemaining === 1 ? '1 day remaining' :
                                                                        `${daysRemaining} days remaining`}
                                                            </p>
                                                        )}
                                                        {errors.return_date && <p className="mt-0.5 text-xs text-red-600">{errors.return_date}</p>}
                                                    </div>

                                                    {/* Return Time */}
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700">
                                                            Return Time <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="relative mt-1">
                                                            <Clock className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                            <input
                                                                type="time"
                                                                value={data.return_time}
                                                                onChange={(e) => setData('return_time', e.target.value)}
                                                                className="w-full rounded-md border-gray-300 py-1.5 pl-9 pr-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                required
                                                            />
                                                        </div>
                                                        <p className="mt-1 text-xs text-gray-500">Allowed: 7:00-11:00 AM, 1:00-4:00 PM</p>
                                                        {errors.return_time && <p className="mt-0.5 text-xs text-red-600">{errors.return_time}</p>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Address */}
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-medium text-gray-700">Address</label>
                                                <textarea
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    rows={1}
                                                    className="mt-1 w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                                                    style={{ minHeight: '2.5rem' }}
                                                />
                                                {errors.address && <p className="mt-0.5 text-xs text-red-600">{errors.address}</p>}
                                            </div>

                                            {/* Notes */}
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-medium text-gray-700">Notes / Message</label>
                                                <textarea
                                                    value={data.notes}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                    rows={1}
                                                    className="mt-1 w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                                                    style={{ minHeight: '2.5rem' }}
                                                />
                                                {errors.notes && <p className="mt-0.5 text-xs text-red-600">{errors.notes}</p>}
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex justify-end gap-3 border-t border-gray-200 pt-3 mt-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowRequestForm(false)}
                                                className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-95"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                            >
                                                {processing ? 'Submitting...' : 'Submit Request'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
