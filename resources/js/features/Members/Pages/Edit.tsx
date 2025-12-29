import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import { FormEventHandler, useState, useEffect, ReactNode } from "react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { Member } from "@/types";
import { toast } from "react-toastify";
import { Pencil, History } from "lucide-react";
import {
    BasicInfoSection,
    BorrowerDetailsSection,
    ContactInfoSection,
    AddressSection,
} from "../Components/form-sections";
import MemberBorrowHistoryTable from "../Components/MemberBorrowHistoryTable";

type EditTabType = "edit-form" | "borrow-history";

interface Tab {
    id: EditTabType;
    label: string;
    icon: typeof Pencil;
}

const TABS: Tab[] = [
    { id: "edit-form", label: "EDIT FORM", icon: Pencil },
    { id: "borrow-history", label: "BORROW HISTORY", icon: History },
];

interface MemberBorrowRecord {
    id: number;
    member_id: number;
    member_name: string;
    member_no: string;
    catalog_item_id: number;
    book_title: string;
    accession_no?: string; // From the borrowed copy
    date_borrowed: string;
    due_date: string;
    date_returned: string | null;
    status: string;
    penalty_amount: number | null;
}

interface EditMemberProps {
    member: Member;
    borrowHistory?: MemberBorrowRecord[];
}

interface EditTabsProps {
    activeTab: EditTabType;
    onTabChange: (tab: EditTabType) => void;
    children: ReactNode;
    historyCount?: number;
}

function EditTabs({
    activeTab,
    onTabChange,
    children,
    historyCount = 0,
}: EditTabsProps) {
    const getTabCount = (tabId: EditTabType): number | undefined => {
        if (tabId === "borrow-history") return historyCount;
        return undefined;
    };

    return (
        <div>
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-2 overflow-x-auto sm:space-x-6">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const count = getTabCount(tab.id);
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => onTabChange(tab.id)}
                                className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-1 py-3 text-xs font-medium transition-colors sm:gap-2 sm:text-sm ${activeTab === tab.id
                                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                            >
                                <Icon size={16} className="flex-shrink-0" />
                                <span className="hidden sm:inline">
                                    {tab.label}
                                </span>
                                <span className="sm:hidden">
                                    {tab.label.split(" ")[0]}
                                </span>
                                {count !== undefined && count > 0 && (
                                    <span
                                        className={`ml-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium sm:ml-1 sm:px-2 ${activeTab === tab.id
                                            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                            }`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-6">{children}</div>
        </div>
    );
}

export default function Edit({
    member,
    borrowHistory = [],
}: EditMemberProps) {
    // Get URL query parameters to check for tab parameter
    const { url } = usePage();
    const urlParams = new URLSearchParams(url.split("?")[1] || "");
    const tabParam = urlParams.get("tab");

    // Set initial tab based on query parameter
    const getInitialTab = (): EditTabType => {
        if (tabParam === "borrow-history") {
            return "borrow-history";
        }
        return "edit-form";
    };

    const [activeTab, setActiveTab] = useState<EditTabType>(getInitialTab);

    // Update tab when URL parameter changes
    useEffect(() => {
        if (tabParam === "borrow-history") {
            setActiveTab("borrow-history");
        }
    }, [tabParam]);

    const { data, setData, patch, processing, errors, clearErrors } = useForm({
        member_no: member.member_no || "",
        name: member.name || "",
        type: member.type || "Regular",
        borrower_category: member.borrower_category || "Student",
        status: member.status || "Active",
        email: member.email || "",
        phone: member.phone || "",
        address: member.address || "",
        booking_quota: member.booking_quota || "",
        member_group: member.member_group || "",
        allow_login: member.allow_login ?? false,
    });

    const [showErrors, setShowErrors] = useState({
        member_no: true,
        name: true,
        type: true,
        borrower_category: true,
        status: true,
        email: true,
        phone: true,
        address: true,
        booking_quota: true,
        member_group: true,
        allow_login: true,
    });

    useEffect(() => {
        setData({
            member_no: member.member_no,
            name: member.name,
            type: member.type,
            borrower_category: member.borrower_category || "Student",
            status: member.status,
            email: member.email || "",
            phone: member.phone || "",
            address: member.address || "",
            booking_quota: member.booking_quota || "",
            member_group: member.member_group || "",
            allow_login: member.allow_login,
        });
    }, [member]);

    const handleChange = (
        field: keyof typeof data,
        value: string | boolean | number,
    ) => {
        setData(field, value as any);
        setShowErrors({ ...showErrors, [field]: false });
        if (errors[field]) {
            clearErrors(field);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        setShowErrors({
            member_no: true,
            name: true,
            type: true,
            borrower_category: true,
            status: true,
            email: true,
            phone: true,
            address: true,
            booking_quota: true,
            member_group: true,
            allow_login: true,
        });

        patch(route("admin.members.update", member.id), {
            onSuccess: () => {
                toast.success("Member updated successfully!");
            },
            onError: () => {
                toast.error("Failed to update member");
            },
        });
    };

    const handleBack = () => {
        router.visit(route("admin.members.index"));
    };

    const historyCount = borrowHistory.length;

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Member - ${member.name}`} />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="border-b border-gray-200 p-4 dark:border-[#3a3a3a] sm:p-6">
                            <h2 className="text-xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                Edit Member
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400">
                                Update the member information below
                            </p>
                        </div>

                        <div className="p-4 sm:p-6">
                            <EditTabs
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                historyCount={historyCount}
                            >
                                {activeTab === "edit-form" && (
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <BasicInfoSection
                                                data={data}
                                                errors={errors}
                                                showErrors={showErrors}
                                                onDataChange={handleChange}
                                            />
                                            <BorrowerDetailsSection
                                                data={data}
                                                errors={errors}
                                                showErrors={showErrors}
                                                onDataChange={handleChange}
                                            />
                                            <ContactInfoSection
                                                data={data}
                                                errors={errors}
                                                showErrors={showErrors}
                                                onDataChange={handleChange}
                                            />
                                        </div>

                                        <AddressSection
                                            data={data}
                                            errors={errors}
                                            showErrors={showErrors}
                                            onDataChange={handleChange}
                                        />



                                        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-[#3a3a3a]">
                                            <SecondaryButton
                                                type="button"
                                                onClick={handleBack}
                                            >
                                                Cancel
                                            </SecondaryButton>
                                            <PrimaryButton
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? "Updating..."
                                                    : "Update Member"}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                )}

                                {activeTab === "borrow-history" && (
                                    <div>
                                        <MemberBorrowHistoryTable
                                            records={borrowHistory}
                                            title="Borrow History"
                                        />

                                        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-[#3a3a3a]">
                                            <SecondaryButton
                                                onClick={handleBack}
                                            >
                                                Back to Members
                                            </SecondaryButton>
                                        </div>
                                    </div>
                                )}
                            </EditTabs>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
