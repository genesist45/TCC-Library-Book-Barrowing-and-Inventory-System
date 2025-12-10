import { PageProps, CatalogItem } from '@/types';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import PublicHeader from '@/components/common/PublicHeader';
import { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import Toast from '@/components/common/Toast';
import axios from 'axios';

interface Props extends PageProps {
    catalogItem: CatalogItem;
}

export default function BorrowRequest({ auth, catalogItem }: Props) {
    const { flash } = usePage().props as any;
    const [memberValidation, setMemberValidation] = useState<{
        isValid: boolean | null;
        isChecking: boolean;
        message: string;
    }>({ isValid: null, isChecking: false, message: '' });

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const { data, setData, post, processing, errors } = useForm({
        member_id: '',
        catalog_item_id: catalogItem.id,
        full_name: '',
        email: '',
        quota: '',
        phone: '',
        address: '',
        return_date: '',
        return_time: '12:00',
        notes: '',
    });

    // Validate member number exists
    useEffect(() => {
        if (data.member_id) {
            setMemberValidation({ isValid: null, isChecking: true, message: 'Checking...' });

            const timer = setTimeout(() => {
                axios
                    .get(`/api/members/${data.member_id}`)
                    .then(() => {
                        setMemberValidation({
                            isValid: true,
                            isChecking: false,
                            message: 'Valid member number',
                        });
                    })
                    .catch(() => {
                        setMemberValidation({
                            isValid: false,
                            isChecking: false,
                            message: 'Member number does not exist',
                        });
                    });
            }, 500);

            return () => clearTimeout(timer);
        } else {
            setMemberValidation({ isValid: null, isChecking: false, message: '' });
        }
    }, [data.member_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('books.borrow-request.store'), {
            onSuccess: () => {
                // Redirect back to book details after successful submission
                // The controller redirects back, which would be this page.
                // We might want to redirect to the book details page instead.
                // But for now, let's rely on the controller's redirect back behavior
                // and maybe add a manual visit if needed.
                // Actually, the controller does `redirect()->back()`.
                // If we are on this page, back is this page.
                // Ideally we should redirect to the book details page.
                // But let's stick to the current flow for now.
            },
        });
    };

    const handleBack = () => {
        router.visit(route('books.show', catalogItem.id));
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <Head title={`Borrow Request - ${catalogItem.title}`} />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-jakarta">
                <PublicHeader user={auth.user} />

                <main className="container mx-auto px-4 py-24 sm:px-6 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        {/* Back Button */}
                        <button
                            onClick={handleBack}
                            className="mb-6 flex items-center text-sm font-medium text-gray-600 transition hover:text-indigo-600"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Book Details
                        </button>

                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                            <div className="border-b border-gray-200 bg-white p-6">
                                <h1 className="text-2xl font-bold text-gray-900">Borrow Request</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Please fill out the form below to request a book borrow.
                                </p>
                            </div>

                            {/* Book Summary */}
                            <div className="bg-gray-50 px-6 py-6 border-b border-gray-200">
                                <div className="flex items-start gap-6">
                                    {/* Cover Image */}
                                    <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
                                        {catalogItem.cover_image ? (
                                            <img
                                                src={`/storage/${catalogItem.cover_image}`}
                                                alt={catalogItem.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                <BookOpen className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Title & Info */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{catalogItem.title}</h3>
                                        <div className="mt-2 text-sm text-gray-600">
                                            {catalogItem.authors && catalogItem.authors.length > 0 && (
                                                <span>By {catalogItem.authors.map((a) => a.name).join(', ')}</span>
                                            )}
                                        </div>
                                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                            <span className="rounded bg-gray-200 px-2 py-1 font-medium text-gray-700">
                                                ID: #{catalogItem.id}
                                            </span>
                                            <span className="rounded bg-indigo-50 px-2 py-1 font-medium text-indigo-700">
                                                {catalogItem.type}
                                            </span>
                                            {catalogItem.year && (
                                                <span className="rounded bg-gray-100 px-2 py-1 font-medium text-gray-600">
                                                    {catalogItem.year}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {/* Member Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Member Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative mt-1.5">
                                            <input
                                                type="text"
                                                value={data.member_id}
                                                onChange={(e) => setData('member_id', e.target.value)}
                                                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${memberValidation.isValid === true
                                                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                                                    : memberValidation.isValid === false
                                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                        : ''
                                                    }`}
                                                placeholder="Enter member number"
                                                required
                                            />
                                            {/* Validation Icons */}
                                            {memberValidation.isValid === true && (
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                            {memberValidation.isChecking && (
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"></div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Validation Messages */}
                                        {errors.member_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.member_id}</p>
                                        )}
                                        {memberValidation.isValid === true && (
                                            <p className="mt-1 flex items-center text-sm text-green-600">
                                                <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                {memberValidation.message}
                                            </p>
                                        )}
                                        {memberValidation.isValid === false && (
                                            <p className="mt-1 text-sm text-red-600">{memberValidation.message}</p>
                                        )}
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.full_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    {/* Quota */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Quota <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={data.quota}
                                            onChange={(e) => setData('quota', e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.quota && <p className="mt-1 text-sm text-red-600">{errors.quota}</p>}
                                    </div>

                                    {/* Phone (Optional) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>

                                    {/* Return Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Return Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative mt-1.5">
                                            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="date"
                                                value={data.return_date}
                                                onChange={(e) => setData('return_date', e.target.value)}
                                                min={today}
                                                className="w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                        </div>
                                        {errors.return_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.return_date}</p>
                                        )}
                                    </div>

                                    {/* Return Time */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Return Time <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative mt-1.5">
                                            <Clock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="time"
                                                value={data.return_time}
                                                onChange={(e) => setData('return_time', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                        </div>
                                        {errors.return_time && (
                                            <p className="mt-1 text-sm text-red-600">{errors.return_time}</p>
                                        )}
                                    </div>

                                    {/* Address (Optional) */}
                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <textarea
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            rows={2}
                                            className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                    </div>

                                    {/* Notes (Optional) */}
                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700">Notes / Message</label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows={3}
                                            className="mt-1.5 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="rounded-lg border-2 border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
            <Toast />
        </>
    );
}
