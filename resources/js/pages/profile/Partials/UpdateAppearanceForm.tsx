import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function UpdateAppearanceForm({ className = '' }: { className?: string }) {
    const { themeMode, setThemeMode } = useTheme();

    const themes = [
        { id: 'light', label: 'Light', icon: Sun },
        { id: 'dark', label: 'Dark', icon: Moon },
        { id: 'system', label: 'System', icon: Monitor },
    ] as const;

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Appearance settings
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your account's appearance settings
                </p>
            </header>

            <div className="mt-6">
                <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                    {themes.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setThemeMode(id)}
                            className={`inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-widest transition-all sm:gap-2 sm:px-4 ${
                                themeMode === id
                                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800'
                            }`}
                        >
                            <Icon size={16} className="flex-shrink-0" />
                            <span className="truncate">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

