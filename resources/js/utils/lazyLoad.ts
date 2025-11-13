import { lazy, ComponentType } from 'react';

/**
 * Utility function to lazy load components with automatic retry on failure
 * Helps handle chunk load errors that can occur after deployments
 */
export function lazyLoad<T extends ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    retries = 3,
    interval = 1000
): React.LazyExoticComponent<T> {
    return lazy(() => {
        return new Promise<{ default: T }>((resolve, reject) => {
            let retriesLeft = retries;
            
            const attemptLoad = () => {
                importFunc()
                    .then(resolve)
                    .catch((error) => {
                        retriesLeft--;
                        
                        if (retriesLeft === 0) {
                            reject(error);
                            return;
                        }
                        
                        console.warn(
                            `Failed to load component. Retrying... (${retries - retriesLeft}/${retries})`
                        );
                        
                        setTimeout(attemptLoad, interval);
                    });
            };
            
            attemptLoad();
        });
    });
}

/**
 * Preload a lazy component
 * Useful for preloading on hover or before navigation
 */
export function preloadComponent(
    importFunc: () => Promise<any>
): void {
    importFunc();
}

