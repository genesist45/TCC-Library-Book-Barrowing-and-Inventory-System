import { Eye, Pencil, Trash2 } from 'lucide-react';
import defaultUserImage from '@/assets/images/avatars/default-user.png';
import { TableRowSkeleton } from '@/components/common/Loading';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    role: 'admin' | 'staff';
    profile_picture?: string;
    created_at: string;
}

interface UserTableProps {
    users: User[];
    onView: (user: User) => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    isLoading?: boolean;
}

export default function UserTable({ users, onView, onEdit, onDelete, isLoading = false }: UserTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                    <tr>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:table-cell sm:px-4">
                            ID
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                            Name
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 md:table-cell sm:px-4">
                            Email
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                            Role
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 lg:table-cell sm:px-4">
                            Created At
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white transition-colors duration-300 dark:divide-[#3a3a3a] dark:bg-[#2a2a2a]">
                    {isLoading ? (
                        Array.from({ length: users.length || 5 }).map((_, index) => (
                            <TableRowSkeleton key={index} />
                        ))
                    ) : (
                        users.map((user, index) => (
                            <tr key={user.id} className="transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-[#3a3a3a]">
                                <td className="hidden whitespace-nowrap px-3 py-2 text-sm text-gray-900 transition-colors duration-300 dark:text-gray-100 sm:table-cell sm:px-4">
                                    {index + 1}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 sm:px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full sm:h-8 sm:w-8">
                                            {user.profile_picture ? (
                                                <img
                                                    src={`/storage/${user.profile_picture}`}
                                                    alt={user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={defaultUserImage}
                                                    alt={user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                                {user.first_name} {user.last_name}
                                            </div>
                                            <div className="text-xs text-gray-500 transition-colors duration-300 dark:text-gray-400 md:hidden">
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 md:table-cell sm:px-4">
                                    {user.email}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-sm sm:px-4">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium sm:px-2.5 ${
                                        user.role === 'admin' 
                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                    }`}>
                                        {user.role === 'admin' ? 'Ad' : 'St'}
                                        <span className="hidden sm:inline">
                                            {user.role === 'admin' ? 'min' : 'aff'}
                                        </span>
                                    </span>
                                </td>
                                <td className="hidden whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 lg:table-cell sm:px-4">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-center text-sm sm:px-4">
                                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                                        <button
                                            onClick={() => onView(user)}
                                            className="rounded p-1 text-blue-600 transition-colors duration-300 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                            title="View"
                                        >
                                            <Eye size={16} className="sm:h-4 sm:w-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="rounded p-1 text-green-600 transition-colors duration-300 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                                            title="Edit"
                                        >
                                            <Pencil size={16} className="sm:h-4 sm:w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(user)}
                                            className="rounded p-1 text-red-600 transition-colors duration-300 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} className="sm:h-4 sm:w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {!isLoading && users.length === 0 && (
                <div className="py-12 text-center text-gray-500 transition-colors duration-300 dark:text-gray-400">
                    No users found. Click "Add User" to create one.
                </div>
            )}
        </div>
    );
}

