import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from 'recharts';
import { FolderOpen } from 'lucide-react';
import type { PopularCategory } from '../../types/circulationReports.d';
import { CIRCULATION_CHART_COLORS } from '../../types/circulationReports.d';
import { ChartContainer } from '../Shared/ChartContainer';

interface PopularCategoriesChartProps {
    data: PopularCategory[];
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
                    {data.count} borrows ({data.percentage}%)
                </p>
            </div>
        );
    }
    return null;
};

/**
 * Horizontal bar chart component for Popular Categories by Borrowing
 */
export function PopularCategoriesChart({ data }: PopularCategoriesChartProps) {
    return (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="mb-4 flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-violet-500" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Popular Categories
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Most borrowed book categories
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
                                        fill={CIRCULATION_CHART_COLORS[index % CIRCULATION_CHART_COLORS.length]}
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
                                                backgroundColor: CIRCULATION_CHART_COLORS[index % CIRCULATION_CHART_COLORS.length],
                                            }}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                                            {category.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {category.count} ({category.percentage}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex h-64 items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No borrowing data available
                    </p>
                </div>
            )}
        </div>
    );
}
