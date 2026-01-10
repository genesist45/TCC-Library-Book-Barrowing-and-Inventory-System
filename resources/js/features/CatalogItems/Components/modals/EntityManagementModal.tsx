import Modal from "@/components/modals/Modal";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import { useState, useEffect } from "react";
import { Copy, Layers, Plus, Trash2, Edit, X, Search, Users, Tag, Building } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

type TabType = "single" | "multiple";
type EntityType = "authors" | "categories" | "publishers";

interface Tab {
    id: TabType;
    label: string;
    icon: typeof Copy;
}

const TABS: Tab[] = [
    { id: "single", label: "Single", icon: Copy },
    { id: "multiple", label: "Multiple", icon: Layers },
];

interface EntityItem {
    id: number;
    name: string;
    country?: string;
    description?: string;
    bio?: string;
    slug?: string;
    is_published: boolean;
    catalog_items_count?: number;
}

interface EntityManagementModalProps {
    show: boolean;
    entityType: EntityType;
    entities: EntityItem[];
    onClose: () => void;
    onSuccess: () => void;
}

const entityConfig = {
    authors: {
        title: "Manage Authors",
        icon: Users,
        singularName: "Author",
        pluralName: "Authors",
        fields: ["name", "country", "bio"] as const,
        storeRoute: "/admin/authors",
        bulkRoute: "/admin/authors/bulk",
    },
    categories: {
        title: "Manage Categories",
        icon: Tag,
        singularName: "Category",
        pluralName: "Categories",
        fields: ["name", "description"] as const,
        storeRoute: "/admin/categories",
        bulkRoute: "/admin/categories/bulk",
    },
    publishers: {
        title: "Manage Publishers",
        icon: Building,
        singularName: "Publisher",
        pluralName: "Publishers",
        fields: ["name", "country", "description"] as const,
        storeRoute: "/admin/publishers",
        bulkRoute: "/admin/publishers/bulk",
    },
};

