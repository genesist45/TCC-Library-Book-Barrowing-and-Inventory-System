import { Author } from '@/types';

interface AuthorBadgesProps {
    authors: Author[];
}

export default function AuthorBadges({ authors }: AuthorBadgesProps) {
    if (!authors || authors.length === 0) return null;

    return (
        <div className="sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Authors
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
                {authors.map((author) => (
                    <span
                        key={author.id}
                        className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-400/30"
                    >
                        {author.name}
                    </span>
                ))}
            </div>
        </div>
    );
}
