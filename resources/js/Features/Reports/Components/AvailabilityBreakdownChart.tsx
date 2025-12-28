import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import type { AvailabilityItem } from '../types/catalogReports.d';

interface AvailabilityBreakdownChartProps {
    data: AvailabilityItem[];
}

/**
 * Custom tooltip component for availability chart
 */
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <p className="font-medium text-gray-900 dark:text-white">
                    {data.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {data.count} {data.count === 1 ? 'book' : 'books'} ({data.percentage}%)
                </p>
            </div>
        );
    }
    return null;
};

/**
 * Horizontal bar chart component for Availability Status Breakdown
 */
export function AvailabilityBreakdownChart({ data }: AvailabilityBreakdownChartProps) {
    return (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Availability Status Breakdown
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Distribution of books by availability status
                </p>
            </div>

            {data && data.length > 0 ? (
                <>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={true}
                                    vertical={false}
                                    stroke="#E5E7EB"
                                />
                                <XAxis
                                    type="number"
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    axisLine={{ stroke: '#E5E7EB' }}
                                    domain={[0, 'dataMax']}
                                />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={180}
                                    tick={{ fill: '#6B7280', fontSize: 11 }}
                                    axisLine={{ stroke: '#E5E7EB' }}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="count"
                                    radius={[0, 4, 4, 0]}
                                    barSize={24}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Availability breakdown list */}
                    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {data.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                                >
                                    <div
                                        className="h-3 w-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {item.name.split(' (')[0]}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {item.count} ({item.percentage}%)
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex h-64 items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No data available
                    </p>
                </div>
            )}
        </div>
    );
}
