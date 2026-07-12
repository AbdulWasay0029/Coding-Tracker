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
        <div className="mt-8 p-6 rounded-xl border border-border bg-surface shadow-sm animate-reveal">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Roster Mapping & Accountability Matrix
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                        Upload your batch CSV (`Roll Number, Name, Identifier/Email`). Unlinked students sort strictly to the top.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 shadow-sm">
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
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 shadow-sm"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Export to Excel (.xlsx)</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg flex items-center gap-2 text-error text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-emerald-400 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : rows.length === 0 ? (
                <div className="bg-background/50 border border-dashed border-border rounded-lg p-10 text-center text-text-secondary">
                    <Users className="w-10 h-10 mx-auto text-border mb-3" />
                    <p className="text-sm font-medium text-text-primary">No Roster Uploaded Yet</p>
                    <p className="text-xs mt-1 max-w-md mx-auto">
                        Click **Upload Roster CSV** above to import your batch roster. CodeSync will automatically cross-reference existing linked profiles.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-background border-b border-border text-text-secondary uppercase tracking-wider">
                                <th className="p-3 font-bold">Roll Number</th>
                                <th className="p-3 font-bold">Student Name</th>
                                <th className="p-3 font-bold">Identifier</th>
                                <th className="p-3 font-bold">Link Status</th>
                                <th className="p-3 font-bold">Connected Platforms</th>
                                <th className="p-3 font-bold">Today's Solves</th>
                                <th className="p-3 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {rows.map(r => (
                                <tr 
                                    key={r.id} 
                                    className={`transition-colors ${
                                        r.status === 'UNLINKED' 
                                            ? 'bg-rose-500/5 hover:bg-rose-500/10 border-l-2 border-l-rose-500' 
                                            : r.status === 'ACTIVE'
                                                ? 'hover:bg-background/80'
                                                : 'hover:bg-background/80 opacity-80'
                                    }`}
                                >
                                    <td className="p-3 font-mono font-bold text-text-primary">{r.rollNumber}</td>
                                    <td className="p-3 font-medium text-text-primary">{r.name}</td>
                                    <td className="p-3 text-text-secondary font-mono">{r.identifier || '—'}</td>
                                    <td className="p-3">
                                        {r.discordUserId ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Linked
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-medium border border-rose-500/20 animate-pulse">
                                                <XCircle className="w-3 h-3" />
                                                Unlinked
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {r.platforms.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {r.platforms.map(p => (
                                                    <span key={p} className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-[10px] text-primary">
                                                        {p.replace('SMARTINTERVIEWS', 'SI')}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-text-secondary italic">None</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {r.status === 'ACTIVE' ? (
                                            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
                                                Solved Today
                                            </span>
                                        ) : r.status === 'INACTIVE' ? (
                                            <span className="inline-flex items-center gap-1.5 text-amber-400">
                                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                                0 Solves Today
                                            </span>
                                        ) : (
                                            <span className="text-rose-400 font-medium">Defaulter (No Profile)</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-right">
                                        <button 
                                            onClick={() => handleDeleteRow(r.id, r.rollNumber)}
                                            className="text-text-secondary hover:text-rose-400 p-1 rounded transition-colors"
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