export default function EntityManagementModal({
    show,
    entityType,
    entities,
    onClose,
    onSuccess,
}: EntityManagementModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>("single");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        country: "",
        description: "",
        bio: "",
        count: 1,
        is_published: true,
    });

    const config = entityConfig[entityType];
    const Icon = config.icon;

    // Filter entities based on search
    const filteredEntities = entities.filter((entity) =>
        entity.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const resetForm = () => {
        setFormData({
            name: "",
            country: "",
            description: "",
            bio: "",
            count: 1,
            is_published: true,
        });
        setActiveTab("single");
    };

    const handleClose = () => {
        resetForm();
        setShowAddForm(false);
        setSearchQuery("");
        onClose();
    };

    const handleSingleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error(`${config.singularName} name is required.`);
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: Record<string, any> = {
                name: formData.name,
                is_published: formData.is_published,
            };

            if (config.fields.includes("country" as any)) {
                payload.country = formData.country || "Unknown";
            }
            if (config.fields.includes("description" as any)) {
                payload.description = formData.description;
            }
            if (config.fields.includes("bio" as any)) {
                payload.bio = formData.bio;
            }

            await axios.post(config.storeRoute, payload);
            toast.success(`${config.singularName} created successfully!`);
            resetForm();
            setShowAddForm(false);
            onSuccess();
        } catch (error: any) {
            const message = error.response?.data?.message || `Failed to create ${config.singularName.toLowerCase()}.`;
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMultipleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error(`Base ${config.singularName.toLowerCase()} name is required.`);
            return;
        }
        if (formData.count < 1 || formData.count > 50) {
            toast.error("Count must be between 1 and 50.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: Record<string, any> = {
                name: formData.name,
                count: formData.count,
                is_published: formData.is_published,
            };

            if (config.fields.includes("country" as any)) {
                payload.country = formData.country || "Unknown";
            }
            if (config.fields.includes("description" as any)) {
                payload.description = formData.description;
            }
            if (config.fields.includes("bio" as any)) {
                payload.bio = formData.bio;
            }

            await axios.post(config.bulkRoute, payload);
            toast.success(`${formData.count} ${formData.count > 1 ? config.pluralName.toLowerCase() : config.singularName.toLowerCase()} created successfully!`);
            resetForm();
            setShowAddForm(false);
            onSuccess();
        } catch (error: any) {
            const message = error.response?.data?.message || `Failed to create ${config.pluralName.toLowerCase()}.`;
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(`Are you sure you want to delete this ${config.singularName.toLowerCase()}?`)) {
            return;
        }

        try {
            await axios.delete(`${config.storeRoute}/${id}`);
            toast.success(`${config.singularName} deleted successfully!`);
            onSuccess();
        } catch (error: any) {
            const message = error.response?.data?.message || `Failed to delete ${config.singularName.toLowerCase()}.`;
            toast.error(message);
        }
    };

    const renderAddForm = () => (
        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
            {/* Tabs */}
            <div className="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
                {TABS.map((tab) => {
                    const TabIcon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id
                                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                }`}
                        >
                            <TabIcon className="h-4 w-4" />
                            {tab.label} {config.singularName}
                        </button>
                    );
                })}
            </div>

            <form onSubmit={activeTab === "single" ? handleSingleSubmit : handleMultipleSubmit}>
                {/* Multiple count input */}
                {activeTab === "multiple" && (
                    <div className="mb-4">
                        <InputLabel htmlFor="count" value={`Number of ${config.pluralName}`} />
                        <TextInput
                            id="count"
                            type="number"
                            min={1}
                            max={50}
                            value={formData.count}
                            onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 1 })}
                            className="mt-1 block w-full"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Enter the number of {config.pluralName.toLowerCase()} to create (1-50).
                        </p>
                    </div>
                )}

                {/* Name field */}
                <div className="mb-4">
                    <InputLabel htmlFor="name" value={`${config.singularName} Name`} required />
                    <TextInput
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full"
                        placeholder={`Enter ${config.singularName.toLowerCase()} name`}
                    />
                    {activeTab === "multiple" && formData.count > 1 && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {config.pluralName} will be named: {formData.name || "Name"} 1, {formData.name || "Name"} 2, etc.
                        </p>
                    )}
                </div>

                {/* Country field (for authors and publishers) */}
                {config.fields.includes("country" as any) && (
                    <div className="mb-4">
                        <InputLabel htmlFor="country" value="Country" />
                        <TextInput
                            id="country"
                            type="text"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="mt-1 block w-full"
                            placeholder="Enter country"
                        />
                    </div>
                )}

                {/* Description field (for categories and publishers) */}
                {config.fields.includes("description" as any) && (
                    <div className="mb-4">
                        <InputLabel htmlFor="description" value="Description" />
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                            rows={3}
                            placeholder="Enter description (optional)"
                        />
                    </div>
                )}

                {/* Bio field (for authors) */}
                {config.fields.includes("bio" as any) && (
                    <div className="mb-4">
                        <InputLabel htmlFor="bio" value="Biography" />
                        <textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                            rows={3}
                            placeholder="Enter biography (optional)"
                        />
                    </div>
                )}

                {/* Note for multiple */}
                {activeTab === "multiple" && (
                    <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Note:</strong> This will create {formData.count} {formData.count > 1 ? config.pluralName.toLowerCase() : config.singularName.toLowerCase()}{" "}
                            with the same settings.
                        </p>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end gap-3">
                    <SecondaryButton type="button" onClick={() => setShowAddForm(false)}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={isSubmitting}>
                        {isSubmitting
                            ? "Creating..."
                            : activeTab === "single"
                                ? `Create ${config.singularName}`
                                : `Create ${formData.count} ${formData.count > 1 ? config.pluralName : config.singularName}`}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );

    return (
        <Modal show={show} onClose={handleClose} maxWidth="2xl">
            <div className="p-6">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                            <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {config.title}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {entities.length} {entities.length === 1 ? config.singularName.toLowerCase() : config.pluralName.toLowerCase()} in total
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Search and Add buttons */}
                {!showAddForm && (
                    <div className="mb-4 flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Search ${config.pluralName.toLowerCase()}...`}
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                            />
                        </div>
                        <PrimaryButton onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add {config.singularName}
                        </PrimaryButton>
                    </div>
                )}

                {/* Add Form */}
                {showAddForm && renderAddForm()}

                {/* Entity List Table */}
                {!showAddForm && (
                    <div className="max-h-80 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Name
                                    </th>
                                    {config.fields.includes("country" as any) && (
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Country
                                        </th>
                                    )}
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Items
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {filteredEntities.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={config.fields.includes("country" as any) ? 5 : 4}
                                            className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            {searchQuery
                                                ? `No ${config.pluralName.toLowerCase()} found matching "${searchQuery}"`
                                                : `No ${config.pluralName.toLowerCase()} yet. Click "Add ${config.singularName}" to create one.`}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEntities.map((entity) => (
                                        <tr key={entity.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {entity.name}
                                            </td>
                                            {config.fields.includes("country" as any) && (
                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                    {entity.country || "-"}
                                                </td>
                                            )}
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                {entity.catalog_items_count || 0}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${entity.is_published
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                                                        }`}
                                                >
                                                    {entity.is_published ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(entity.id)}
                                                    className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                                                    title={`Delete ${config.singularName.toLowerCase()}`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer */}
                {!showAddForm && (
                    <div className="mt-4 flex justify-end">
                        <SecondaryButton onClick={handleClose}>Close</SecondaryButton>
                    </div>
                )}
            </div>
        </Modal>
    );
}
