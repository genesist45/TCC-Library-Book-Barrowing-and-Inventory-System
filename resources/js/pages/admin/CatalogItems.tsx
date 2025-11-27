import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import CatalogItemTable from '@/components/catalog-items/CatalogItemTable';
import CatalogItemPageHeader from '@/components/catalog-items/CatalogItemPageHeader';
import CatalogItemDeleteModal from '@/components/catalog-items/CatalogItemDeleteModal';
import { toast } from 'react-toastify';
import { PageProps, CatalogItem } from '@/types';

interface Props extends PageProps {
    catalogItems: CatalogItem[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function CatalogItems({ catalogItems, flash }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleAddItem = () => {
        router.visit(route('admin.catalog-items.create'));
    };

    const handleViewItem = (item: CatalogItem) => {
        router.visit(route('admin.catalog-items.show', item.id));
    };

    const handleEditItem = (item: CatalogItem) => {
        router.visit(route('admin.catalog-items.edit', item.id));
    };

    const handleDeleteItem = (item: CatalogItem) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedItem) return;

        setProcessing(true);
        router.delete(route('admin.catalog-items.destroy', selectedItem.id), {
            onSuccess: () => {
                toast.success('Catalog item deleted successfully!');
                setShowDeleteModal(false);
                setSelectedItem(null);
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
                toast.error('Failed to delete catalog item');
            },
        });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => {
                setIsRefreshing(false);
            },
        });
    };

    const closeModal = () => {
        setShowDeleteModal(false);
        setSelectedItem(null);
    };

    const filteredItems = catalogItems.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (item.title?.toLowerCase() || '').includes(searchLower) ||
            (item.type?.toLowerCase() || '').includes(searchLower) ||
            (item.category?.name?.toLowerCase() || '').includes(searchLower) ||
            (item.publisher?.name?.toLowerCase() || '').includes(searchLower) ||
            (item.isbn?.toLowerCase() || '').includes(searchLower) ||
            (item.isbn13?.toLowerCase() || '').includes(searchLower)
        );
    });

    return (
        <AuthenticatedLayout>
            <Head title="Catalog Items">
                <style>{`
                    @media print {
                        /* Hide everything except the print content */
                        body * {
                            visibility: hidden;
                        }
                        
                        /* Show only the print container and its children */
                        #print-container,
                        #print-container * {
                            visibility: visible;
                        }
                        
                        /* Position the print container at the top */
                        #print-container {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            padding: 20px;
                        }
                        
                        /* Clean print styles */
                        @page {
                            margin: 1cm;
                        }
                        
                        /* Remove backgrounds and borders for clean printing */
                        body {
                            background: white !important;
                        }
                        
                        /* Table print styles */
                        table {
                            border-collapse: collapse;
                            width: 100%;
                            font-size: 10pt;
                        }
                        
                        th, td {
                            border: 1px solid #000 !important;
                            padding: 8px !important;
                            text-align: left;
                        }
                        
                        th {
                            background-color: #f0f0f0 !important;
                            font-weight: bold;
                        }
                        
                        /* Ensure table doesn't break across pages awkwardly */
                        tr {
                            page-break-inside: avoid;
                        }
                    }
                `}</style>
            </Head>

            {/* Screen View - Normal UI */}
            <div className="print:hidden p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <CatalogItemPageHeader
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        onAddItem={handleAddItem}
                        onRefresh={handleRefresh}
                        isRefreshing={isRefreshing}
                    />

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <CatalogItemTable
                            items={filteredItems}
                            onView={handleViewItem}
                            onEdit={handleEditItem}
                            onDelete={handleDeleteItem}
                            isLoading={isRefreshing}
                        />
                    </div>
                </div>
            </div>

            {/* Print View - Clean and Professional */}
            <div id="print-container" className="hidden print:block">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Catalog Inventory Report
                    </h1>
                    <p className="text-sm text-gray-600 mb-1">
                        Comprehensive list of all library catalog items and media resources
                    </p>
                    <p className="text-xs text-gray-500">
                        Generated on: {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                    <p className="text-xs text-gray-500">
                        Total Items: {filteredItems.length}
                    </p>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                ID
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Accession No.
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Title
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Material Type
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Authors
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Publication Details
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Year
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                ISBN
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Category
                            </th>
                            <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => (
                            <tr key={item.id}>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.id}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs font-medium">
                                    {item.accession_no}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs font-medium">
                                    {item.title}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.type}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.authors && item.authors.length > 0
                                        ? item.authors.map(a => a.name).join(', ')
                                        : '-'}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.publisher?.name || '-'}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.year || '-'}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.isbn || item.isbn13 || '-'}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.category?.name || '-'}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-xs">
                                    {item.is_active ? 'Active' : 'Inactive'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CatalogItemDeleteModal
                show={showDeleteModal}
                item={selectedItem}
                processing={processing}
                onConfirm={confirmDelete}
                onCancel={closeModal}
            />
        </AuthenticatedLayout>
    );
}
