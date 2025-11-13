/**
 * Performance Monitoring Utility
 * Track and log component loading times in development
 */

const isDev = import.meta.env.DEV;
const isEnabled = isDev && localStorage.getItem('enablePerfMonitor') === 'true';

interface PerformanceMetric {
    name: string;
    duration: number;
    timestamp: number;
}

const metrics: PerformanceMetric[] = [];

/**
 * Mark the start of a performance measurement
 */
export function markStart(name: string): void {
    if (!isEnabled) return;
    performance.mark(`${name}-start`);
}

/**
 * Mark the end of a performance measurement and log the duration
 */
export function markEnd(name: string): void {
    if (!isEnabled) return;
    
    const startMark = `${name}-start`;
    const endMark = `${name}-end`;
    
    performance.mark(endMark);
    
    try {
        const measure = performance.measure(name, startMark, endMark);
        
        const metric: PerformanceMetric = {
            name,
            duration: measure.duration,
            timestamp: Date.now(),
        };
        
        metrics.push(metric);
        
        // Log in development
        if (isDev) {
            console.log(
                `%c⚡ ${name}`,
                'color: #10b981; font-weight: bold',
                `${measure.duration.toFixed(2)}ms`
            );
        }
        
        // Clean up marks
        performance.clearMarks(startMark);
        performance.clearMarks(endMark);
        performance.clearMeasures(name);
    } catch (error) {
        // Silently fail if measurement not found
    }
}

/**
 * Get all collected metrics
 */
export function getMetrics(): PerformanceMetric[] {
    return [...metrics];
}

/**
 * Clear all metrics
 */
export function clearMetrics(): void {
    metrics.length = 0;
}

/**
 * Get average duration for a specific metric
 */
export function getAverageDuration(name: string): number {
    const filtered = metrics.filter((m) => m.name === name);
    if (filtered.length === 0) return 0;
    
    const sum = filtered.reduce((acc, m) => acc + m.duration, 0);
    return sum / filtered.length;
}

/**
 * Log performance summary to console
 */
export function logSummary(): void {
    if (!isEnabled || metrics.length === 0) return;
    
    const summary = metrics.reduce((acc, metric) => {
        if (!acc[metric.name]) {
            acc[metric.name] = {
                count: 0,
                total: 0,
                min: Infinity,
                max: 0,
            };
        }
        
        acc[metric.name].count++;
        acc[metric.name].total += metric.duration;
        acc[metric.name].min = Math.min(acc[metric.name].min, metric.duration);
        acc[metric.name].max = Math.max(acc[metric.name].max, metric.duration);
        
        return acc;
    }, {} as Record<string, { count: number; total: number; min: number; max: number }>);
    
    console.group('%c📊 Performance Summary', 'color: #3b82f6; font-weight: bold; font-size: 14px');
    
    Object.entries(summary).forEach(([name, stats]) => {
        const avg = stats.total / stats.count;
        console.log(
            `%c${name}`,
            'color: #6366f1; font-weight: bold',
            `\n  Avg: ${avg.toFixed(2)}ms`,
            `\n  Min: ${stats.min.toFixed(2)}ms`,
            `\n  Max: ${stats.max.toFixed(2)}ms`,
            `\n  Count: ${stats.count}`
        );
    });
    
    console.groupEnd();
}

/**
 * Enable performance monitoring
 * Use in browser console: window.enablePerfMonitor()
 */
export function enableMonitoring(): void {
    localStorage.setItem('enablePerfMonitor', 'true');
    console.log('✅ Performance monitoring enabled. Reload the page to start tracking.');
}

/**
 * Disable performance monitoring
 */
export function disableMonitoring(): void {
    localStorage.removeItem('enablePerfMonitor');
    console.log('❌ Performance monitoring disabled.');
}

// Expose to window in development
if (isDev && typeof window !== 'undefined') {
    (window as any).enablePerfMonitor = enableMonitoring;
    (window as any).disablePerfMonitor = disableMonitoring;
    (window as any).getPerfMetrics = getMetrics;
    (window as any).clearPerfMetrics = clearMetrics;
    (window as any).logPerfSummary = logSummary;
}

// Log summary on page unload in development
if (isDev && typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        if (isEnabled && metrics.length > 0) {
            logSummary();
        }
    });
}

