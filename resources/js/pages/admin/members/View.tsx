import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Member } from "@/types";
import { Pencil } from "lucide-react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import {
    MemberDetailsGrid,
    ViewDetailsTabs,
} from "@/components/members/view-sections";
import type { MemberViewTabType } from "@/components/members/view-sections";
import MemberBorrowHistoryTable from "@/components/members/MemberBorrowHistoryTable";

interface MemberBorrowRecord {
    id: number;
    member_id: number;
    member_name: string;
    member_no: string;
    catalog_item_id: number;
    book_title: string;
    accession_no: string;
    date_borrowed: string;
    due_date: string;
    date_returned: string | null;
    status: string;
    penalty_amount: number | null;
}

interface ViewMemberProps {
    member: Member;
    borrowHistory?: MemberBorrowRecord[];
}

export default function ViewMember({
    member,
    borrowHistory = [],
}: ViewMemberProps) {
    // Get URL query parameters to check for tab parameter
    const { url } = usePage();
    const urlParams = new URLSearchParams(url.split("?")[1] || "");
    const tabParam = urlParams.get("tab");

    // Set initial tab based on query parameter
    const getInitialTab = (): MemberViewTabType => {
        if (tabParam === "borrow-history") {
            return "borrow-history";
        }
        return "member-info";
    };

    const [activeTab, setActiveTab] =
        useState<MemberViewTabType>(getInitialTab);

    // Update tab when URL parameter changes
    useEffect(() => {
        if (tabParam === "borrow-history") {
            setActiveTab("borrow-history");
        }
    }, [tabParam]);

    const handleBack = () => {
        router.visit(route("admin.members.index"));
    };

    const historyCount = borrowHistory.length;

    return (
        <AuthenticatedLayout>
            <Head title={`View Member - ${member.name}`} />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <div className="border-b border-gray-200 p-4 dark:border-[#3a3a3a] sm:p-6">
                            <h2 className="text-xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                Member Details
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-400">
                                View complete information about this member
                            </p>
                        </div>

                        <div className="p-4 sm:p-6">
                            <ViewDetailsTabs
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                historyCount={historyCount}
                            >
                                {activeTab === "member-info" && (
                                    <MemberDetailsGrid member={member} />
                                )}

                                {activeTab === "borrow-history" && (
                                    <MemberBorrowHistoryTable
                                        records={borrowHistory}
                                        title="Borrow History"
                                    />
                                )}
                            </ViewDetailsTabs>

                            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-[#3a3a3a]">
                                <SecondaryButton onClick={handleBack}>
                                    Close
                                </SecondaryButton>
                                <Link
                                    href={route(
                                        "admin.members.edit",
                                        member.id,
                                    )}
                                >
                                    <PrimaryButton className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Edit Member
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
