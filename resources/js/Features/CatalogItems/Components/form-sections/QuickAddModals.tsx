import { useState, useMemo } from "react";
import Modal from "@/components/modals/Modal";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { Category, Publisher, Author } from "@/types";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface QuickAddModalsProps {
    showCategoryModal: boolean;
    showPublisherModal: boolean;
    showAuthorModal: boolean;
    onCloseCategoryModal: () => void;
    onClosePublisherModal: () => void;
    onCloseAuthorModal: () => void;
    onCategoryAdded: (name: string) => Promise<void>;
    onPublisherAdded: (name: string, country: string) => Promise<void>;
    onAuthorAdded: (name: string, country: string) => Promise<void>;
    // Mode prop: "simple" for Add page, "full" for Review page
    mode?: "simple" | "full";
    // Props for existing items (only used in "full" mode)
    categories?: Category[];
    publishers?: Publisher[];
    authors?: Author[];
    selectedCategoryId?: string;
    selectedPublisherId?: string;
    selectedAuthorIds?: number[];
    onSelectCategory?: (categoryId: string) => void;
    onSelectPublisher?: (publisherId: string) => void;
    onSelectAuthor?: (authorId: number) => void;
}

const ITEMS_PER_PAGE = 5;

// Pagination Component
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
}

function Pagination({ currentPage, totalPages, onPageChange, totalItems }: PaginationProps) {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    return (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Showing {startItem}-{endItem} of {totalItems}
            </p>
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={`min-w-[28px] h-7 px-2 text-xs rounded-md transition-colors ${currentPage === page
                                ? "bg-indigo-600 text-white"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
            </div>
        </div>
    );
}

export default function QuickAddModals({
    showCategoryModal,
    showPublisherModal,
    showAuthorModal,
    onCloseCategoryModal,
    onClosePublisherModal,
    onCloseAuthorModal,
    onCategoryAdded,
    onPublisherAdded,
    onAuthorAdded,
    mode = "simple",
    categories = [],
    publishers = [],
    authors = [],
    selectedCategoryId = "",
    selectedPublisherId = "",
    selectedAuthorIds = [],
    onSelectCategory,
    onSelectPublisher,
    onSelectAuthor,
}: QuickAddModalsProps) {
    const [categorySearch, setCategorySearch] = useState("");
    const [publisherSearch, setPublisherSearch] = useState("");
    const [authorSearch, setAuthorSearch] = useState("");

    // Pagination states
    const [categoryPage, setCategoryPage] = useState(1);
    const [publisherPage, setPublisherPage] = useState(1);
    const [authorPage, setAuthorPage] = useState(1);

    // Filter and paginate categories
    const filteredCategories = useMemo(() => {
        return categories.filter((cat) =>
            cat.name.toLowerCase().includes(categorySearch.toLowerCase())
        );
    }, [categories, categorySearch]);

    const categoryTotalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
    const paginatedCategories = useMemo(() => {
        const start = (categoryPage - 1) * ITEMS_PER_PAGE;
        return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredCategories, categoryPage]);

    // Filter and paginate publishers
    const filteredPublishers = useMemo(() => {
        return publishers.filter((pub) =>
            pub.name.toLowerCase().includes(publisherSearch.toLowerCase())
        );
    }, [publishers, publisherSearch]);

    const publisherTotalPages = Math.ceil(filteredPublishers.length / ITEMS_PER_PAGE);
    const paginatedPublishers = useMemo(() => {
        const start = (publisherPage - 1) * ITEMS_PER_PAGE;
        return filteredPublishers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredPublishers, publisherPage]);

    // Filter and paginate authors
    const filteredAuthors = useMemo(() => {
        return authors.filter((auth) =>
            auth.name.toLowerCase().includes(authorSearch.toLowerCase())
        );
    }, [authors, authorSearch]);

    const authorTotalPages = Math.ceil(filteredAuthors.length / ITEMS_PER_PAGE);
    const paginatedAuthors = useMemo(() => {
        const start = (authorPage - 1) * ITEMS_PER_PAGE;
        return filteredAuthors.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredAuthors, authorPage]);

    // Reset page when search changes
    const handleCategorySearch = (value: string) => {
        setCategorySearch(value);
        setCategoryPage(1);
    };

    const handlePublisherSearch = (value: string) => {
        setPublisherSearch(value);
        setPublisherPage(1);
    };

    const handleAuthorSearch = (value: string) => {
        setAuthorSearch(value);
        setAuthorPage(1);
    };

    const handleSelectCategory = (categoryId: string) => {
        if (onSelectCategory) {
            onSelectCategory(categoryId);
            onCloseCategoryModal();
        }
    };

    const handleSelectPublisher = (publisherId: string) => {
        if (onSelectPublisher) {
            onSelectPublisher(publisherId);
            onClosePublisherModal();
        }
    };

    const handleSelectAuthor = (authorId: number) => {
        if (onSelectAuthor) {
            onSelectAuthor(authorId);
            onCloseAuthorModal();
        }
    };

    // Reset pagination when modal closes
    const handleCloseCategoryModal = () => {
        setCategorySearch("");
        setCategoryPage(1);
        onCloseCategoryModal();
    };

    const handleClosePublisherModal = () => {
        setPublisherSearch("");
        setPublisherPage(1);
        onClosePublisherModal();
    };

    const handleCloseAuthorModal = () => {
        setAuthorSearch("");
        setAuthorPage(1);
        onCloseAuthorModal();
    };

    // Fixed height for 5 items (approximately 40px per item)
    const listHeight = "h-[200px]";

    // Simple mode - compact Quick Add only modals
    if (mode === "simple") {
        return (
            <>
                {/* Simple Category Modal */}
                <Modal show={showCategoryModal} onClose={handleCloseCategoryModal} maxWidth="sm">
                    <div className="p-5">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Quick Add Category
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Create a new category
                        </p>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                await onCategoryAdded(formData.get("name") as string);
                            }}
                            className="mt-4 space-y-4"
                        >
                            <div>
                                <InputLabel htmlFor="quick_category_name" value="Category Name" required />
                                <TextInput
                                    id="quick_category_name"
                                    name="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    placeholder="e.g., Science Fiction"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <SecondaryButton type="button" onClick={handleCloseCategoryModal}>
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton type="submit">Add</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Simple Publisher Modal */}
                <Modal show={showPublisherModal} onClose={handleClosePublisherModal} maxWidth="sm">
                    <div className="p-5">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Quick Add Publisher
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Create a new publisher
                        </p>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                await onPublisherAdded(
                                    formData.get("name") as string,
                                    formData.get("country") as string
                                );
                            }}
                            className="mt-4 space-y-3"
                        >
                            <div>
                                <InputLabel htmlFor="quick_publisher_name" value="Publisher Name" required />
                                <TextInput
                                    id="quick_publisher_name"
                                    name="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    placeholder="e.g., Penguin Books"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="quick_publisher_country" value="Country" required />
                                <TextInput
                                    id="quick_publisher_country"
                                    name="country"
                                    type="text"
                                    className="mt-1 block w-full"
                                    placeholder="e.g., United States"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <SecondaryButton type="button" onClick={handleClosePublisherModal}>
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton type="submit">Add</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Simple Author Modal */}
                <Modal show={showAuthorModal} onClose={handleCloseAuthorModal} maxWidth="sm">
                    <div className="p-5">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Quick Add Author
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Create a new author
                        </p>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                await onAuthorAdded(
                                    formData.get("name") as string,
                                    formData.get("country") as string
                                );
                            }}
                            className="mt-4 space-y-3"
                        >
                            <div>
                                <InputLabel htmlFor="quick_author_name" value="Author Name" required />
                                <TextInput
                                    id="quick_author_name"
                                    name="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    placeholder="e.g., J.K. Rowling"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="quick_author_country" value="Country" required />
                                <TextInput
                                    id="quick_author_country"
                                    name="country"
                                    type="text"
                                    className="mt-1 block w-full"
                                    placeholder="e.g., United Kingdom"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <SecondaryButton type="button" onClick={handleCloseAuthorModal}>
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton type="submit">Add</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>
            </>
        );
    }

    // Full mode - Two-column layout with existing items + Quick Add
    return (
        <>
            {/* Category Modal */}
            <Modal show={showCategoryModal} onClose={handleCloseCategoryModal} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Add or Select Category
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Side - Existing Categories */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                                Existing Category
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Select from existing categories
                            </p>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <TextInput
                                    type="text"
                                    className="w-full pl-10"
                                    placeholder="Search categories..."
                                    value={categorySearch}
                                    onChange={(e) => handleCategorySearch(e.target.value)}
                                />
                            </div>
                            <div className={`${listHeight} overflow-y-auto border border-gray-200 rounded-md dark:border-gray-700`}>
                                {paginatedCategories.length > 0 ? (
                                    paginatedCategories.map((category) => (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => handleSelectCategory(category.id.toString())}
                                            className={`w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${selectedCategoryId === category.id.toString()
                                                    ? "bg-indigo-100 dark:bg-indigo-900/50"
                                                    : ""
                                                }`}
                                        >
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {category.name}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                            No categories found
                                        </p>
                                    </div>
                                )}
                            </div>
                            <Pagination
                                currentPage={categoryPage}
                                totalPages={categoryTotalPages}
                                onPageChange={setCategoryPage}
                                totalItems={filteredCategories.length}
                            />
                        </div>

                        {/* Right Side - Quick Add */}
                        <div className="md:border-l md:border-gray-200 md:dark:border-gray-700 md:pl-6">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                                Quick Add Category
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Create a new category
                            </p>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    await onCategoryAdded(formData.get("name") as string);
                                }}
                                className="mt-4 space-y-4"
                            >
                                <div>
                                    <InputLabel htmlFor="quick_category_name" value="Category Name" required />
                                    <TextInput
                                        id="quick_category_name"
                                        name="name"
                                        type="text"
                                        className="mt-1 block w-full"
                                        placeholder="e.g., Science Fiction"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <SecondaryButton type="button" onClick={handleCloseCategoryModal}>
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton type="submit">Add Category</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Publisher Modal */}
            <Modal show={showPublisherModal} onClose={handleClosePublisherModal} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Add or Select Publisher
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Side - Existing Publishers */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                                Existing Publisher
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Select from existing publishers
                            </p>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <TextInput
                                    type="text"
                                    className="w-full pl-10"
                                    placeholder="Search publishers..."
                                    value={publisherSearch}
                                    onChange={(e) => handlePublisherSearch(e.target.value)}
                                />
                            </div>
                            <div className={`${listHeight} overflow-y-auto border border-gray-200 rounded-md dark:border-gray-700`}>
                                {paginatedPublishers.length > 0 ? (
                                    paginatedPublishers.map((publisher) => (
                                        <button
                                            key={publisher.id}
                                            type="button"
                                            onClick={() => handleSelectPublisher(publisher.id.toString())}
                                            className={`w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${selectedPublisherId === publisher.id.toString()
                                                    ? "bg-indigo-100 dark:bg-indigo-900/50"
                                                    : ""
                                                }`}
                                        >
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {publisher.name}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                            No publishers found
                                        </p>
                                    </div>
                                )}
                            </div>
                            <Pagination
                                currentPage={publisherPage}
                                totalPages={publisherTotalPages}
                                onPageChange={setPublisherPage}
                                totalItems={filteredPublishers.length}
                            />
                        </div>

                        {/* Right Side - Quick Add */}
                        <div className="md:border-l md:border-gray-200 md:dark:border-gray-700 md:pl-6">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                                Quick Add Publisher
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Create a new publisher
                            </p>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    await onPublisherAdded(
                                        formData.get("name") as string,
                                        formData.get("country") as string
                                    );
                                }}
                                className="mt-4 space-y-4"
                            >
                                <div>
                                    <InputLabel htmlFor="quick_publisher_name" value="Publisher Name" required />
                                    <TextInput
                                        id="quick_publisher_name"
                                        name="name"
                                        type="text"
                                        className="mt-1 block w-full"
                                        placeholder="e.g., Penguin Books"
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="quick_publisher_country" value="Country" required />
                                    <TextInput
                                        id="quick_publisher_country"
                                        name="country"
                                        type="text"
                                        className="mt-1 block w-full"
                                        placeholder="e.g., United States"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <SecondaryButton type="button" onClick={handleClosePublisherModal}>
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton type="submit">Add Publisher</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Author Modal */}
            <Modal show={showAuthorModal} onClose={handleCloseAuthorModal} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Add or Select Author
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Side - Existing Authors */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                                Existing Author
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Select from existing authors
                            </p>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <TextInput
                                    type="text"
                                    className="w-full pl-10"
                                    placeholder="Search authors..."
                                    value={authorSearch}
                                    onChange={(e) => handleAuthorSearch(e.target.value)}
                                />
                            </div>
                            <div className={`${listHeight} overflow-y-auto border border-gray-200 rounded-md dark:border-gray-700`}>
                                {paginatedAuthors.length > 0 ? (
                                    paginatedAuthors.map((author) => {
                                        const isSelected = selectedAuthorIds.includes(author.id);
                                        return (
                                            <button
                                                key={author.id}
                                                type="button"
                                                onClick={() => handleSelectAuthor(author.id)}
                                                className={`w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${isSelected ? "bg-indigo-100 dark:bg-indigo-900/50" : ""
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                        {author.name}
                                                    </span>
                                                    {isSelected && (
                                                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                                            Selected
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                            No authors found
                                        </p>
                                    </div>
                                )}
                            </div>
                            <Pagination
                                currentPage={authorPage}
                                totalPages={authorTotalPages}
                                onPageChange={setAuthorPage}
                                totalItems={filteredAuthors.length}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Click an author to add them to this catalog item
                            </p>
                        </div>

                        {/* Right Side - Quick Add */}
                        <div className="md:border-l md:border-gray-200 md:dark:border-gray-700 md:pl-6">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                                Quick Add Author
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Create a new author
                            </p>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    await onAuthorAdded(
                                        formData.get("name") as string,
                                        formData.get("country") as string
                                    );
                                }}
                                className="mt-4 space-y-4"
                            >
                                <div>
                                    <InputLabel htmlFor="quick_author_name" value="Author Name" required />
                                    <TextInput
                                        id="quick_author_name"
                                        name="name"
                                        type="text"
                                        className="mt-1 block w-full"
                                        placeholder="e.g., J.K. Rowling"
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="quick_author_country" value="Country" required />
                                    <TextInput
                                        id="quick_author_country"
                                        name="country"
                                        type="text"
                                        className="mt-1 block w-full"
                                        placeholder="e.g., United Kingdom"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <SecondaryButton type="button" onClick={handleCloseAuthorModal}>
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton type="submit">Add Author</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
