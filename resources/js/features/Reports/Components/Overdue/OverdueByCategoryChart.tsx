import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from 'recharts';
import { FolderOpen, CheckCircle } from 'lucide-react';
import type { OverdueByCategory } from '../../types/overdueReports';
import { OVERDUE_CHART_COLORS } from '../../types/overdueReports';
import { ChartContainer } from '../Shared/ChartContainer';

interface OverdueByCategoryChartProps {
    data: OverdueByCategory[];
}

/**
 * Custom tooltip component for the categories chart
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
                    {data.count} overdue ({data.percentage}%)
                </p>
            </div>
        );
    }
    return null;
};

/**
 * Horizontal bar chart component for Overdue Books by Category
 */
export function OverdueByCategoryChart({ data }: OverdueByCategoryChartProps) {
    return (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="mb-4 flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-amber-500" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Overdue Books by Category
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Distribution of overdue books across categories
                    </p>
                </div>
            </div>

            {data && data.length > 0 ? (
                <>
                    <ChartContainer height={288}>
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
                                allowDecimals={false}
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
                                radius={[0, 4, 4, 0]}
                                barSize={24}
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={OVERDUE_CHART_COLORS[index % OVERDUE_CHART_COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>

                    {/* Category breakdown list */}
                    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {data.map((category, index) => (
                                <div
                                    key={category.name}
                                    className="flex items-center justify-between rounded-lg border border-gray-100 p-2 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-3 w-3 rounded-full flex-shrink-0"
                                            style={{
                                                backgroundColor: OVERDUE_CHART_COLORS[index % OVERDUE_CHART_COLORS.length],
                                            }}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                                            {category.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                        {category.count} ({category.percentage}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex h-64 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="text-center">
                        <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                        <p className="mt-2 text-sm font-medium text-green-700 dark:text-green-400">
                            No overdue books to analyze
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
