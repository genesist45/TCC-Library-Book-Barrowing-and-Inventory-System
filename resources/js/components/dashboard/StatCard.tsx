import { LucideIcon, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const TIME_PERIODS = [
    { value: 'current', label: 'Today' },
    { value: 'day', label: 'vs yesterday' },
    { value: 'week', label: 'vs last week' },
    { value: 'month', label: 'vs last month' },
    { value: 'year', label: 'vs last year' },
];

interface GraphDataPoint {
    label: string;
    date: string;
    value: number;
}

interface PeriodData {
    current: number;
    previous: number;
    graphData: GraphDataPoint[];
}

interface StatCardProps {
    title: string;
    value: number;
    periodData: {
        current: PeriodData;
        day: PeriodData;
        week: PeriodData;
        month: PeriodData;
        year: PeriodData;
    };
    icon: LucideIcon;
    color: string;
    defaultPeriod?: string; // Defaults to 'current'
}

interface HoveredPoint {
    index: number;
    x: number;
    y: number;
    dataPoint: GraphDataPoint;
}

export default function StatCard({
    title,
    value,
    periodData,
    icon: Icon,
    color,
    defaultPeriod = 'current',
}: StatCardProps) {
    const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get current period data
    const currentPeriodData = periodData[selectedPeriod as keyof typeof periodData] || periodData.current;
    const currentPeriodInfo = TIME_PERIODS.find(p => p.value === selectedPeriod) || TIME_PERIODS[0];
    const graphData = currentPeriodData.graphData || [];

    // Calculate percentage change between current and previous periods
    let percentage = "0";
    let isPositive = true;
    let trendLabel = "0%";

    if (currentPeriodData.previous > 0) {
        const diff = currentPeriodData.current - currentPeriodData.previous;
        const pct = (diff / currentPeriodData.previous) * 100;
        percentage = pct.toFixed(1);
        isPositive = diff >= 0;
        trendLabel = `${isPositive ? "+" : ""}${percentage}%`;
    } else if (currentPeriodData.current > 0) {
        percentage = "100";
        isPositive = true;
        trendLabel = "+100%";
    } else {
        percentage = "0";
        isPositive = true;
        trendLabel = "0%";
    }

    // Generate smooth SVG path using Catmull-Rom spline interpolation
    const generatePath = () => {
        if (graphData.length === 0) return { path: "", areaPath: "", points: [] };

        const width = 100;
        const height = 40;

        const values = graphData.map(d => d.value);
        const maxValue = Math.max(...values, 1);
        const minValue = Math.min(...values, 0);
        const range = maxValue - minValue || 1;

        const points = graphData.map((d, i) => {
            // Full width - no padding, spans 0 to 100
            const x = (i / (graphData.length - 1 || 1)) * width;
            const normalizedValue = (d.value - minValue) / range;
            // Position graph in lower portion of viewbox for aesthetic look
            const y = height - 2 - (normalizedValue * (height - 4) * 0.7);
            return { x, y };
        });

        if (points.length < 2) {
            return {
                path: `M ${points[0]?.x || 0} ${points[0]?.y || height - 5}`,
                areaPath: "",
                points
            };
        }

        // Generate smooth curve using Catmull-Rom to Bezier conversion
        const smoothPath = (pts: { x: number; y: number }[]) => {
            if (pts.length < 2) return "";

            let path = `M ${pts[0].x} ${pts[0].y}`;

            for (let i = 0; i < pts.length - 1; i++) {
                const p0 = pts[Math.max(0, i - 1)];
                const p1 = pts[i];
                const p2 = pts[i + 1];
                const p3 = pts[Math.min(pts.length - 1, i + 2)];

                // Catmull-Rom to Cubic Bezier conversion
                const tension = 0.3;
                const cp1x = p1.x + (p2.x - p0.x) * tension;
                const cp1y = p1.y + (p2.y - p0.y) * tension;
                const cp2x = p2.x - (p3.x - p1.x) * tension;
                const cp2y = p2.y - (p3.y - p1.y) * tension;

                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
            }

            return path;
        };

        const linePath = smoothPath(points);
        const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

        return { path: linePath, areaPath, points };
    };

    const { path, areaPath, points } = generatePath();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period);
        setIsDropdownOpen(false);
        setHoveredPoint(null);
    };

    const colorClass = color.replace("bg-", "text-");

    return (
        <div className="relative overflow-visible rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            {/* Interactive Graph - From center to right edge */}
            <div className="pointer-events-auto absolute bottom-0 left-1/2 right-0 h-16">
                <svg
                    viewBox="0 0 100 40"
                    className="h-full w-full"
                    preserveAspectRatio="none"
                    onMouseLeave={() => setHoveredPoint(null)}
                >
                    {/* Gradient definitions */}
                    <defs>
                        <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop
                                offset="0%"
                                stopColor={
                                    color === 'bg-teal-500' ? '#14b8a6' :
                                        color === 'bg-amber-500' ? '#f59e0b' :
                                            color === 'bg-purple-500' ? '#a855f7' :
                                                color === 'bg-emerald-500' ? '#10b981' :
                                                    '#14b8a6'
                                }
                                stopOpacity="0.4"
                            />
                            <stop
                                offset="100%"
                                stopColor={
                                    color === 'bg-teal-500' ? '#14b8a6' :
                                        color === 'bg-amber-500' ? '#f59e0b' :
                                            color === 'bg-purple-500' ? '#a855f7' :
                                                color === 'bg-emerald-500' ? '#10b981' :
                                                    '#14b8a6'
                                }
                                stopOpacity="0"
                            />
                        </linearGradient>
                    </defs>

                    {/* Area fill with gradient effect */}
                    {areaPath && (
                        <path
                            d={areaPath}
                            fill={`url(#gradient-${title.replace(/\s+/g, '-')})`}
                        />
                    )}

                    {/* Smooth curved line */}
                    {path && (
                        <path
                            d={path}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={colorClass}
                        />
                    )}

                    {/* Invisible hit zones for hover detection */}
                    {points.map((point, idx) => (
                        <circle
                            key={`hitzone-${idx}`}
                            cx={point.x}
                            cy={point.y}
                            r={6}
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredPoint({
                                index: idx,
                                x: point.x,
                                y: point.y,
                                dataPoint: graphData[idx],
                            })}
                        />
                    ))}

                    {/* Visible dot - only shows on hover */}
                    {hoveredPoint && (
                        <circle
                            cx={hoveredPoint.x}
                            cy={hoveredPoint.y}
                            r={4}
                            fill="currentColor"
                            className={colorClass}
                            stroke="white"
                            strokeWidth="2"
                        />
                    )}
                </svg>

                {/* Tooltip */}
                {hoveredPoint && (
                    <div
                        className="pointer-events-none absolute z-[200] -translate-x-1/2 -translate-y-full"
                        style={{
                            left: `${(hoveredPoint.x / 100) * 100}%`,
                            top: `${(hoveredPoint.y / 40) * 100 - 20}%`,
                        }}
                    >
                        <div className="whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-gray-800">
                            <div className="font-semibold">{hoveredPoint.dataPoint.date}</div>
                            <div className="mt-0.5 flex items-center gap-1.5">
                                <span className={`inline-block h-2 w-2 rounded-full ${color}`}></span>
                                <span>{hoveredPoint.dataPoint.value} {title.replace('Total ', '').toLowerCase()}</span>
                            </div>
                            <div className="absolute left-1/2 -bottom-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900 dark:bg-gray-800"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Card content - positioned above the graph */}
            <div className="relative z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {title}
                        </p>
                        <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                            {value.toLocaleString()}
                        </h3>

                        {/* Period dropdown trigger */}
                        <div className="relative mt-2" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#333333] ${isPositive
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                    }`}
                            >
                                <span className="font-medium">{trendLabel}</span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    {currentPeriodInfo.label}
                                </span>
                                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute left-0 z-[100] mt-1 w-40 origin-top-left rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                                    {TIME_PERIODS.map((period) => (
                                        <button
                                            key={period.value}
                                            type="button"
                                            onClick={() => handlePeriodChange(period.value)}
                                            className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-[#333333] ${period.value === selectedPeriod
                                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                : 'text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {period.label}
                                            {period.value === selectedPeriod && (
                                                <Check className="h-4 w-4" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        className={`rounded-lg p-2 ${color} bg-opacity-10 dark:bg-opacity-20`}
                    >
                        <Icon
                            className={`h-6 w-6 ${colorClass}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
