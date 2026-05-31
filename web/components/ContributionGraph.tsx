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

    // 2. Generate the last 365 days
    const today = new Date();
    const last365Days = [];
    // Go back exactly 364 days so total is 365 (including today)
    for (let i = 364; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        last365Days.push(d);
    }

    // 3. Group the days by Month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthGroups: { name: string, days: { dateStr: string, date: Date, dayOfWeek: number }[] }[] = [];
    let currentMonth = -1;
    let currentGroup: any = null;

    for (const d of last365Days) {
        if (d.getMonth() !== currentMonth) {
            if (currentGroup) monthGroups.push(currentGroup);
            currentMonth = d.getMonth();
            currentGroup = {
                name: months[currentMonth],
                days: []
            };
        }
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        currentGroup.days.push({ dateStr, date: d, dayOfWeek: d.getDay() }); // 0 = Sun, 6 = Sat
    }
    if (currentGroup) monthGroups.push(currentGroup);

    // 4. Render the LeetCode-style blocked grid
    return (
        <div className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-6 shadow-sm overflow-hidden flex flex-col items-center">
            <div className="w-full max-w-[900px] mb-4 flex justify-between items-end">
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

            <div className="w-full max-w-[900px] overflow-x-auto custom-scrollbar pb-4 flex justify-center">
                <div className="min-w-max flex gap-3">
                    {monthGroups.map((group, gIdx) => {
                        // Find how many padding cells we need at the start of this month block
                        // dayOfWeek goes from 0 (Sun) to 6 (Sat)
                        const firstDayOfWeek = group.days[0].dayOfWeek;
                        const paddingCells = Array(firstDayOfWeek).fill(null);

                        return (
                            <div key={gIdx} className="flex flex-col">
                                <span className="text-xs text-gray-400 mb-2 font-medium">{group.name}</span>
                                <div className="grid grid-rows-7 grid-flow-col gap-1">
                                    {/* Invisible padding cells so the first day starts on the correct row */}
                                    {paddingCells.map((_, i) => (
                                        <div key={`pad-${i}`} className="w-3 h-3 bg-transparent" />
                                    ))}
                                    
                                    {/* Actual days of the month */}
                                    {group.days.map((dayObj, dIdx) => {
                                        const count = solvesByDate[dayObj.dateStr] || 0;
                                        let bgClass = "bg-[#161b22]"; // Empty cell
                                        if (count > 0 && count <= 2) bgClass = "bg-[#0e4429]";
                                        else if (count > 2 && count <= 5) bgClass = "bg-[#006d32]";
                                        else if (count > 5 && count <= 8) bgClass = "bg-[#26a641]";
                                        else if (count > 8) bgClass = "bg-[#39d353]";

                                        return (
                                            <div 
                                                key={dIdx}
                                                title={`${count} problems solved on ${dayObj.dateStr}`}
                                                className={`w-3 h-3 rounded-[2px] ${bgClass} transition-all hover:ring-1 hover:ring-white/50 cursor-pointer`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
