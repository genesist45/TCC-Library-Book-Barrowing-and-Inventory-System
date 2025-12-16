import Modal from "@/components/modals/Modal";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import InputError from "@/components/forms/InputError";
import { useState, useEffect } from "react";
import { X, Search, User } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface Member {
    id: number;
    member_no: string;
    name: string;
    type?: string;
    borrower_category?: string;
    status?: string;
}

interface CopyItem {
    id: number;
    accession_no: string;
    copy_no: number;
    branch?: string;
    location?: string;
    status: string;
    reserved_by_member_id?: number | null;
    reserved_by_member?: {
        id: number;
        name: string;
        member_no: string;
        type?: string;
    } | null;
}

interface EditCopyModalProps {
    show: boolean;
    copy: CopyItem | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditCopyModal({
    show,
    copy,
    onClose,
    onSuccess,
}: EditCopyModalProps) {
    const [accessionNo, setAccessionNo] = useState("");
    const [branch, setBranch] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Available");
    const [reservedByMemberId, setReservedByMemberId] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Member search state
    const [memberSearch, setMemberSearch] = useState("");
    const [memberSearchResults, setMemberSearchResults] = useState<Member[]>([]);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);

    useEffect(() => {
        if (show && copy) {
            setAccessionNo(copy.accession_no || "");
            setBranch(copy.branch || "");
            setLocation(copy.location || "");
            setStatus(copy.status || "Available");
            setReservedByMemberId(copy.reserved_by_member_id || null);
            if (copy.reserved_by_member) {
                setSelectedMember({
                    id: copy.reserved_by_member.id,
                    member_no: copy.reserved_by_member.member_no,
                    name: copy.reserved_by_member.name,
                    type: copy.reserved_by_member.type || '',
                    borrower_category: '',
                    status: '',
                });
                setMemberSearch(copy.reserved_by_member.name);
            } else {
                setSelectedMember(null);
                setMemberSearch("");
            }
            setErrors({});
        }
    }, [show, copy]);

