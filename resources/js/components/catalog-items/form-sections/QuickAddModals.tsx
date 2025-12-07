import Modal from "@/components/modals/Modal";
import InputLabel from "@/components/forms/InputLabel";
import TextInput from "@/components/forms/TextInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";

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
}: QuickAddModalsProps) {
    return (
        <>
            <Modal show={showCategoryModal} onClose={onCloseCategoryModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Quick Add Category
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Add a new category quickly without leaving this page
                    </p>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            await onCategoryAdded(formData.get('name') as string);
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
                            <SecondaryButton type="button" onClick={onCloseCategoryModal}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton type="submit">
                                Add Category
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal show={showPublisherModal} onClose={onClosePublisherModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Quick Add Publisher
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Add a new publisher quickly without leaving this page
                    </p>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            await onPublisherAdded(
                                formData.get('name') as string,
                                formData.get('country') as string
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
                            <SecondaryButton type="button" onClick={onClosePublisherModal}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton type="submit">
                                Add Publisher
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal show={showAuthorModal} onClose={onCloseAuthorModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Quick Add Author
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Add a new author quickly without leaving this page
                    </p>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            await onAuthorAdded(
                                formData.get('name') as string,
                                formData.get('country') as string
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
                            <SecondaryButton type="button" onClick={onCloseAuthorModal}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton type="submit">
                                Add Author
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
