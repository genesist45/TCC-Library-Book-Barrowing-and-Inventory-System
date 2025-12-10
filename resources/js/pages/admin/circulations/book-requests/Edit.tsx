import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { PageProps, BookRequest } from '@/types';
import { Calendar, Clock } from 'lucide-react';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';

interface Props extends PageProps {
    bookRequest: BookRequest;
}

export default function BookRequestEdit({ bookRequest }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        full_name: bookRequest.full_name,
        email: bookRequest.email,
        quota: bookRequest.quota?.toString() || '',
        phone: bookRequest.phone || '',
        address: bookRequest.address || '',
        return_date: bookRequest.return_date ? bookRequest.return_date.split('T')[0] : '',
        return_time: bookRequest.return_time,
        notes: bookRequest.notes || '',
        status: bookRequest.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.book-requests.update', bookRequest.id));
    };

    const handleBack = () => {
        router.visit(route('admin.book-requests.index'));
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Book Request #${bookRequest.id}`} />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="border-b border-gray-200 p-4 dark:border-[#3a3a3a] sm:p-6">
                            <h2 className="text-xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                Edit Book Request #{bookRequest.id}
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400">
                                Book: {bookRequest.catalogItem?.title || bookRequest.catalog_item?.title || 'N/A'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                            <div className="space-y-6">
                                {/* Member Information (Read-only) */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                                    <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Member Information
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Member Number:
                                            </span>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                                {bookRequest.member?.member_no || `#${bookRequest.member_id}`}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Member Name:
                                            </span>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                                {bookRequest.member?.name || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.full_name}
                                        onChange={(e) => setData('full_name', e.target.value)}
                                        className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                        required
                                    />
                                    {errors.full_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                {/* Quota */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Quota
                                    </label>
                                    <input
                                        type="number"
                                        value={data.quota}
                                        onChange={(e) => setData('quota', e.target.value)}
                                        className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                    />
                                    {errors.quota && <p className="mt-1 text-sm text-red-600">{errors.quota}</p>}
                                </div>

                                {/* Return Date & Time */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Return Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative mt-1.5">
                                            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="date"
                                                value={data.return_date}
                                                onChange={(e) => setData('return_date', e.target.value)}
                                                min={today}
                                                className="w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                                required
                                            />
                                        </div>
                                        {errors.return_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.return_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Return Time <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative mt-1.5">
                                            <Clock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="time"
                                                value={data.return_time}
                                                onChange={(e) => setData('return_time', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                                required
                                            />
                                        </div>
                                        {errors.return_time && (
                                            <p className="mt-1 text-sm text-red-600">{errors.return_time}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Address
                                    </label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows={2}
                                        className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Notes / Message
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                    />
                                    {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as any)}
                                        className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-100"
                                        required
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Disapproved">Disapproved</option>
                                    </select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-[#3a3a3a]">
                                <SecondaryButton onClick={handleBack} type="button">
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
