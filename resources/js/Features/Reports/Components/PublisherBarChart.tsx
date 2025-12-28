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
import type { ChartDataItem } from '../types/catalogReports.d';
import { CHART_COLORS } from '../types/catalogReports.d';

interface PublisherBarChartProps {
    data: ChartDataItem[];
}

/**
 * Custom tooltip component for bar chart
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
 * Horizontal bar chart component for Books by Publisher
 */
export function PublisherBarChart({ data }: PublisherBarChartProps) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Books by Publisher
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Distribution of books across different publishers
                </p>
            </div>

            {data && data.length > 0 ? (
                <div className="h-80">
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
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={120}
                                tick={{ fill: '#6B7280', fontSize: 11 }}
                                axisLine={{ stroke: '#E5E7EB' }}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="count"
                                fill="#3B82F6"
                                radius={[0, 4, 4, 0]}
                                barSize={20}
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex h-64 items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No data available
                    </p>
                </div>
            )}

            {/* Publisher breakdown list */}
            {data && data.length > 0 && (
                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div className="space-y-2">
                        {data.map((item, index) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-3 w-3 rounded-full"
                                        style={{
                                            backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                                        }}
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                                        {item.name}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.count} ({item.percentage}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
