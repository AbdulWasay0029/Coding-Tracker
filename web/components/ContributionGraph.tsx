import React from 'react';

interface SolvedProblem {
    solvedAt: Date;
    platform: string;
}

export function ContributionGraph({ history }: { history: SolvedProblem[] }) {
    // 1. Group solves by YYYY-MM-DD string using UTC time
    const solvesByDate = history.reduce((acc, curr) => {
        const date = new Date(curr.solvedAt);
        const dateStr = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
        acc[dateStr] = (acc[dateStr] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // 2. Generate the last 365 days using UTC
    const today = new Date();
    const last365Days = [];
    for (let i = 364; i >= 0; i--) {
        const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
        last365Days.push(d);
    }

    // 3. Group the days by Month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthGroups: { name: string, days: { dateStr: string, date: Date, dayOfWeek: number }[] }[] = [];
    let currentMonth = -1;
    let currentGroup: any = null;

    for (const d of last365Days) {
        if (d.getUTCMonth() !== currentMonth) {
            if (currentGroup) monthGroups.push(currentGroup);
            currentMonth = d.getUTCMonth();
            currentGroup = {
                name: months[currentMonth],
                days: []
            };
        }
        const dateStr = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
        currentGroup.days.push({ dateStr, date: d, dayOfWeek: d.getUTCDay() }); // 0 = Sun, 6 = Sat
    }
    if (currentGroup) monthGroups.push(currentGroup);

    // 4. Render the CodeSync-style blocked grid
    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-[900px] mb-4 flex justify-between items-end px-2">
                <div>
                    <h3 className="text-sm font-semibold text-white/90">Activity Heatmap</h3>
                    <p className="text-[10px] uppercase tracking-wider font-mono text-[#60A5FA] mt-1">{history.length} problems solved</p>
                </div>
                <div className="flex gap-1.5 items-center text-xs text-white/40 font-mono">
                    <span className="mr-1">Less</span>
                    <div className="w-3 h-3 bg-[#1A1D24] border border-white/5 rounded-[2px]"></div>
                    <div className="w-3 h-3 bg-[#10B981]/20 rounded-[2px]"></div>
                    <div className="w-3 h-3 bg-[#10B981]/50 rounded-[2px]"></div>
                    <div className="w-3 h-3 bg-[#10B981]/80 rounded-[2px]"></div>
                    <div className="w-3 h-3 bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)] rounded-[2px]"></div>
                    <span className="ml-1">More</span>
                </div>
            </div>

            <div className="w-full max-w-[900px] overflow-x-auto custom-scrollbar pb-4 flex justify-center">
                <div className="min-w-max flex gap-2.5">
                    {monthGroups.map((group, gIdx) => {
                        // Find how many padding cells we need at the start of this month block
                        const firstDayOfWeek = group.days[0].dayOfWeek;
                        const paddingCells = Array(firstDayOfWeek).fill(null);

                        return (
                            <div key={gIdx} className="flex flex-col">
                                <span className="text-[10px] text-white/40 mb-2 font-mono uppercase tracking-wider">{group.name}</span>
                                <div className="grid grid-rows-7 grid-flow-col gap-1">
                                    {/* Invisible padding cells so the first day starts on the correct row */}
                                    {paddingCells.map((_, i) => (
                                        <div key={`pad-${i}`} className="w-3 h-3 bg-transparent" />
                                    ))}
                                    
                                    {/* Actual days of the month */}
                                    {group.days.map((dayObj, dIdx) => {
                                        const count = solvesByDate[dayObj.dateStr] || 0;
                                        let bgClass = "bg-[#1A1D24] border border-white/5"; // Empty cell
                                        let glowClass = "";
                                        
                                        if (count > 0 && count <= 2) bgClass = "bg-[#10B981]/20";
                                        else if (count > 2 && count <= 5) bgClass = "bg-[#10B981]/50";
                                        else if (count > 5 && count <= 8) bgClass = "bg-[#10B981]/80";
                                        else if (count > 8) {
                                            bgClass = "bg-[#10B981]";
                                            glowClass = "shadow-[0_0_8px_rgba(16,185,129,0.5)]";
                                        }

                                        return (
                                            <div 
                                                key={dIdx}
                                                title={`${count} problems solved on ${dayObj.dateStr}`}
                                                className={`w-3 h-3 rounded-[2px] ${bgClass} ${glowClass} transition-all duration-300 hover:ring-1 hover:ring-white/80 hover:scale-125 cursor-pointer z-10 hover:z-20`}
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
