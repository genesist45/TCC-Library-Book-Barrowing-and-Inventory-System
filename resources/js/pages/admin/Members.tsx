import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MemberTable from '@/components/members/MemberTable';
import MemberPageHeader from '@/components/members/MemberPageHeader';
import { toast } from 'react-toastify';
import MemberDeleteModal from '@/components/members/MemberDeleteModal';
import { Member, PageProps as InertiaPageProps } from '@/types';

interface PageProps extends InertiaPageProps {
    members: Member[];
}

export default function Members() {
    const { members } = usePage<PageProps>().props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [processing, setProcessing] = useState(false);

    const openDeleteModal = (member: Member) => {
        setSelectedMember(member);
        setShowDeleteModal(true);
    };

    const closeModals = () => {
        setShowDeleteModal(false);
        setSelectedMember(null);
    };

    const submitDelete = () => {
        if (!selectedMember) return;

        setProcessing(true);
        router.delete(route('admin.members.destroy', selectedMember.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Member deleted successfully!');
                closeModals();
                setProcessing(false);
            },
            onError: () => {
                toast.error('Failed to delete member');
                setProcessing(false);
            },
        });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            preserveUrl: true,
            onFinish: () => {
                setIsRefreshing(false);
            },
        });
    };

    const filteredMembers = members.filter(member =>
        (member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (member.member_no?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (member.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Members" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <MemberPageHeader
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        onRefresh={handleRefresh}
                        isRefreshing={isRefreshing}
                    />

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <MemberTable
                            members={filteredMembers}
                            onDelete={openDeleteModal}
                            isLoading={isRefreshing}
                        />
                    </div>
                </div>
            </div>

            <MemberDeleteModal
                show={showDeleteModal}
                member={selectedMember}
                processing={processing}
                onConfirm={submitDelete}
                onCancel={closeModals}
            />
        </AuthenticatedLayout>
    );
}
