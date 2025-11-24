import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import UserTable from '@/components/users/UserTable';
import UserPageHeader from '@/components/users/UserPageHeader';
import { toast } from 'sonner';
import Modal from '@/components/modals/Modal';
import UserForm from '@/components/users/UserForm';
import UserViewModal from '@/components/users/UserViewModal';
import UserDeleteModal from '@/components/users/UserDeleteModal';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    username: string;
    email: string;
    role: 'admin' | 'staff';
    profile_picture?: string;
    created_at: string;
}

export default function Index({ users }: { users: User[] }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formErrors, setFormErrors] = useState<any>({});
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        role: '' as 'admin' | 'staff' | '',
        password: '',
        password_confirmation: '',
    });

    const openAddModal = () => {
        reset();
        clearErrors();
        setFormErrors({});
        setShowAddModal(true);
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        clearErrors();
        setFormErrors({});
        setData({
            name: user.name,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            email: user.email,
            role: user.role,
            password: '',
            password_confirmation: '',
        });
        setShowEditModal(true);
    };

    const openViewModal = (user: User) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
        setShowDeleteModal(false);
        setSelectedUser(null);
        reset();
    };

    const submitAdd: FormEventHandler = (e) => {
        e.preventDefault();

        const fullName = `${data.first_name} ${data.last_name}`.trim();
        const submitData = {
            ...data,
            name: fullName,
        };

        router.post(route('users.store'), submitData, {
            onSuccess: () => {
                closeModals();
                reset();
                setFormErrors({});
                toast.success('User added successfully!');
            },
            onError: (err) => {
                setFormErrors(err);
            },
            preserveScroll: true,
        });
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (selectedUser) {
            const fullName = `${data.first_name} ${data.last_name}`.trim();
            const submitData = {
                ...data,
                name: fullName,
            };

            router.patch(route('users.update', selectedUser.id), submitData, {
                onSuccess: () => {
                    closeModals();
                    reset();
                    setFormErrors({});
                    toast.success('User updated successfully!');
                },
                onError: (err) => {
                    setFormErrors(err);
                },
                preserveScroll: true,
            });
        }
    };

    const submitDelete = () => {
        if (selectedUser) {
            destroy(route('users.destroy', selectedUser.id), {
                onSuccess: () => {
                    closeModals();
                    toast.success('User deleted successfully!');
                },
            });
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['users'],
            onFinish: () => {
                setTimeout(() => {
                    setIsRefreshing(false);
                }, 500);
            },
        });
    };

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Users" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <UserPageHeader
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        onAddUser={openAddModal}
                        onRefresh={handleRefresh}
                        isRefreshing={isRefreshing}
                    />

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                        <UserTable
                            users={filteredUsers}
                            onView={openViewModal}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                            isLoading={isRefreshing}
                        />
                    </div>
                </div>
            </div>

            {/* User Modals - Always mounted for smooth transitions */}
            <Modal show={showAddModal} onClose={closeModals} maxWidth="md">
                <UserForm
                    mode="add"
                    data={data}
                    errors={formErrors}
                    processing={processing}
                    onSubmit={submitAdd}
                    onChange={(field, value) => setData(field as any, value)}
                    onCancel={closeModals}
                />
            </Modal>

            <Modal show={showEditModal} onClose={closeModals} maxWidth="md">
                <UserForm
                    mode="edit"
                    data={data}
                    errors={formErrors}
                    processing={processing}
                    onSubmit={submitEdit}
                    onChange={(field, value) => setData(field as any, value)}
                    onCancel={closeModals}
                />
            </Modal>

            <UserViewModal show={showViewModal} user={selectedUser} onClose={closeModals} />

            <UserDeleteModal
                show={showDeleteModal}
                user={selectedUser}
                processing={processing}
                onConfirm={submitDelete}
                onCancel={closeModals}
            />
        </AuthenticatedLayout>
    );
}

