import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number;
    periodData: {
        current: { current: number; previous: number };
        day: { current: number; previous: number };
        week: { current: number; previous: number };
        month: { current: number; previous: number };
        year: { current: number; previous: number };
    };
    icon: LucideIcon;
    color: string;
    defaultPeriod?: string;
}

export default function StatCard({
    title,
    value,
    periodData,
    icon: Icon,
    color,
}: StatCardProps) {
    // Calculate trend based on week comparison
    const weekData = periodData.week;
    let trendDirection: "up" | "down" | "neutral" = "neutral";
    let trendPercentage = 0;

    if (weekData.previous > 0) {
        const diff = weekData.current - weekData.previous;
        trendPercentage = Math.abs((diff / weekData.previous) * 100);
        trendDirection = diff > 0 ? "up" : diff < 0 ? "down" : "neutral";
    } else if (weekData.current > 0) {
        trendDirection = "up";
        trendPercentage = 100;
    }

    // Color mappings for different stat types
    const colorConfig = {
        "bg-teal-500": {
            bg: "bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20",
            iconBg: "bg-teal-500",
            text: "text-teal-600 dark:text-teal-400",
            border: "border-teal-200/50 dark:border-teal-800/30",
        },
        "bg-amber-500": {
            bg: "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20",
            iconBg: "bg-amber-500",
            text: "text-amber-600 dark:text-amber-400",
            border: "border-amber-200/50 dark:border-amber-800/30",
        },
        "bg-purple-500": {
            bg: "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20",
            iconBg: "bg-purple-500",
            text: "text-purple-600 dark:text-purple-400",
            border: "border-purple-200/50 dark:border-purple-800/30",
        },
        "bg-emerald-500": {
            bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20",
            iconBg: "bg-emerald-500",
            text: "text-emerald-600 dark:text-emerald-400",
            border: "border-emerald-200/50 dark:border-emerald-800/30",
        },
    };

    const config = colorConfig[color as keyof typeof colorConfig] || colorConfig["bg-teal-500"];

    return (
        <div className={`relative overflow-hidden rounded-2xl border ${config.border} ${config.bg} p-6 shadow-sm transition-all duration-300 hover:shadow-md`}>
            {/* Background decorative element */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20 blur-2xl dark:bg-white/5" />

            <div className="relative">
                {/* Header with icon */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {title}
                        </p>
                        <h3 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {value.toLocaleString()}
                        </h3>
                    </div>
                    <div className={`rounded-xl ${config.iconBg} p-3 shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>

                {/* Trend indicator line */}
                <div className="mt-4 flex items-center gap-2">
                    <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${trendDirection === "up"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : trendDirection === "down"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}>
                        {trendDirection === "up" ? (
                            <TrendingUp className="h-3.5 w-3.5" />
                        ) : trendDirection === "down" ? (
                            <TrendingDown className="h-3.5 w-3.5" />
                        ) : (
                            <Minus className="h-3.5 w-3.5" />
                        )}
                        <span>
                            {trendDirection === "up" ? "+" : trendDirection === "down" ? "-" : ""}
                            {trendPercentage.toFixed(0)}%
                        </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                        vs last week
                    </span>
                </div>

                {/* Decorative accent line */}
                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-200/50 dark:bg-gray-700/30">
                    <div
                        className={`h-full rounded-full ${config.iconBg} transition-all duration-500`}
                        style={{ width: `${Math.min(100, Math.max(10, (value / (value + 10)) * 100))}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
