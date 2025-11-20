import { PageProps, CatalogItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import PublicHeader from '@/components/common/PublicHeader';
import { useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface Props extends PageProps {
    catalogItem: CatalogItem;
}

export default function BookDetails({ auth, catalogItem }: Props) {
    const { flash } = usePage().props as any;
    const handleBorrowRequest = () => {
        router.visit(route('books.borrow-request.create', catalogItem.id));
    };

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <>
            <Head title={catalogItem.title} />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-jakarta">
                <PublicHeader user={auth.user} />

                <main className="container mx-auto px-4 py-24 sm:px-6 lg:px-12">
                    <div className="mx-auto max-w-5xl">
                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                            <div className="p-6 sm:p-8">
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                    {/* Book Cover */}
                                    <div className="flex justify-center lg:justify-start">
                                        {catalogItem.cover_image ? (
                                            <img
                                                src={`/storage/${catalogItem.cover_image}`}
                                                alt={catalogItem.title}
                                                className="h-80 w-auto rounded-lg border border-gray-300 object-cover shadow-md"
                                            />
                                        ) : (
                                            <div className="flex h-80 w-56 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                                <BookOpen className="h-16 w-16 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Book Details */}
                                    <div className="lg:col-span-2">
                                        <h1 className="text-3xl font-bold text-gray-900">{catalogItem.title}</h1>

                                        <div className="mt-4 space-y-3">
                                            {catalogItem.authors && catalogItem.authors.length > 0 && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600">Authors: </span>
                                                    <span className="text-sm text-gray-900">
                                                        {catalogItem.authors.map((a) => a.name).join(', ')}
                                                    </span>
                                                </div>
                                            )}

                                            {catalogItem.publisher && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600">Publisher: </span>
                                                    <span className="text-sm text-gray-900">{catalogItem.publisher.name}</span>
                                                </div>
                                            )}

                                            {catalogItem.category && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600">Category: </span>
                                                    <span className="text-sm text-gray-900">{catalogItem.category.name}</span>
                                                </div>
                                            )}

                                            <div>
                                                <span className="text-sm font-medium text-gray-600">Type: </span>
                                                <span className="text-sm text-gray-900">{catalogItem.type}</span>
                                            </div>

                                            {catalogItem.year && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600">Year: </span>
                                                    <span className="text-sm text-gray-900">{catalogItem.year}</span>
                                                </div>
                                            )}

                                            {catalogItem.isbn && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600">ISBN: </span>
                                                    <span className="text-sm text-gray-900">{catalogItem.isbn}</span>
                                                </div>
                                            )}

                                            <div>
                                                <span className="text-sm font-medium text-gray-600">Status: </span>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${catalogItem.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {catalogItem.is_active ? 'Available' : 'Unavailable'}
                                                </span>
                                            </div>
                                        </div>

                                        {catalogItem.description && (
                                            <div className="mt-6">
                                                <h3 className="text-sm font-medium text-gray-600">Description</h3>
                                                <p className="mt-2 text-sm text-gray-900">{catalogItem.description}</p>
                                            </div>
                                        )}

                                        {/* Borrow Request Button */}
                                        <div className="mt-8">
                                            <button
                                                onClick={handleBorrowRequest}
                                                className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                Request to Borrow
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Toaster position="top-right" richColors />
        </>
    );
}
