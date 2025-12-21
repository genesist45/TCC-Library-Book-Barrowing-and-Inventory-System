import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/Loading";
import { ThemeProvider } from "@/contexts/ThemeContext";

const appName = import.meta.env.VITE_APP_NAME || "TCC Library";

// Glob patterns for page resolution
const pagesGlob = import.meta.glob("./pages/**/*.tsx");
const featuresGlob = import.meta.glob("./features/**/Pages/*.tsx");

// Merge all page globs
const allPages = { ...pagesGlob, ...featuresGlob };

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Try Features path first (new Feature-Based Architecture)
        if (name.startsWith("features/")) {
            return resolvePageComponent(`./${name}.tsx`, allPages);
        }
        // Fall back to legacy pages path
        return resolvePageComponent(`./pages/${name}.tsx`, allPages);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <Suspense fallback={<PageSkeleton />}>
                    <App {...props} />
                </Suspense>
            </ThemeProvider>,
        );
    },
    progress: {
        color: "#0066f6ff",
        delay: 250,
        showSpinner: false,
    },
});
