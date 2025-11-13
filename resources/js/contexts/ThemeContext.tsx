import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    themeMode: ThemeMode;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
    const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('themeMode') as ThemeMode;
            return savedMode || 'system';
        }
        return 'system';
    });

    const getSystemTheme = (): Theme => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    };

    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('themeMode') as ThemeMode;
            if (savedMode === 'system' || !savedMode) {
                return getSystemTheme();
            }
            return savedMode as Theme;
        }
        return 'light';
    });

    useEffect(() => {
        const applyTheme = () => {
            let activeTheme: Theme;
            
            if (themeMode === 'system') {
                activeTheme = getSystemTheme();
            } else {
                activeTheme = themeMode as Theme;
            }
            
            setThemeState(activeTheme);
            
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(activeTheme);
        };

        applyTheme();
        localStorage.setItem('themeMode', themeMode);

        if (themeMode === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme();
            
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [themeMode]);

    const toggleTheme = () => {
        setThemeModeState(prev => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'system';
            return 'light';
        });
    };

    const setTheme = (newTheme: Theme) => {
        setThemeModeState(newTheme);
    };

    const setThemeMode = (mode: ThemeMode) => {
        setThemeModeState(mode);
    };

    return (
        <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setTheme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

