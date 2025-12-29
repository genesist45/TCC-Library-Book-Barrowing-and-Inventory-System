import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from 'recharts';
import type { ChartDataItem } from '../../types/catalogReports';
import { CHART_COLORS } from '../../types/catalogReports';
import { ChartContainer } from '../Shared/ChartContainer';

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
 * Custom legend component for pie chart
 */
const CustomLegend = ({ payload }: any) => {
    if (!payload) return null;

    return (
        <div className="flex flex-wrap justify-center gap-3 mt-4">
            {payload.slice(0, 8).map((entry: any, index: number) => (
                <div key={`legend-${index}`} className="flex items-center gap-1.5">
                    <div
                        className="h-3 w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[80px]">
                        {entry.value}
                    </span>
                </div>
            ))}
            {payload.length > 8 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{payload.length - 8} more
                </span>
            )}
        </div>
    );
};

/**
 * Pie chart component for Books by Category
 */
export function CategoryPieChart({ data }: CategoryPieChartProps) {
    // Calculate total for center display
    const total = data.reduce((sum, item) => sum + item.count, 0);

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
                <ChartContainer height={320}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="count"
                            nameKey="name"
                            label={({ payload }: any) => `${payload?.percentage || 0}%`}
                            labelLine={false}
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                        {/* Center text */}
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-gray-900 dark:fill-white"
                        >
                            <tspan
                                x="50%"
                                dy="-0.5em"
                                className="text-2xl font-bold"
                                style={{ fill: 'currentColor' }}
                            >
                                {total}
                            </tspan>
                            <tspan
                                x="50%"
                                dy="1.5em"
                                className="text-xs"
                                style={{ fill: '#6B7280' }}
                            >
                                Total
                            </tspan>
                        </text>
                    </PieChart>
                </ChartContainer>
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
