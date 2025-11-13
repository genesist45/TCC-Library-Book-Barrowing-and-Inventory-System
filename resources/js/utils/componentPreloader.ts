/**
 * Component Preloader
 * Preload components on hover or before navigation for better UX
 */

type PreloadFunction = () => Promise<any>;

const preloadCache = new Set<PreloadFunction>();

/**
 * Preload a component on hover
 * Usage: <button onMouseEnter={() => preloadOnHover(importFunc)}>
 */
export function preloadOnHover(importFunc: PreloadFunction): void {
    if (!preloadCache.has(importFunc)) {
        importFunc().catch(() => {
            // Silently fail preloading
        });
        preloadCache.add(importFunc);
    }
}

/**
 * Preload multiple components at once
 */
export function preloadComponents(...importFuncs: PreloadFunction[]): void {
    importFuncs.forEach((importFunc) => {
        if (!preloadCache.has(importFunc)) {
            importFunc().catch(() => {
                // Silently fail preloading
            });
            preloadCache.add(importFunc);
        }
    });
}

/**
 * Clear preload cache
 */
export function clearPreloadCache(): void {
    preloadCache.clear();
}

