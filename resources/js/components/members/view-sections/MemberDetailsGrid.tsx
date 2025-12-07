import { Member } from '@/types';
import DetailField from './DetailField';
import MemberTypeBadge from './MemberTypeBadge';
import StatusBadge from './StatusBadge';
import LoginAccessBadge from './LoginAccessBadge';

interface MemberDetailsGridProps {
    member: Member;
}

export default function MemberDetailsGrid({ member }: MemberDetailsGridProps) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <DetailField label="Member Number" value={member.member_no} />
            <DetailField label="Full Name" value={member.name} />

            <DetailField label="Member Type">
                <p className="mt-1.5">
                    <MemberTypeBadge type={member.type} />
                </p>
            </DetailField>

            <DetailField label="Status">
                <p className="mt-1.5">
                    <StatusBadge status={member.status} />
                </p>
            </DetailField>

            {member.email && (
                <DetailField label="Email" value={member.email} />
            )}

            {member.phone && (
                <DetailField label="Phone Number" value={member.phone} />
            )}

            {member.member_group && (
                <DetailField label="Member Group" value={member.member_group} />
            )}

            {member.booking_quota !== null && member.booking_quota !== undefined && (
                <DetailField label="Booking Quota" value={member.booking_quota} />
            )}

            {member.address && (
                <DetailField label="Address" value={member.address} className="sm:col-span-2" />
            )}

            <DetailField label="Login Access">
                <p className="mt-1.5">
                    <LoginAccessBadge allowLogin={member.allow_login} />
                </p>
            </DetailField>

            <DetailField label="Joined Date">
                <p className="mt-1.5 text-base text-gray-900 transition-colors duration-200 dark:text-gray-100">
                    {new Date(member.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </DetailField>
        </div>
    );
}
