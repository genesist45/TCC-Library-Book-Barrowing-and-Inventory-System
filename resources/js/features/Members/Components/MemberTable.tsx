import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Member } from '@/types';
import { router } from '@inertiajs/react';

const shimmerClass = "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] dark:from-[#3a3a3a] dark:via-[#4a4a4a] dark:to-[#3a3a3a]";

function MemberTableRowSkeleton() {
    return (
        <tr className="border-b border-gray-200 transition-colors duration-300 dark:border-[#3a3a3a]">
            <td className="whitespace-nowrap px-3 py-2 sm:px-4">
                <div className={`${shimmerClass} h-4 w-12 rounded`} />
            </td>
            <td className="whitespace-nowrap px-3 py-2 sm:px-4">
                <div className="space-y-1.5">
                    <div className={`${shimmerClass} h-4 w-32 rounded`} />
                    <div className={`${shimmerClass} h-3 w-24 rounded`} />
                </div>
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2 sm:table-cell sm:px-4">
                <div className="space-y-1.5">
                    <div className={`${shimmerClass} h-4 w-40 rounded`} />
                    <div className={`${shimmerClass} h-3 w-28 rounded`} />
                </div>
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2 md:table-cell md:px-4">
                <div className={`${shimmerClass} h-5 w-16 rounded-full`} />
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2 lg:table-cell lg:px-4">
                <div className={`${shimmerClass} h-5 w-16 rounded-full`} />
            </td>
            <td className="whitespace-nowrap px-3 py-2 text-center sm:px-4">
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <div className={`${shimmerClass} h-6 w-6 rounded`} />
                    <div className={`${shimmerClass} h-6 w-6 rounded`} />
                    <div className={`${shimmerClass} h-6 w-6 rounded`} />
                </div>
            </td>
        </tr>
    );
}

interface MemberTableProps {
    members: Member[];
    onDelete: (member: Member) => void;
    isLoading?: boolean;
}

export default function MemberTable({ members, onDelete, isLoading = false }: MemberTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50 transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#3a3a3a]">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                            ID
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                            Member Info
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:table-cell sm:px-4">
                            Contact
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 md:table-cell md:px-4">
                            Type
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 lg:table-cell lg:px-4">
                            Status
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-300 dark:text-gray-300 sm:px-4">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white transition-colors duration-300 dark:divide-[#3a3a3a] dark:bg-[#2a2a2a]">
                    {isLoading ? (
                        Array.from({ length: members.length > 0 ? members.length : 5 }).map((_, index) => (
                            <MemberTableRowSkeleton key={index} />
                        ))
                    ) : (
                        members.map((member) => (
                            <tr key={member.id} className="transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-[#3a3a3a]">
                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 sm:px-4">
                                    {member.id}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 sm:px-4">
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                            {member.name}
                                        </div>
                                        <div className="text-xs text-gray-500 transition-colors duration-300 dark:text-gray-400">
                                            {member.member_no}
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden whitespace-nowrap px-3 py-2 sm:table-cell sm:px-4">
                                    <div className="text-sm">
                                        {member.email && (
                                            <div className="text-gray-900 transition-colors duration-300 dark:text-gray-100">
                                                {member.email}
                                            </div>
                                        )}
                                        {member.phone && (
                                            <div className="text-xs text-gray-500 transition-colors duration-300 dark:text-gray-400">
                                                {member.phone}
                                            </div>
                                        )}
                                        {!member.email && !member.phone && (
                                            <div className="text-xs text-gray-400 dark:text-gray-500">
                                                No contact info
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="hidden whitespace-nowrap px-3 py-2 md:table-cell md:px-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${member.type === 'Privileged'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                        }`}>
                                        {member.type}
                                    </span>
                                </td>
                                <td className="hidden whitespace-nowrap px-3 py-2 lg:table-cell lg:px-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${member.status === 'Active'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                        : member.status === 'Suspended'
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                        }`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-center text-sm sm:px-4">
                                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                                        <button
                                            onClick={() => router.visit(route('admin.members.show', member.id))}
                                            className="flex items-center justify-center rounded-lg bg-blue-100 p-1.5 text-blue-600 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                            title="View"
                                        >
                                            <Eye size={16} className="sm:h-4 sm:w-4" />
                                        </button>
                                        <button
                                            onClick={() => router.visit(route('admin.members.edit', member.id))}
                                            className="flex items-center justify-center rounded-lg bg-amber-100 p-1.5 text-amber-600 transition hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                                            title="Edit"
                                        >
                                            <Pencil size={16} className="sm:h-4 sm:w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(member)}
                                            className="flex items-center justify-center rounded-lg bg-red-100 p-1.5 text-red-600 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
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
            {!isLoading && members.length === 0 && (
                <div className="py-12 text-center text-gray-500 transition-colors duration-300 dark:text-gray-400">
                    No members found. Click "Add Member" to create one.
                </div>
            )}
        </div>
    );
}
