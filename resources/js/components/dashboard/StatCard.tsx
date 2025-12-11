import { LucideIcon } from "lucide-react";

const GRAPH_PATHS = {
    increasing: "M0 35 C 20 35, 40 10, 60 25 S 80 5, 100 0",
    decreasing: "M0 5 C 20 5, 40 30, 60 15 S 80 35, 100 40",
    neutral: "M0 20 C 20 25, 40 15, 60 25 S 80 15, 100 20",
};

interface StatCardProps {
    title: string;
    value: number;
    previous: number;
    icon: LucideIcon;
    color: string;
}

export default function StatCard({
    title,
    value,
    previous,
    icon: Icon,
    color,
}: StatCardProps) {
    const diff = value - previous;
    let percentage = "0";
    let isPositive = true;
    let trendLabel = "0%";

    if (previous > 0) {
        const pct = (diff / previous) * 100;
        percentage = pct.toFixed(1);
        isPositive = diff >= 0;
        trendLabel = `${isPositive ? "+" : ""}${percentage}%`;
    } else if (value > 0) {
        percentage = "100";
        isPositive = true;
        trendLabel = "N/A";
    } else {
        percentage = "0";
        isPositive = true;
        trendLabel = "0%";
    }

    let pathData = GRAPH_PATHS.neutral;
    if (parseFloat(percentage) > 5) pathData = GRAPH_PATHS.increasing;
    if (parseFloat(percentage) < -5) pathData = GRAPH_PATHS.decreasing;

    return (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </h3>
                    <div
                        className={`mt-2 flex items-center text-sm ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                        <span className="font-medium">{trendLabel}</span>
                        <span className="ml-1 text-gray-500 dark:text-gray-400">
                            last month
                        </span>
                    </div>
                </div>
                <div
                    className={`rounded-lg p-2 ${color} bg-opacity-10 dark:bg-opacity-20`}
                >
                    <Icon
                        className={`h-6 w-6 ${color.replace("bg-", "text-")}`}
                    />
                </div>
            </div>

            <div className="absolute bottom-0 right-0 h-16 w-32 opacity-20">
                <svg
                    viewBox="0 0 100 40"
                    className="h-full w-full"
                    preserveAspectRatio="none"
                >
                    <path
                        d={pathData}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={color.replace("bg-", "text-")}
                    />
                    <path
                        d={`${pathData} V 40 H 0 Z`}
                        fill="currentColor"
                        className={color.replace("bg-", "text-")}
                        fillOpacity="0.2"
                    />
                </svg>
            </div>
        </div>
    );
}
