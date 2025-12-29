import { useState, useEffect, useRef, cloneElement, isValidElement } from 'react';

interface ChartContainerProps {
    children: React.ReactElement;
    height?: number;
    className?: string;
}

/**
 * A wrapper component for Recharts that provides explicit dimensions
 * to avoid the -1 width/height warning from ResponsiveContainer.
 * This component measures its container and passes width/height directly to the chart.
 */
export function ChartContainer({
    children,
    height = 288,
    className = ''
}: ChartContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                if (width > 0) {
                    setDimensions({ width, height });
                }
            }
        };

        // Initial measurement with a small delay
        const timer = setTimeout(updateDimensions, 10);

        // Update on resize
        const resizeObserver = new ResizeObserver(() => {
            updateDimensions();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            clearTimeout(timer);
            resizeObserver.disconnect();
        };
    }, [height]);

    // Clone the chart element with explicit width/height props
    const chartWithDimensions = dimensions && isValidElement(children)
        ? cloneElement(children, {
            width: dimensions.width,
            height: dimensions.height,
        } as any)
        : null;

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                width: '100%',
                height,
                minHeight: height,
            }}
        >
            {chartWithDimensions || (
                <div
                    className="flex items-center justify-center w-full h-full"
                    style={{ minHeight: height }}
                >
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-full h-full" />
                </div>
            )}
        </div>
    );
}
