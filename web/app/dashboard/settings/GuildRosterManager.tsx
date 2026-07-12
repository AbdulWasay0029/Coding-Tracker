'use client';

import React, { useState, useEffect } from 'react';
import { 
    getGuildRosterAccountability, 
    importGuildRoster, 
    removeGuildRosterMember, 
    RosterAccountabilityRow 
} from './actions';
import { 
    Users, 
    Upload, 
    Download, 
    Trash2, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    Loader2, 
    FileSpreadsheet, 
    PlusCircle 
} from 'lucide-react';

export function GuildRosterManager({ guildId }: { guildId: string }) {
    const [rows, setRows] = useState<RosterAccountabilityRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const loadRoster = async () => {
        if (!guildId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getGuildRosterAccountability(guildId);
            setRows(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load roster.');
        }
        setLoading(false);
    };

    useEffect(() => {
        loadRoster();
    }, [guildId]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        setError(null);
        setSuccessMessage(null);

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
                
                const csvRows: { rollNumber: string; name: string; identifier: string }[] = [];
                
                // Skip header if it contains "roll" or "number"
                const startIndex = (lines[0] && lines[0].toLowerCase().includes('roll')) ? 1 : 0;

                for (let i = startIndex; i < lines.length; i++) {
                    // Handle comma-separated values (basic split handling quotes if needed)
                    const parts = lines[i].split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
                    if (parts.length >= 1 && parts[0]) {
                        csvRows.push({
                            rollNumber: parts[0],
                            name: parts[1] || 'Student',
                            identifier: parts[2] || ''
                        });
                    }
                }

                if (csvRows.length === 0) {
                    throw new Error('No valid rows found in CSV. Expected format: Roll Number, Name, Identifier');
                }

                const res = await importGuildRoster(guildId, csvRows);
                setSuccessMessage(`✅ Successfully imported ${res.importedCount} students (${res.unlinkedCount} currently unlinked).`);
                await loadRoster();
            } catch (err: any) {
                setError(err.message || 'Failed to import CSV.');
            } finally {
                setImporting(false);
                if (e.target) e.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    const handleExportExcel = async () => {
        if (rows.length === 0) return;
        try {
            const ExcelJS = (await import('exceljs')).default;
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Roster Accountability');

            // Header styling
            worksheet.columns = [
                { header: 'Roll Number', key: 'rollNumber', width: 18 },
                { header: 'Student Name', key: 'name', width: 25 },
                { header: 'Identifier (Email/Handle)', key: 'identifier', width: 28 },
                { header: 'Link Status', key: 'linkStatus', width: 16 },
                { header: 'Connected Platforms', key: 'platforms', width: 30 },
                { header: "Today's Solves Status", key: 'todayStatus', width: 22 }
            ];

            worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF1E3A8A' } // Dark Blue header
            };

            // Add data rows
            rows.forEach(r => {
                const row = worksheet.addRow({
                    rollNumber: r.rollNumber,
                    name: r.name,
                    identifier: r.identifier || '—',
                    linkStatus: r.discordUserId ? 'Linked' : 'Unlinked',
                    platforms: r.platforms.length > 0 ? r.platforms.join(', ') : 'None',
                    todayStatus: r.status === 'ACTIVE' ? 'Solved Today' : r.status === 'INACTIVE' ? 'No Solves Today' : 'Unlinked (Defaulter)'
                });

                // Color code rows based on status
                if (r.status === 'UNLINKED') {
                    row.getCell('linkStatus').font = { color: { argb: 'FFDC2626' }, bold: true }; // Red
                    row.getCell('todayStatus').font = { color: { argb: 'FFDC2626' } };
                } else if (r.status === 'ACTIVE') {
                    row.getCell('todayStatus').font = { color: { argb: 'FF16A34A' }, bold: true }; // Green
                } else {
                    row.getCell('todayStatus').font = { color: { argb: 'FFD97706' } }; // Amber
                }
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const dateStr = new Date().toISOString().split('T')[0];
            a.download = `Roster_Accountability_${guildId}_${dateStr}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            alert(`Failed to export Excel: ${err.message}`);
        }
    };

    const handleDeleteRow = async (id: string, roll: string) => {
        if (!confirm(`Are you sure you want to remove roll number ${roll} from the roster?`)) return;
        try {
            await removeGuildRosterMember(id);
            setRows(prev => prev.filter(r => r.id !== id));
        } catch (err: any) {
            alert(`Error removing student: ${err.message}`);
        }
    };

    return (
        <div className="mt-8 glass-strong rounded-2xl p-6 md:p-8 border border-white/10 shadow-[0_12px_40px_-10px_rgba(59,130,246,0.15)] animate-reveal relative overflow-hidden">
            {/* Atmospheric background glow */}
            <div className="absolute top-[-40%] right-[-10%] w-[50%] h-[120%] bg-[#3B82F6] opacity-[0.06] blur-[120px] rounded-full pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#60A5FA]">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white/95 tracking-tight flex items-center gap-3">
                                Roster Mapping & Accountability
                                {rows.length > 0 && (
                                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                                        {rows.length} students ({rows.filter(r => !r.discordUserId).length} unlinked)
                                    </span>
                                )}
                            </h3>
                            <p className="text-xs text-white/60 mt-1 leading-relaxed">
                                Upload your batch CSV (<code className="text-[#60A5FA] bg-[#3B82F6]/10 px-1 py-0.5 rounded font-mono">Roll Number, Name, Identifier</code>). Unlinked defaulters sort strictly to the top.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <label className="cursor-pointer bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50">
                        {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        <span>{importing ? 'Importing CSV...' : 'Upload Roster CSV'}</span>
                        <input 
                            type="file" 
                            accept=".csv" 
                            onChange={handleFileUpload} 
                            disabled={importing || loading} 
                            className="hidden" 
                        />
                    </label>

                    <button
                        onClick={handleExportExcel}
                        disabled={loading || rows.length === 0}
                        className="bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(16,185,129,0.25)] disabled:opacity-50"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Export to Excel (.xlsx)</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl flex items-center gap-3 text-[#EF4444] text-xs relative z-10 animate-reveal">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="mb-6 p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl flex items-center gap-3 text-[#10B981] text-xs relative z-10 animate-reveal">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{successMessage}</span>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 relative z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-[#60A5FA]" />
                    <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Cross-Referencing Roster...</span>
                </div>
            ) : rows.length === 0 ? (
                <div className="bg-[#0B0E14]/60 border border-dashed border-white/10 rounded-2xl p-12 text-center relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                        <Users className="w-7 h-7 text-white/30" />
                    </div>
                    <p className="text-base font-bold text-white/90">No Roster Uploaded Yet</p>
                    <p className="text-xs text-white/50 mt-2 max-w-md mx-auto leading-relaxed">
                        Click <strong className="text-[#60A5FA]">Upload Roster CSV</strong> above to import your batch roster. CodeSync will automatically cross-reference existing linked profiles.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0B0E14]/80 relative z-10 custom-scrollbar">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-[#1A1D24] border-b border-white/10 text-white/60 uppercase tracking-wider font-mono">
                                <th className="p-4 font-bold">Roll Number</th>
                                <th className="p-4 font-bold">Student Name</th>
                                <th className="p-4 font-bold">Identifier</th>
                                <th className="p-4 font-bold">Link Status</th>
                                <th className="p-4 font-bold">Connected Platforms</th>
                                <th className="p-4 font-bold">Today's Solves</th>
                                <th className="p-4 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {rows.map(r => (
                                <tr 
                                    key={r.id} 
                                    className={`transition-colors duration-200 ${
                                        r.status === 'UNLINKED' 
                                            ? 'bg-[#EF4444]/[0.08] hover:bg-[#EF4444]/[0.15] border-l-4 border-l-[#EF4444]' 
                                            : r.status === 'ACTIVE'
                                                ? 'hover:bg-white/[0.04]'
                                                : 'hover:bg-white/[0.04] opacity-85'
                                    }`}
                                >
                                    <td className="p-4 font-mono font-bold tabular-nums text-white/95">{r.rollNumber}</td>
                                    <td className="p-4 font-semibold text-white/95">{r.name}</td>
                                    <td className="p-4 text-white/60 font-mono">{r.identifier || '—'}</td>
                                    <td className="p-4">
                                        {r.discordUserId ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] font-mono text-[11px] font-bold border border-[#10B981]/30">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Linked
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EF4444]/15 text-[#EF4444] font-mono text-[11px] font-bold border border-[#EF4444]/30 animate-pulse">
                                                <XCircle className="w-3.5 h-3.5" />
                                                Unlinked
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {r.platforms.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {r.platforms.map(p => (
                                                    <span key={p} className="px-2 py-0.5 rounded-md bg-[#1A1D24] border border-white/10 font-mono text-[10px] text-[#60A5FA] font-bold">
                                                        {p.replace('SMARTINTERVIEWS', 'SI')}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-white/40 italic">None</span>
                                        )}
                                    </td>
                                    <td className="p-4 font-mono">
                                        {r.status === 'ACTIVE' ? (
                                            <span className="inline-flex items-center gap-2 font-bold text-[#10B981]">
                                                <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                                                Solved Today
                                            </span>
                                        ) : r.status === 'INACTIVE' ? (
                                            <span className="inline-flex items-center gap-2 text-[#F59E0B]">
                                                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                                                0 Solves Today
                                            </span>
                                        ) : (
                                            <span className="text-[#EF4444] font-bold">Defaulter (No Profile)</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleDeleteRow(r.id, r.rollNumber)}
                                            className="text-white/40 hover:text-[#EF4444] p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                                            title="Remove from roster"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
