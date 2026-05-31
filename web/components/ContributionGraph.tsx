import React from 'react';

interface SolvedProblem {
    solvedAt: Date;
    platform: string;
}

export function ContributionGraph({ history }: { history: SolvedProblem[] }) {
    // 1. Group solves by YYYY-MM-DD string using local time
    const solvesByDate = history.reduce((acc, curr) => {
        const date = new Date(curr.solvedAt);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        acc[dateStr] = (acc[dateStr] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // 2. Generate exactly 52 weeks (364 days) ending today
    const weeks: { dateStr: string, date: Date }[][] = [];
    const today = new Date();
    
    // Shift the starting date so the final day in the grid aligns perfectly with today's day of week.
    // GitHub ends on the current day in the rightmost column.
    for (let i = 0; i < 52; i++) {
        const week = [];
        for (let j = 0; j < 7; j++) {
            const daysAgo = (51 - i) * 7 + (6 - j);
            const d = new Date();
            d.setDate(today.getDate() - daysAgo);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            week.push({ dateStr, date: d });
        }
        weeks.push(week);
    }

    // 3. Generate Month Labels
    const monthLabels = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let lastMonth = -1;
    
    for (let i = 0; i < weeks.length; i++) {
        const weekStartMonth = weeks[i][0].date.getMonth();
        if (i === 0) {
            monthLabels.push({ name: months[weekStartMonth], index: i });
            lastMonth = weekStartMonth;
        } else if (weekStartMonth !== lastMonth) {
            monthLabels.push({ name: months[weekStartMonth], index: i });
            lastMonth = weekStartMonth;
        }
    }

    // 4. Render Linear-style Grid
    return (
        <div className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm overflow-hidden flex flex-col items-center">
            <div className="w-full max-w-[850px] mb-4 flex justify-between items-end">
                <div>
                    <h3 className="text-lg font-semibold text-gray-200">Contribution Activity</h3>
                    <p className="text-xs text-gray-400 mt-1">{history.length} problems solved in the last year</p>
                </div>
                <div className="flex gap-1.5 items-center text-xs text-gray-400">
                    <span className="mr-1">Less</span>
                    <div className="w-3 h-3 bg-[#161b22] rounded-[2px]"></div>
                    <div className="w-3 h-3 bg-[#0e4429] rounded-[2px]"></div>
                    <div className="w-3 h-3 bg-[#006d32] rounded-[2px]"></div>
                    <div className="w-3 h-3 bg-[#26a641] rounded-[2px]"></div>
                    <div className="w-3 h-3 bg-[#39d353] rounded-[2px]"></div>
                    <span className="ml-1">More</span>
                </div>
            </div>

            <div className="w-full max-w-[850px] overflow-x-auto custom-scrollbar pb-2 flex justify-center">
                <div className="min-w-max flex flex-col">
                    {/* Month Labels */}
                    <div className="relative h-5 w-full text-xs text-gray-400 mb-1">
                        {monthLabels.map((label, idx) => (
                            <span 
                                key={idx} 
                                className="absolute bottom-0"
                                style={{ left: `${label.index * 16}px` }} // w-3 (12px) + gap-1 (4px) = 16px
                            >
                                {label.name}
                            </span>
                        ))}
                    </div>

                    {/* Heatmap Grid */}
                    <div className="flex gap-1">
                        {weeks.map((week, weekIdx) => (
                            <div key={weekIdx} className="flex flex-col gap-1">
                                {week.map((dayObj, dayIdx) => {
                                    const count = solvesByDate[dayObj.dateStr] || 0;
                                    let bgClass = "bg-[#161b22]"; // Empty cell
                                    if (count > 0 && count <= 2) bgClass = "bg-[#0e4429]";
                                    else if (count > 2 && count <= 5) bgClass = "bg-[#006d32]";
                                    else if (count > 5 && count <= 8) bgClass = "bg-[#26a641]";
                                    else if (count > 8) bgClass = "bg-[#39d353]";

                                    return (
                                        <div 
                                            key={dayIdx}
                                            title={`${count} problems solved on ${dayObj.dateStr}`}
                                            className={`w-3 h-3 rounded-[2px] ${bgClass} transition-all hover:ring-1 hover:ring-white/50 cursor-pointer`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
