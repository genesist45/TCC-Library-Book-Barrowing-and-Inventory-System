import { FormEventHandler, useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import SearchableSelect from '@/components/common/SearchableSelect';
import { toast } from 'react-toastify';
import { BookReturn } from '@/types';

interface AvailableRequest {
    id: number;
    label: string;
    member_id: number;
    catalog_item_id: number;
    member_name: string;
    book_title: string;
}

interface BookReturnFormProps {
    mode: 'add' | 'edit';
    bookReturn?: BookReturn | null;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function BookReturnForm({
    mode,
    bookReturn,
    onCancel,
    onSuccess,
}: BookReturnFormProps) {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().slice(0, 5);

    const { data, setData, post, patch, processing, errors, clearErrors, reset } = useForm({
        book_request_id: bookReturn?.book_request_id.toString() || '',
        member_id: bookReturn?.member_id.toString() || '',
        catalog_item_id: bookReturn?.catalog_item_id.toString() || '',
        return_date: bookReturn?.return_date || today,
        return_time: bookReturn?.return_time || currentTime,
        condition_on_return: (bookReturn?.condition_on_return || 'Good') as 'Good' | 'Damaged' | 'Lost',
        remarks: bookReturn?.remarks || '',
        penalty_amount: bookReturn?.penalty_amount ?? 0,
        status: (bookReturn?.status || 'Returned') as 'Returned' | 'Pending',
    });
    const [availableRequests, setAvailableRequests] = useState<AvailableRequest[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'add') {
            reset();
            setLoading(true);
            axios.get(route('admin.book-returns.create'))
                .then(response => {
                    setAvailableRequests(response.data.availableRequests);
                })
                .catch(error => {
                    console.error('Error loading available requests:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (bookReturn) {
            setData({
                book_request_id: bookReturn.book_request_id.toString(),
                member_id: bookReturn.member_id.toString(),
                catalog_item_id: bookReturn.catalog_item_id.toString(),
                return_date: bookReturn.return_date,
                return_time: bookReturn.return_time,
                condition_on_return: bookReturn.condition_on_return,
                remarks: bookReturn.remarks || '',
                penalty_amount: bookReturn.penalty_amount,
                status: bookReturn.status,
            });
        }
    }, [mode, bookReturn]);

    const handleBorrowIdChange = (borrowId: string) => {
        setData('book_request_id', borrowId);

        const selected = availableRequests.find(req => req.id.toString() === borrowId);
        if (selected) {
            setData('member_id', selected.member_id.toString());
            setData('catalog_item_id', selected.catalog_item_id.toString());
        }

        if (errors.book_request_id) {
            clearErrors('book_request_id');
        }
    };

    const handleFieldChange = (field: keyof typeof data, value: any) => {
        setData(field, value);

        if (errors[field]) {
            clearErrors(field);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        const penaltyAmount = typeof data.penalty_amount === 'number' ? data.penalty_amount : parseFloat(data.penalty_amount) || 0;
        setData('penalty_amount', penaltyAmount);

        setTimeout(() => {
            if (mode === 'add') {
                post(route('admin.book-returns.store'), {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Book return recorded successfully!');
                        reset();
                        onSuccess();
                    },
                });
            } else if (bookReturn) {
                patch(route('admin.book-returns.update', bookReturn.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Book return updated successfully!');
                        onSuccess();
                    },
                });
            }
        }, 0);
    };

    const selectedRequest = availableRequests.find(req => req.id.toString() === data.book_request_id);

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {mode === 'add' ? 'Add New Return' : 'Edit Return'}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {mode === 'add'
                    ? 'Record a new book return by filling out the form below'
                    : 'Update the return information'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                {/* Borrow ID - Only for Add */}
                {mode === 'add' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Borrow ID <span className="text-red-500">*</span>
                        </label>
                        <SearchableSelect
                            options={availableRequests}
                            value={data.book_request_id}
                            onChange={handleBorrowIdChange}
                            placeholder={loading ? 'Loading...' : 'Select a borrow transaction'}
                            disabled={loading}
                            error={errors.book_request_id}
                        />
                    </div>
                )}

                {/* Auto-filled Member and Book Info */}
                {selectedRequest && mode === 'add' && (
                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/10 transition-all duration-200">
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Member</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {selectedRequest.member_name}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Book</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {selectedRequest.book_title}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {/* Return Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Return Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={data.return_date}
                            onChange={(e) => handleFieldChange('return_date', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white sm:text-sm"
                            required
                        />
                        {errors.return_date && (
                            <p className="mt-1 text-sm text-red-600">{errors.return_date}</p>
                        )}
                    </div>

                    {/* Return Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Return Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            value={data.return_time}
                            onChange={(e) => handleFieldChange('return_time', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white sm:text-sm"
                            required
                        />
                        {errors.return_time && (
                            <p className="mt-1 text-sm text-red-600">{errors.return_time}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Condition on Return */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Condition on Return <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.condition_on_return}
                            onChange={(e) => handleFieldChange('condition_on_return', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white sm:text-sm"
                            required
                        >
                            <option value="Good">Good</option>
                            <option value="Damaged">Damaged</option>
                            <option value="Lost">Lost</option>
                        </select>
                        {errors.condition_on_return && (
                            <p className="mt-1 text-sm text-red-600">{errors.condition_on_return}</p>
                        )}
                    </div>

                    {/* Penalty Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Penalty Amount <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.penalty_amount}
                            onChange={(e) => handleFieldChange('penalty_amount', e.target.value === '' ? '' : parseFloat(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white sm:text-sm"
                            required
                        />
                        {errors.penalty_amount && (
                            <p className="mt-1 text-sm text-red-600">{errors.penalty_amount}</p>
                        )}
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={data.status}
                        onChange={(e) => handleFieldChange('status', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white sm:text-sm"
                        required
                    >
                        <option value="Returned">Returned</option>
                        <option value="Pending">Pending</option>
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                    )}
                </div>

                {/* Remarks */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Remarks
                    </label>
                    <textarea
                        rows={3}
                        value={data.remarks}
                        onChange={(e) => handleFieldChange('remarks', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-white sm:text-sm"
                        placeholder="Any additional notes about the return..."
                    />
                    {errors.remarks && (
                        <p className="mt-1 text-sm text-red-600">{errors.remarks}</p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-[#3a3a3a]">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#4a4a4a] dark:bg-[#3a3a3a] dark:text-gray-200 dark:hover:bg-[#4a4a4a]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        {processing ? 'Saving...' : mode === 'add' ? 'Add Return' : 'Update Return'}
                    </button>
                </div>
            </form>
        </div>
    );
}
