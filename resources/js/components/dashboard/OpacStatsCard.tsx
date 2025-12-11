import { useState } from "react";
import { BarChart3 } from "lucide-react";

interface MonthlyData {
    month: string;
    titles: number;
    members: number;
}

interface HoveredPoint {
    type: "titles" | "members";
    index: number;
    x: number;
    y: number;
    value: number;
    month: string;
}

interface OpacStatsCardProps {
    titles: number;
    members: number;
    monthlyData: MonthlyData[];
}

function generatePathWithPoints(
    data: number[],
    height: number,
    width: number,
    sharedMax: number,
    sharedMin: number
): { path: string; points: { x: number; y: number }[] } {
    if (data.length === 0) return { path: "", points: [] };

    const range = sharedMax - sharedMin || 1;
    const padding = 8;
    const graphHeight = height - padding * 2;
    const graphWidth = width - padding * 2;

    const points = data.map((value, index) => {
        const x = padding + (index / (data.length - 1 || 1)) * graphWidth;
        const y =
            padding +
            graphHeight -
            ((value - sharedMin) / range) * graphHeight;
        return { x, y };
    });

    if (points.length < 2) {
        return {
            path: `M ${points[0]?.x || 0} ${points[0]?.y || height / 2}`,
            points,
        };
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const controlX = (current.x + next.x) / 2;
        path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }

    return { path, points };
}

export default function OpacStatsCard({
    titles,
    members,
    monthlyData,
}: OpacStatsCardProps) {
    const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);

    const titlesData = monthlyData.map((d) => d.titles);
    const membersData = monthlyData.map((d) => d.members);

    const allData = [...titlesData, ...membersData];
    const sharedMax = Math.max(...allData, 1);
    const sharedMin = Math.min(...allData, 0);

    const graphHeight = 50;
    const graphWidth = 120;

    const titlesResult = generatePathWithPoints(
        titlesData.length > 0 ? titlesData : [0, 0],
        graphHeight,
        graphWidth,
        sharedMax,
        sharedMin
    );

    const membersResult = generatePathWithPoints(
        membersData.length > 0 ? membersData : [0, 0],
        graphHeight,
        graphWidth,
        sharedMax,
        sharedMin
    );

    return (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    OPAC Stats
                </p>
                <div className="rounded-lg p-1.5 bg-blue-500 bg-opacity-10 dark:bg-opacity-20">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div className="flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-teal-600"></span>
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            Titles
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {titles.toLocaleString()}
                    </p>
                </div>

                <div className="flex-1 mx-8 h-14 relative">
                    <svg
                        viewBox="0 0 120 50"
                        className="h-full w-full"
                        preserveAspectRatio="xMidYMid meet"
                        onMouseLeave={() => setHoveredPoint(null)}
                    >
                        {[8, 18, 28, 38, 48].map((y) => (
                            <line
                                key={`grid-${y}`}
                                x1="0"
                                y1={y}
                                x2="120"
                                y2={y}
                                stroke="#D1D5DB"
                                strokeWidth="1"
                                strokeDasharray="4,4"
                                opacity="0.8"
                            />
                        ))}

                        <path
                            d={membersResult.path}
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {membersResult.points.map((point, idx) => (
                            <circle
                                key={`member-${idx}`}
                                cx={point.x}
                                cy={point.y}
                                r={
                                    hoveredPoint?.type === "members" &&
                                    hoveredPoint?.index === idx
                                        ? 5
                                        : 3.5
                                }
                                fill="#F59E0B"
                                stroke="white"
                                strokeWidth="1.5"
                                className="cursor-pointer transition-all"
                                onMouseEnter={() =>
                                    setHoveredPoint({
                                        type: "members",
                                        index: idx,
                                        x: point.x,
                                        y: point.y,
                                        value: membersData[idx] || 0,
                                        month: monthlyData[idx]?.month || "",
                                    })
                                }
                            />
                        ))}

                        <path
                            d={titlesResult.path}
                            fill="none"
                            stroke="#0D9488"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {titlesResult.points.map((point, idx) => (
                            <circle
                                key={`title-${idx}`}
                                cx={point.x}
                                cy={point.y}
                                r={
                                    hoveredPoint?.type === "titles" &&
                                    hoveredPoint?.index === idx
                                        ? 5
                                        : 3.5
                                }
                                fill="#0D9488"
                                stroke="white"
                                strokeWidth="1.5"
                                className="cursor-pointer transition-all"
                                onMouseEnter={() =>
                                    setHoveredPoint({
                                        type: "titles",
                                        index: idx,
                                        x: point.x,
                                        y: point.y,
                                        value: titlesData[idx] || 0,
                                        month: monthlyData[idx]?.month || "",
                                    })
                                }
                            />
                        ))}
                    </svg>

                    {hoveredPoint && (
                        <div
                            className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full"
                            style={{
                                left: `${(hoveredPoint.x / 120) * 100}%`,
                                top: `${(hoveredPoint.y / 50) * 100 - 10}%`,
                            }}
                        >
                            <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap">
                                <div className="font-semibold flex items-center gap-1.5">
                                    <span
                                        className={`inline-block w-2 h-2 rounded-full ${
                                            hoveredPoint.type === "titles"
                                                ? "bg-teal-500"
                                                : "bg-amber-500"
                                        }`}
                                    ></span>
                                    {hoveredPoint.value.toLocaleString()}
                                </div>
                                <div className="text-gray-400 text-[10px] mt-0.5">
                                    {hoveredPoint.month}
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 dark:bg-gray-800 transform rotate-45"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            Members
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {members.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
