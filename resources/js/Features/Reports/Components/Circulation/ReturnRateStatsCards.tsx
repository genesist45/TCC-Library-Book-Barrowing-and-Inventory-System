import { CheckCircle, Clock, AlertTriangle, BarChart3 } from 'lucide-react';
import type { ReturnRateStats } from '../../types/circulationReports.d';

interface ReturnRateStatsCardsProps {
    stats: ReturnRateStats;
}

/**
 * Cards component for displaying return rate statistics
 */
export function ReturnRateStatsCards({ stats }: ReturnRateStatsCardsProps) {
    return (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-violet-500" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Return Rate Statistics
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Analysis of on-time vs late returns
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* On-Time Returns */}
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                                {stats.onTimeReturns.count}
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-500">
                                ({stats.onTimeReturns.percentage}%)
                            </p>
                        </div>
                    </div>
                    <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        On-Time Returns
                    </p>
                </div>

                {/* Late Returns */}
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                                {stats.lateReturns.count}
                            </p>
                            <p className="text-xs text-orange-600 dark:text-orange-500">
                                ({stats.lateReturns.percentage}%)
                            </p>
                        </div>
                    </div>
                    <p className="mt-2 text-sm font-medium text-orange-700 dark:text-orange-400">
                        Late Returns
                    </p>
                </div>

                {/* Overall Return Rate */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                {stats.overallReturnRate.percentage}%
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-500">
                                {stats.overallReturnRate.returned} of {stats.overallReturnRate.total}
                            </p>
                        </div>
                    </div>
                    <p className="mt-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                        Overall Return Rate
                    </p>
                </div>
            </div>

            {/* Progress bar visualization */}
            {stats.overallReturnRate.total > 0 && (
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Return Progress</span>
                        <span>{stats.stillBorrowed} still borrowed</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full flex">
                            <div
                                className="bg-emerald-500 transition-all duration-500"
                                style={{ width: `${(stats.onTimeReturns.count / stats.overallReturnRate.total) * 100}%` }}
                            />
                            <div
                                className="bg-orange-500 transition-all duration-500"
                                style={{ width: `${(stats.lateReturns.count / stats.overallReturnRate.total) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-gray-600 dark:text-gray-400">On-time</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-orange-500" />
                            <span className="text-gray-600 dark:text-gray-400">Late</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                            <span className="text-gray-600 dark:text-gray-400">Still borrowed</span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
