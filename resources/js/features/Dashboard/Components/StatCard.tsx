import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";

interface StatCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    color: string;
    defaultPeriod?: string;
    viewAllHref?: string;
}

export const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    viewAllHref,
}: StatCardProps) => {
    // Color configurations for modern look
    const colorConfig = {
        "bg-teal-500": {
            bg: "bg-white dark:bg-[#2a2a2a]",
            iconBg: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20",
            icon: "text-emerald-500",
            text: "text-emerald-600 dark:text-emerald-400",
            border: "border-gray-200 dark:border-[#3a3a3a]",
            accent: "bg-emerald-500",
            glow: "shadow-emerald-500/10"
        },
        "bg-amber-500": {
            bg: "bg-white dark:bg-[#2a2a2a]",
            iconBg: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20",
            icon: "text-amber-500",
            text: "text-amber-600 dark:text-amber-400",
            border: "border-gray-200 dark:border-[#3a3a3a]",
            accent: "bg-amber-500",
            glow: "shadow-amber-500/10"
        },
        "bg-purple-500": {
            bg: "bg-white dark:bg-[#2a2a2a]",
            iconBg: "bg-violet-500/10 text-violet-500 dark:bg-violet-500/20",
            icon: "text-violet-500",
            text: "text-violet-600 dark:text-violet-400",
            border: "border-gray-200 dark:border-[#3a3a3a]",
            accent: "bg-violet-500",
            glow: "shadow-violet-500/10"
        },
        "bg-emerald-500": {
            bg: "bg-white dark:bg-[#2a2a2a]",
            iconBg: "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20",
            icon: "text-indigo-500",
            text: "text-indigo-600 dark:text-indigo-400",
            border: "border-gray-200 dark:border-[#3a3a3a]",
            accent: "bg-indigo-500",
            glow: "shadow-indigo-500/10"
        },
    };

    const config = colorConfig[color as keyof typeof colorConfig] || colorConfig["bg-teal-500"];

    return (
        <div className={`group relative overflow-hidden rounded-2xl border ${config.border} ${config.bg} p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${config.glow}`}>
            {/* Background Accent Gradient */}
            <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-20 ${config.accent}`} />

            <div className="relative flex flex-col h-full space-y-3">
                {/* Top Section: Icon and Title */}
                <div className="flex items-center gap-3.5">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg} transition-transform duration-500 group-hover:scale-105`}>
                        <Icon size={20} className={config.icon} />
                    </div>
                    <span className="text-[15px] font-bold tracking-tight text-gray-700 dark:text-gray-200">
                        {title}
                    </span>
                </div>

                {/* Middle Section: Value */}
                <div className="flex-1 pt-1.5">
                    <h3 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                        {value.toLocaleString()}
                    </h3>
                </div>

                {/* Bottom Section: Navigation */}
                {viewAllHref && (
                    <div className="flex items-center justify-end pt-1">
                        <Link
                            href={viewAllHref}
                            className={`group/link flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest ${config.text} transition-all`}
                        >
                            <span>View All</span>
                            <ArrowRight
                                size={12}
                                className="transition-transform duration-300 group-hover/link:translate-x-1"
                            />
                        </Link>
                    </div>
                )}
            </div>

            {/* Bottom Glow Line */}
            <div className={`absolute bottom-0 left-0 h-[2.5px] w-0 transition-all duration-500 group-hover:w-full ${config.accent}`} />
        </div>
    );
};
