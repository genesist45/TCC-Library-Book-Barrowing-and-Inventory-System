import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import type { ChartDataItem } from '../types/catalogReports.d';
import { CHART_COLORS } from '../types/catalogReports.d';

interface CategoryPieChartProps {
    data: ChartDataItem[];
}

/**
 * Custom tooltip component for pie chart
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
 * Custom label renderer for pie chart slices
 */
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for very small slices

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-xs font-medium"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

/**
 * Pie chart component for Books by Category
 */
export function CategoryPieChart({ data }: CategoryPieChartProps) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Books by Category
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Distribution of books across different categories
                </p>
            </div>

            {data && data.length > 0 ? (
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{ paddingTop: '20px' }}
                                formatter={(value) => (
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex h-64 items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No data available
                    </p>
                </div>
            )}

            {/* Category breakdown list */}
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
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
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
