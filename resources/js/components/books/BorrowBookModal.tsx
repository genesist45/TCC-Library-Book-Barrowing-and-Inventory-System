import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Search, Calendar, Clock, BookOpen } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { CatalogItem } from '@/types';
import { toast } from 'sonner';
import axios from 'axios';

interface Member {
    id: number;
    member_no: string;
    name: string;
    email: string;
    quota: number;
    phone?: string;
}

interface BorrowBookModalProps {
    book: CatalogItem;
    isOpen: boolean;
    onClose: () => void;
}

export default function BorrowBookModal({ book, isOpen, onClose }: BorrowBookModalProps) {
    // Search States
    const [memberSearch, setMemberSearch] = useState('');
    const [searchResults, setSearchResults] = useState<Member[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [showResults, setShowResults] = useState(false);

    // Validation States
    const [timeError, setTimeError] = useState<string>('');
    const [dateError, setDateError] = useState<string>('');
    const [daysRemaining, setDaysRemaining] = useState<number>(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        member_id: '',
        catalog_item_id: book.id,
        full_name: '',
        email: '',
        quota: '',
        phone: '',
        address: '',
        return_date: new Date().toISOString().split('T')[0],
        return_time: '12:00',
        notes: '',
    });

    // Search members
    useEffect(() => {
        if (memberSearch.length >= 1) {
            setIsSearching(true);
            const timer = setTimeout(() => {
                axios
                    .get('/api/members/search', {
                        params: { query: memberSearch },
                    })
                    .then((response) => {
                        setSearchResults(response.data);
                        setShowResults(true);
                        setIsSearching(false);
                    })
                    .catch(() => {
                        setIsSearching(false);
                    });
            }, 300);

            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    }, [memberSearch]);

    // Handle member selection
    const handleSelectMember = (member: Member) => {
        setSelectedMember(member);
        setMemberSearch(`${member.name} (${member.member_no})`);
        setShowResults(false);

        // Auto-fill form fields
        setData((prevData) => ({
            ...prevData,
            member_id: member.id.toString(),
            full_name: member.name,
            email: member.email,
            quota: member.quota.toString(),
            phone: member.phone || '',
        }));
    };

    // Validate return time
    const validateReturnTime = (time: string): boolean => {
        if (!time) return false;

        const [hours, minutes] = time.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;

        // Morning: 7:00 AM - 11:00 AM (420 - 660 minutes)
        const morningStart = 7 * 60; // 420
        const morningEnd = 11 * 60; // 660

        // Afternoon: 1:00 PM - 4:00 PM (780 - 960 minutes)
        const afternoonStart = 13 * 60; // 780
        const afternoonEnd = 16 * 60; // 960

        const isValidTime =
            (timeInMinutes >= morningStart && timeInMinutes <= morningEnd) ||
            (timeInMinutes >= afternoonStart && timeInMinutes <= afternoonEnd);

        if (!isValidTime) {
            setTimeError('Time must be between 7:00-11:00 AM or 1:00-4:00 PM');
        } else {
            setTimeError('');
        }

        return isValidTime;
    };

    // Validate return date (within 7 days)
    const validateReturnDate = (date: string): boolean => {
        if (!date) return false;

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 7);

        const diffTime = selectedDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (selectedDate < today) {
            setDateError('Return date cannot be in the past');
            return false;
        }

        if (selectedDate > maxDate) {
            setDateError('Return date must be within 7 days from today');
            return false;
        }

        setDateError('');
        return true;
    };

    // Validate time when it changes
    useEffect(() => {
        if (data.return_time) {
            validateReturnTime(data.return_time);
        }
    }, [data.return_time]);

    // Validate date when it changes
    useEffect(() => {
        if (data.return_date) {
            validateReturnDate(data.return_date);
        }
    }, [data.return_date]);

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
                setSelectedMember(null);
                setMemberSearch('');
                setTimeError('');
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
        setSelectedMember(null);
        setMemberSearch('');
        setShowResults(false);
        setTimeError('');
        setDateError('');
        setDaysRemaining(0);
        onClose();
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Get max date (7 days from today)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
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
                                        {/* Member Selection */}
                                        <div>
                                            {!selectedMember ? (
                                                <div className="relative">
                                                    <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        Search Member <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <Search className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={memberSearch}
                                                            onChange={(e) => setMemberSearch(e.target.value)}
                                                            className="w-full rounded-md border-gray-300 py-1.5 pl-9 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                                            placeholder="Search member..."
                                                            autoFocus
                                                        />
                                                        {isSearching && (
                                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Dropdown Results */}
                                                    {showResults && searchResults.length > 0 && (
                                                        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                                                            {searchResults.map((member) => (
                                                                <button
                                                                    key={member.id}
                                                                    type="button"
                                                                    onClick={() => handleSelectMember(member)}
                                                                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-gray-50 dark:hover:bg-[#3a3a3a]"
                                                                >
                                                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                                        <span className="text-xs font-bold">{member.name.charAt(0)}</span>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{member.name}</p>
                                                                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{member.member_no}</p>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                /* Selected Member Preview Card */
                                                <div className="relative rounded-lg border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-900/30 dark:bg-indigo-900/10">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                                <span className="text-sm font-bold">{selectedMember.name.charAt(0)}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{selectedMember.name}</p>
                                                                <div className="flex flex-col text-xs text-gray-600 dark:text-gray-400">
                                                                    <span>{selectedMember.email}</span>
                                                                    {selectedMember.phone && <span>{selectedMember.phone}</span>}
                                                                    <span>Quota: {selectedMember.quota}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedMember(null);
                                                                setMemberSearch('');
                                                                setData((prev) => ({
                                                                    ...prev,
                                                                    member_id: '',
                                                                    full_name: '',
                                                                    email: '',
                                                                    quota: '',
                                                                    phone: '',
                                                                }));
                                                            }}
                                                            className="rounded p-1 text-gray-400 hover:bg-white hover:text-red-500 dark:hover:bg-[#3a3a3a]"
                                                            title="Change Member"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Hidden Inputs for Auto-filled Data */}
                                        {selectedMember && (
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
                                                        className={`w-full rounded-md py-1.5 pl-8 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-[#2a2a2a] dark:text-gray-100 ${timeError
                                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500'
                                                                : 'border-gray-300 dark:border-[#3a3a3a]'
                                                            }`}
                                                        required
                                                    />
                                                </div>
                                                {timeError ? (
                                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{timeError}</p>
                                                ) : (
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Allowed: 7:00-11:00 AM, 1:00-4:00 PM</p>
                                                )}
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
                                            disabled={processing || !selectedMember || !!timeError || !!dateError}
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
