import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import { Calendar, Clock, Mail, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import InputLabel from '@/components/forms/InputLabel';
import TextInput from '@/components/forms/TextInput';
import InputError from '@/components/forms/InputError';
import PrimaryButton from '@/components/buttons/PrimaryButton';

interface EmailReminderFormData {
    email: string;
    return_date: string;
    return_time: string;
}

export default function EmailReminder() {
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
    const [createdAt, setCreatedAt] = useState<string>('');

    const { data, setData, post, processing, errors, reset } = useForm<EmailReminderFormData>({
        email: '',
        return_date: new Date().toISOString().split('T')[0],
        return_time: '13:00',
    });

    useEffect(() => {
        calculateDaysRemaining(data.return_date);
    }, [data.return_date]);

    const calculateDaysRemaining = (returnDate: string) => {
        if (!returnDate) {
            setDaysRemaining(null);
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dueDate = new Date(returnDate);
        dueDate.setHours(0, 0, 0, 0);

        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        setDaysRemaining(diffDays);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('email-reminder.send'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Email reminder scheduled successfully!', {
                    description: `Reminder will be sent on ${data.return_date} at ${data.return_time}`,
                });
                
                const now = new Date();
                setCreatedAt(now.toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }));
                
                reset('email');
            },
            onError: (errors) => {
                if (errors.email) {
                    toast.error('Invalid Email', {
                        description: errors.email,
                    });
                } else {
                    toast.error('Submission Failed', {
                        description: 'Please check all fields and try again.',
                    });
                }
            },
        });
    };

    const getDaysRemainingText = () => {
        if (daysRemaining === null) return '';
        
        if (daysRemaining < 0) {
            return `${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''} overdue`;
        } else if (daysRemaining === 0) {
            return 'Due today';
        } else if (daysRemaining === 1) {
            return '1 day remaining';
        } else {
            return `${daysRemaining} days remaining`;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Email Reminder Sender" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-[#1a1a1a]">
                            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                Email Reminder Sender
                            </h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Test scheduled email reminders for book return dates
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6 p-6">
                            {/* All Fields Inline Layout */}
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                {/* Email Field */}
                                <div>
                                    <InputLabel htmlFor="email" value="Borrower Email" />
                                    <div className="relative mt-1">
                                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="block w-full pl-10"
                                            autoComplete="email"
                                            placeholder="e.g., hunter@gmail.com"
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Return Date */}
                                <div>
                                    <InputLabel htmlFor="return_date" value="Return Date / Schedule" />
                                    <div className="relative mt-1">
                                        <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            id="return_date"
                                            type="date"
                                            name="return_date"
                                            value={data.return_date}
                                            onChange={(e) => setData('return_date', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 pl-10 shadow-sm transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.return_date} className="mt-2" />
                                    
                                    {daysRemaining !== null && (
                                        <div className={`mt-2 flex items-center gap-2 text-sm font-medium ${
                                            daysRemaining < 0 ? 'text-red-600 dark:text-red-400' :
                                            daysRemaining === 0 ? 'text-yellow-600 dark:text-yellow-400' :
                                            'text-green-600 dark:text-green-400'
                                        }`}>
                                            <Calendar className="h-4 w-4" />
                                            {getDaysRemainingText()}
                                        </div>
                                    )}
                                </div>

                                {/* Return Time */}
                                <div>
                                    <InputLabel htmlFor="return_time" value="Return Time" />
                                    <div className="relative mt-1">
                                        <Clock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            id="return_time"
                                            type="time"
                                            name="return_time"
                                            value={data.return_time}
                                            onChange={(e) => setData('return_time', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 pl-10 shadow-sm transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.return_time} className="mt-2" />
                                </div>
                            </div>

                            {/* Created At (Read Only) */}
                            {createdAt && (
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                Last Submission
                                            </p>
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                Created at: {createdAt}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                                <PrimaryButton disabled={processing}>
                                    <Send className="mr-2 h-4 w-4" />
                                    {processing ? 'Scheduling...' : 'Schedule Email Reminder'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#1a1a1a]">
                        <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                            📧 Email Preview
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <p><strong>Subject:</strong> Book Due Reminder</p>
                            <p><strong>Message:</strong> "Your borrowed book is due on {data.return_date} at {data.return_time}. Please return it to the library. Thank you."</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

