import React from 'react';

interface SolvedProblem {
    solvedAt: Date;
    platform: string;
}

export function ContributionGraph({ history }: { history: SolvedProblem[] }) {
    // 1. Group solves by YYYY-MM-DD string using local time
    const solvesByDate = history.reduce((acc, curr) => {
        // Use local date string to match user's day
        const date = new Date(curr.solvedAt);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        acc[dateStr] = (acc[dateStr] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // 2. Generate last 364 days
    const days = [];
    const today = new Date();
    // Start from exactly 364 days ago (52 weeks)
    for (let i = 364; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        days.push({ dateStr, date: d });
    }

    // 3. Render Grid
    return (
        <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
            <div className="min-w-max">
                <div className="flex items-center text-xs text-text-secondary mb-2 justify-between px-1 w-[728px]">
                    <span>Last 365 Days</span>
                    <div className="flex gap-1 items-center">
                        <span className="mr-1">Less</span>
                        <div className="w-3 h-3 bg-background border border-border rounded-sm"></div>
                        <div className="w-3 h-3 bg-success/30 rounded-sm"></div>
                        <div className="w-3 h-3 bg-success/60 rounded-sm"></div>
                        <div className="w-3 h-3 bg-success rounded-sm shadow-[0_0_8px_rgba(var(--color-success),0.5)]"></div>
                        <span className="ml-1">More</span>
                    </div>
                </div>
                
                <div className="grid grid-rows-7 grid-flow-col gap-1 w-max p-1 bg-surface/30 rounded-lg border border-border">
                    {days.map((dayObj, index) => {
                        const count = solvesByDate[dayObj.dateStr] || 0;
                        let bgClass = "bg-background border border-border/50"; // 0 solves
                        if (count > 0 && count <= 2) bgClass = "bg-success/30";
                        else if (count > 2 && count <= 5) bgClass = "bg-success/60";
                        else if (count > 5) bgClass = "bg-success shadow-[0_0_5px_rgba(var(--color-success),0.4)]";

                        return (
                            <div 
                                key={index}
                                title={`${count} problems solved on ${dayObj.dateStr}`}
                                className={`w-3 h-3 rounded-sm ${bgClass} transition-all hover:scale-125 hover:z-10 cursor-pointer`}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