    // Search members when typing
    useEffect(() => {
        const searchMembers = async () => {
            if (memberSearch.length < 2) {
                setMemberSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const response = await axios.get(route("admin.members.search"), {
                    params: { query: memberSearch }
                });
                setMemberSearchResults(response.data);
                setShowMemberDropdown(true);
            } catch (error) {
                console.error("Failed to search members:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounce = setTimeout(searchMembers, 300);
        return () => clearTimeout(debounce);
    }, [memberSearch]);

    const validateAccessionNo = async (value: string) => {
        if (value.length !== 7) return;
        if (value === copy?.accession_no) {
            const { accession_no, ...rest } = errors;
            setErrors(rest);
            return;
        }

        try {
            const response = await axios.post(
                route("admin.copies.validate-accession-no"),
                { accession_no: value },
            );

            if (!response.data.valid) {
                setErrors({ ...errors, accession_no: response.data.message });
            } else {
                const { accession_no, ...rest } = errors;
                setErrors(rest);
            }
        } catch (error) {
            console.error("Failed to validate accession number:", error);
        }
    };

    const handleAccessionNoChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 7);
        setAccessionNo(value);

        if (value.length === 7) {
            validateAccessionNo(value);
        }
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        // Clear member selection if status is not Reserved
        if (newStatus !== "Reserved") {
            setSelectedMember(null);
            setReservedByMemberId(null);
            setMemberSearch("");
        }
    };

    const handleSelectMember = (member: Member) => {
        setSelectedMember(member);
        setReservedByMemberId(member.id);
        setMemberSearch(member.name);
        setShowMemberDropdown(false);
    };

    const handleClearMember = () => {
        setSelectedMember(null);
        setReservedByMemberId(null);
        setMemberSearch("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!copy) return;

        // Validate member selection for Reserved status
        if (status === "Reserved" && !reservedByMemberId) {
            setErrors({ ...errors, reserved_by_member_id: "Please select a member for the reservation" });
            return;
        }

        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.put(
                route("admin.copies.update", copy.id),
                {
                    accession_no: accessionNo,
                    branch: branch || null,
                    location: location || null,
                    status,
                    reserved_by_member_id: status === "Reserved" ? reservedByMemberId : null,
                },
            );

            if (response.data.success) {
                toast.success("Copy updated successfully");
                onSuccess();
                handleClose();
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error("Failed to update copy");
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        setAccessionNo("");
        setBranch("");
        setLocation("");
        setStatus("Available");
        setReservedByMemberId(null);
        setSelectedMember(null);
        setMemberSearch("");
        setMemberSearchResults([]);
        setShowMemberDropdown(false);
        setErrors({});
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="sm">
            <div className="p-4">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
                            Edit Copy #{copy?.copy_no}
                        </h2>
                        <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                            Update copy details
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <InputLabel
                            htmlFor="edit_accession_no"
                            value="Accession No."
                            className="text-xs"
                        />
                        <TextInput
                            id="edit_accession_no"
                            type="text"
                            className="mt-1 block w-full text-sm"
                            value={accessionNo}
                            onChange={handleAccessionNoChange}
                            placeholder="0000000"
                            maxLength={7}
                            required
                        />
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            Must be 7 digits and unique.
                        </p>
                        <InputError
                            message={errors.accession_no}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="edit_branch"
                            value="Branch"
                            className="text-xs"
                        />
                        <select
                            id="edit_branch"
                            className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                        >
                            <option value="">Select branch</option>
                            <option value="Main">Main</option>
                            <option value="Trial">Trial</option>
                        </select>
                        <InputError
                            message={errors.branch}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="edit_location"
                            value="Location (Optional)"
                            className="text-xs"
                        />
                        <select
                            id="edit_location"
                            className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="">Select location</option>
                            <option value="Filipianna">Filipianna</option>
                            <option value="Circulation">Circulation</option>
                            <option value="Theses">Theses</option>
                            <option value="Fiction">Fiction</option>
                            <option value="Reserve">Reserve</option>
                        </select>
                        <InputError
                            message={errors.location}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="edit_status"
                            value="Status"
                            className="text-xs"
                        />
                        <select
                            id="edit_status"
                            className={`mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 ${copy?.status === 'Paid'
                                ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                                : ''
                                }`}
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            required
                            disabled={copy?.status === 'Paid'}
                        >
                            <option value="Available">Available</option>
                            <option value="Borrowed">Borrowed</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Lost">Lost</option>
                            <option value="Under Repair">Under Repair</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                        </select>
                        {copy?.status === 'Paid' && (
                            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                Status cannot be changed for copies with payment-related status.
                            </p>
                        )}
                        <InputError message={errors.status} className="mt-1" />
                    </div>

                    {/* Member Selection - Only show when Reserved is selected */}
                    {status === "Reserved" && (
                        <div>
                            <InputLabel
                                htmlFor="edit_member"
                                value="Select Member"
                                className="text-xs"
                            />
                            <div className="relative mt-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="edit_member"
                                        type="text"
                                        className="block w-full rounded-md border-gray-300 py-1.5 pl-9 pr-10 text-sm shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                        placeholder="Search by name or member no..."
                                        value={memberSearch}
                                        onChange={(e) => {
                                            setMemberSearch(e.target.value);
                                            if (selectedMember) {
                                                setSelectedMember(null);
                                                setReservedByMemberId(null);
                                            }
                                        }}
                                        onFocus={() => memberSearchResults.length > 0 && setShowMemberDropdown(true)}
                                    />
                                    {selectedMember && (
                                        <button
                                            type="button"
                                            onClick={handleClearMember}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Dropdown Results */}
                                {showMemberDropdown && memberSearchResults.length > 0 && (
                                    <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                        {memberSearchResults.map((member) => (
                                            <button
                                                key={member.id}
                                                type="button"
                                                onClick={() => handleSelectMember(member)}
                                                className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                                                    <User size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {member.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {member.member_no} • {member.borrower_category}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {isSearching && (
                                    <p className="mt-1 text-xs text-gray-500">Searching...</p>
                                )}
                            </div>

                            {/* Selected Member Display */}
                            {selectedMember && (
                                <div className="mt-2 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 dark:border-green-800 dark:bg-green-900/20">
                                    <User size={16} className="text-green-600 dark:text-green-400" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                            {selectedMember.name}
                                        </p>
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                            {selectedMember.member_no}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <InputError
                                message={errors.reserved_by_member_id}
                                className="mt-1"
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <SecondaryButton
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="text-sm"
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="text-sm"
                        >
                            {processing ? "Saving..." : "Save"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
