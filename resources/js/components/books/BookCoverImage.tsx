import { BookOpen } from "lucide-react";

interface BookCoverImageProps {
    coverImage?: string | null;
    title: string;
}

export default function BookCoverImage({ coverImage, title }: BookCoverImageProps) {
    if (coverImage) {
        return (
            <img
                src={`/storage/${coverImage}`}
                alt={title}
                className="h-auto max-h-96 w-full rounded-lg border border-gray-200 object-cover shadow-md lg:w-64"
            />
        );
    }

    return (
        <div className="flex h-80 w-56 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <BookOpen className="h-16 w-16 text-gray-400" />
        </div>
    );
}
