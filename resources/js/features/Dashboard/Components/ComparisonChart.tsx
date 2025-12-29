import { TrendingUp, MoreVertical, Download, Printer, Calendar } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import type { ChartDataPoint } from "../types/dashboard";

type TimePeriod = "day" | "week" | "month" | "year";

interface ComparisonChartProps {
    data: ChartDataPoint[];
}

export const ComparisonChart = ({ data: initialData }: ComparisonChartProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week");
    const [chartData, setChartData] = useState<ChartDataPoint[]>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLDivElement>(null);

    // Wait for container to have proper dimensions before rendering chart
    useEffect(() => {
        const container = chartRef.current;
        if (!container) return;

        const checkDimensions = () => {
            const { width, height } = container.getBoundingClientRect();
            if (width > 0 && height > 0) {
                setIsReady(true);
            }
        };

        // Check after a delay to allow layout to settle
        const timer = setTimeout(checkDimensions, 200);

        // Also use ResizeObserver as backup
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentRect.width > 0) {
                    setIsReady(true);
                }
            }
        });
        observer.observe(container);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, []);

    // Colors matching the stat cards
    const COLORS = {
        titles: "#14b8a6", // teal-500
        members: "#f59e0b", // amber-500
        checkouts: "#a855f7", // purple-500
    };

    const PERIOD_LABELS: Record<TimePeriod, string> = {
        day: "Last Day",
        week: "Last Week",
        month: "Last Month",
        year: "Last Year",
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch data when period changes
    const handlePeriodChange = async (period: TimePeriod) => {
        setSelectedPeriod(period);
        setIsMenuOpen(false);
        setIsLoading(true);

        try {
            const response = await axios.get(route("admin.dashboard.chart-data"), {
                params: { period },
            });
            setChartData(response.data);
        } catch (error) {
            console.error("Failed to fetch chart data:", error);
            // Keep current data on error
        } finally {
            setIsLoading(false);
        }
    };

    // Print chart
    const handlePrint = () => {
        setIsMenuOpen(false);
        const printContent = chartRef.current;
        if (!printContent) return;

        const originalContents = document.body.innerHTML;
        const printStyles = `
            <style>
                body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
                .print-header { text-align: center; margin-bottom: 20px; }
                .print-header h1 { font-size: 24px; color: #1f2937; margin-bottom: 8px; }
                .print-header p { font-size: 14px; color: #6b7280; }
                .print-legend { display: flex; justify-content: center; gap: 24px; margin: 16px 0; }
                .print-legend-item { display: flex; align-items: center; gap: 8px; }
                .print-legend-dot { width: 12px; height: 12px; border-radius: 50%; }
            </style>
        `;

        const legendHTML = `
            <div class="print-legend">
                <div class="print-legend-item">
                    <span class="print-legend-dot" style="background-color: ${COLORS.titles}"></span>
                    <span>Titles</span>
                </div>
                <div class="print-legend-item">
                    <span class="print-legend-dot" style="background-color: ${COLORS.members}"></span>
                    <span>Members</span>
                </div>
                <div class="print-legend-item">
                    <span class="print-legend-dot" style="background-color: ${COLORS.checkouts}"></span>
                    <span>Checkouts</span>
                </div>
            </div>
        `;

        document.body.innerHTML = `
            ${printStyles}
            <div class="print-header">
                <h1>Library Statistics Overview</h1>
                <p>${PERIOD_LABELS[selectedPeriod]} - Printed on ${new Date().toLocaleDateString()}</p>
            </div>
            ${legendHTML}
            ${printContent.innerHTML}
        `;

        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    // Download chart as image
    const handleDownload = async () => {
        setIsMenuOpen(false);

        // Use html2canvas approach with SVG
        const chartElement = chartRef.current?.querySelector('.recharts-wrapper');
        if (!chartElement) return;

        try {
            // Convert SVG to canvas
            const svgElement = chartElement.querySelector('svg');
            if (!svgElement) return;

            const svgData = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            // Set canvas size
            canvas.width = svgElement.clientWidth * 2;
            canvas.height = svgElement.clientHeight * 2;

            img.onload = () => {
                if (ctx) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Download
                    const link = document.createElement('a');
                    link.download = `library-statistics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }
            };

            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        } catch (error) {
            console.error("Failed to download chart:", error);
            // Fallback: download as CSV
            downloadAsCSV();
        }
    };

    // Fallback: Download data as CSV
    const downloadAsCSV = () => {
        const headers = ['Period', 'Titles', 'Members', 'Checkouts'];
        const rows = chartData.map(d => [d.label, d.titles, d.members, d.checkouts]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `library-statistics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <p className="mb-2 border-b border-gray-100 pb-2 text-sm font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                        {label}
                    </p>
                    <div className="space-y-1.5">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {entry.name}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                    {entry.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Library Statistics Overview
                    </h3>
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {PERIOD_LABELS[selectedPeriod]}
                    </span>
                </div>

                {/* 3-dot Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                        title="Options"
                    >
                        <MoreVertical size={20} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                            {/* Time Period Filters */}
                            <div className="border-b border-gray-200 px-3 py-2 dark:border-gray-700">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Time Period
                                </p>
                            </div>
                            {(["day", "week", "month", "year"] as TimePeriod[]).map((period) => (
                                <button
                                    key={period}
                                    onClick={() => handlePeriodChange(period)}
                                    className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${selectedPeriod === period
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <Calendar size={16} />
                                    {PERIOD_LABELS[period]}
                                    {selectedPeriod === period && (
                                        <span className="ml-auto text-indigo-600 dark:text-indigo-400">✓</span>
                                    )}
                                </button>
                            ))}

                            {/* Divider */}
                            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

                            {/* Actions */}
                            <button
                                onClick={handlePrint}
                                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <Printer size={16} />
                                Print
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <Download size={16} />
                                Download
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                    <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS.titles }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Titles
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS.members }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Members
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS.checkouts }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Checkouts
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div ref={chartRef} className={`w-full min-h-[350px] h-[350px] ${isLoading ? 'opacity-50' : ''}`}>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                    </div>
                )}
                {isReady && (
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 10,
                                bottom: 10,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorTitles" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor={COLORS.titles}
                                        stopOpacity={0.4}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={COLORS.titles}
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                                <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor={COLORS.members}
                                        stopOpacity={0.4}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={COLORS.members}
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                                <linearGradient id="colorCheckouts" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor={COLORS.checkouts}
                                        stopOpacity={0.4}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={COLORS.checkouts}
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                                className="dark:stroke-gray-700"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
                                dy={10}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
                                dx={-10}
                                tickFormatter={(value) => value.toLocaleString()}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="titles"
                                name="Titles"
                                stroke={COLORS.titles}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTitles)"
                                dot={{ fill: COLORS.titles, strokeWidth: 0, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="members"
                                name="Members"
                                stroke={COLORS.members}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorMembers)"
                                dot={{ fill: COLORS.members, strokeWidth: 0, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="checkouts"
                                name="Checkouts"
                                stroke={COLORS.checkouts}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorCheckouts)"
                                dot={{ fill: COLORS.checkouts, strokeWidth: 0, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
