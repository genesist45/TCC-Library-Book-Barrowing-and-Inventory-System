import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Area,
    AreaChart,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { BorrowingTrendItem } from '../../types/circulationReports';
import { ChartContainer } from '../Shared/ChartContainer';

interface BorrowingTrendsChartProps {
    data: BorrowingTrendItem[];
}

/**
 * Custom tooltip component for the trends chart
 */
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <p className="font-medium text-gray-900 dark:text-white">
                    {label}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {payload[0].value} {payload[0].value === 1 ? 'transaction' : 'transactions'}
                </p>
            </div>
        );
    }
    return null;
};

/**
 * Line/Area chart component for borrowing trends over time
 */
export function BorrowingTrendsChart({ data }: BorrowingTrendsChartProps) {
    // Calculate total for display
    const totalBorrows = data.reduce((sum, item) => sum + item.count, 0);
    const avgPerDay = data.length > 0 ? (totalBorrows / data.length).toFixed(1) : 0;

    return (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Borrowing Trends
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Circulation activity over time
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg/day</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{avgPerDay}</p>
                </div>
            </div>

            {data && data.length > 0 ? (
                <ChartContainer height={288}>
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#E5E7EB"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#6B7280', fontSize: 11 }}
                            axisLine={{ stroke: '#E5E7EB' }}
                            tickLine={false}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            axisLine={{ stroke: '#E5E7EB' }}
                            tickLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                        />
                    </AreaChart>
                </ChartContainer>
            ) : (
                <div className="flex h-64 items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No borrowing activity in the selected period
                    </p>
                </div>
            )}
        </div>
    );
}
