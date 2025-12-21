import { PageProps, CatalogItem } from "@/types";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import PublicHeader from "@/components/common/PublicHeader";
import { useEffect } from "react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { toast } from "react-toastify";
import Toast from "@/components/common/Toast";

// Components
import BookSummaryCard from "@/components/books/BookSummaryCard";
import { TextField, TextAreaField, SelectField } from "@/components/borrow-request/FormFields";
import FormActions from "@/components/borrow-request/FormActions";
import { useMemberValidation } from "@/hooks/useMemberValidation";

interface Props extends PageProps {
    catalogItem: CatalogItem;
}

export default function BorrowRequest({ auth, catalogItem }: Props) {
    const { flash } = usePage().props as any;
    const availableCopies = catalogItem.copies?.filter((copy) => copy.status === "Available") ?? [];
    const today = new Date().toISOString().split("T")[0];

    const { data, setData, post, processing, errors } = useForm({
        member_id: "",
        catalog_item_id: catalogItem.id,
        catalog_item_copy_id: availableCopies.length > 0 ? availableCopies[0].id : (null as number | null),
        full_name: "",
        email: "",
        quota: "",
        phone: "",
        address: "",
        return_date: "",
        return_time: "12:00",
        notes: "",
    });

    const memberValidation = useMemberValidation(data.member_id);

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("books.borrow-request.store"));
    };

    const handleBack = () => {
        router.visit(route("books.show", catalogItem.id));
    };

    // Prepare copy options for select
    const copyOptions = availableCopies.map((copy) => ({
        value: copy.id,
        label: `Copy #${copy.copy_no} - Accession: ${copy.accession_no} (${copy.location || "Main"})`,
    }));

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
                            {/* Header */}
                            <div className="border-b border-gray-200 bg-white p-6">
                                <h1 className="text-2xl font-bold text-gray-900">Borrow Request</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Please fill out the form below to request a book borrow.
                                </p>
                            </div>

                            {/* Book Summary */}
                            <BookSummaryCard catalogItem={catalogItem} />

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {/* Member Number */}
                                    <TextField
                                        label="Member Number"
                                        value={data.member_id}
                                        onChange={(value) => setData("member_id", value)}
                                        required
                                        placeholder="Enter member number"
                                        error={errors.member_id}
                                        validationState={memberValidation.validationState}
                                        validationMessage={memberValidation.message}
                                    />

                                    {/* Copy Selection */}
                                    {catalogItem.copies && catalogItem.copies.length > 0 && (
                                        <SelectField
                                            label="Select Copy"
                                            value={data.catalog_item_copy_id}
                                            onChange={(value) => setData("catalog_item_copy_id", value)}
                                            options={copyOptions}
                                            required
                                            placeholder="-- Select a copy --"
                                            emptyMessage="No copies available for borrowing"
                                            error={errors.catalog_item_copy_id}
                                        />
                                    )}

                                    {/* Full Name */}
                                    <TextField
                                        label="Full Name"
                                        value={data.full_name}
                                        onChange={(value) => setData("full_name", value)}
                                        required
                                        error={errors.full_name}
                                    />

                                    {/* Email */}
                                    <TextField
                                        label="Email"
                                        value={data.email}
                                        onChange={(value) => setData("email", value)}
                                        type="email"
                                        required
                                        error={errors.email}
                                    />

                                    {/* Quota */}
                                    <TextField
                                        label="Quota"
                                        value={data.quota}
                                        onChange={(value) => setData("quota", value)}
                                        type="number"
                                        required
                                        error={errors.quota}
                                    />

                                    {/* Phone */}
                                    <TextField
                                        label="Phone"
                                        value={data.phone}
                                        onChange={(value) => setData("phone", value)}
                                        type="tel"
                                        error={errors.phone}
                                    />

                                    {/* Return Date */}
                                    <TextField
                                        label="Return Date"
                                        value={data.return_date}
                                        onChange={(value) => setData("return_date", value)}
                                        type="date"
                                        min={today}
                                        icon={Calendar}
                                        required
                                        error={errors.return_date}
                                    />

                                    {/* Return Time */}
                                    <TextField
                                        label="Return Time"
                                        value={data.return_time}
                                        onChange={(value) => setData("return_time", value)}
                                        type="time"
                                        icon={Clock}
                                        required
                                        error={errors.return_time}
                                    />

                                    {/* Address */}
                                    <TextAreaField
                                        label="Address"
                                        value={data.address}
                                        onChange={(value) => setData("address", value)}
                                        rows={2}
                                        error={errors.address}
                                        className="sm:col-span-2 lg:col-span-3"
                                    />

                                    {/* Notes */}
                                    <TextAreaField
                                        label="Notes / Message"
                                        value={data.notes}
                                        onChange={(value) => setData("notes", value)}
                                        rows={3}
                                        error={errors.notes}
                                        className="sm:col-span-2 lg:col-span-3"
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <FormActions
                                    onCancel={handleBack}
                                    submitLabel="Submit Request"
                                    processing={processing}
                                />
                            </form>
                        </div>
                    </div>
                </main>
            </div>
            <Toast />
        </>
    );
}
