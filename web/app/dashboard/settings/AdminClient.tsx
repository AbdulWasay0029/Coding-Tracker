'use client';

import React, { useState, useEffect } from 'react';
import { getGuildChannels, getGuildRoles, getGuildConfig, updateGuildConfig } from './actions';
import { Settings, Save, AlertTriangle, ShieldCheck } from 'lucide-react';

export function AdminClient({ guilds }: { guilds: any[] }) {
    const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
    const [channels, setChannels] = useState<{id: string, name: string}[]>([]);
    const [roles, setRoles] = useState<{id: string, name: string}[]>([]);
    const [config, setConfig] = useState<{contestChannelId: string | null, contestRoleId: string | null, reminderChannelId: string | null, reminderTime: string | null}>({ contestChannelId: null, contestRoleId: null, reminderChannelId: null, reminderTime: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!selectedGuild) return;
        setLoading(true);
        setError(null);
        setSuccess(false);
        setChannels([]);
        setRoles([]);

        Promise.all([
            getGuildChannels(selectedGuild).catch(err => {
                setError(err.message);
                return [];
            }),
            getGuildRoles(selectedGuild).catch(() => []),
            getGuildConfig(selectedGuild).catch(() => null)
        ]).then(([fetchedChannels, fetchedRoles, fetchedConfig]) => {
            setChannels(fetchedChannels);
            setRoles(fetchedRoles);
            if (fetchedConfig) {
                setConfig({
                    contestChannelId: fetchedConfig.contestChannelId,
                    contestRoleId: fetchedConfig.contestRoleId,
                    reminderChannelId: fetchedConfig.reminderChannelId,
                    reminderTime: fetchedConfig.reminderTime
                });
            } else {
                setConfig({ contestChannelId: '', contestRoleId: '', reminderChannelId: '', reminderTime: '' });
            }
            setLoading(false);
        });
    }, [selectedGuild]);

    const handleSave = async () => {
        if (!selectedGuild) return;
        setLoading(true);
        setSuccess(false);
        setError(null);
        try {
            await updateGuildConfig(selectedGuild, config);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    // Helper to generate 15-minute intervals for time dropdown
    const generateTimeOptions = () => {
        const options = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 15) {
                const hh = h.toString().padStart(2, '0');
                const mm = m.toString().padStart(2, '0');
                options.push(`${hh}:${mm}`);
            }
        }
        return options;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Your Servers
                </h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                    {guilds.map(guild => (
                        <button
                            key={guild.id}
                            onClick={() => setSelectedGuild(guild.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3
                                ${selectedGuild === guild.id 
                                    ? 'bg-primary/10 border-primary text-primary' 
                                    : 'bg-surface border-border text-text-primary hover:bg-surface/80'}`}
                        >
                            {guild.icon ? (
                                <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} className="w-8 h-8 rounded-full" alt="Icon" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center font-bold text-xs">
                                    {guild.name.charAt(0)}
                                </div>
                            )}
                            <span className="font-medium truncate">{guild.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="md:col-span-2">
                {selectedGuild ? (
                    <div className="bg-surface border border-border p-6 rounded-xl shadow-sm animate-reveal">
                        <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2 border-b border-border pb-4">
                            <Settings className="w-6 h-6 text-primary" />
                            Server Configuration
                        </h2>

                        {error && (
                            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3 text-error">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {!error && channels.length > 0 && (
                            <div className="space-y-6">
                                <div className="p-4 rounded-lg border border-border bg-background">
                                    <h4 className="font-bold text-text-primary mb-2 text-md flex items-center gap-2">
                                        🌙 Nightly Reports (Automated)
                                    </h4>
                                    <p className="text-sm text-text-secondary mb-4">CodeSync will automatically compile a daily report of every problem solved by everyone in the server and post it at your specified time.</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">
                                                Report Channel
                                            </label>
                                            <select 
                                                className="w-full bg-surface border border-border p-3 rounded-lg text-text-primary focus:ring-2 focus:ring-primary outline-none transition-all"
                                                value={config.reminderChannelId || ''}
                                                onChange={e => setConfig(prev => ({ ...prev, reminderChannelId: e.target.value }))}
                                                disabled={loading}
                                            >
                                                <option value="">-- None (Disable Reports) --</option>
                                                {channels.map(c => (
                                                    <option key={c.id} value={c.id}># {c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">
                                                Time (IST)
                                            </label>
                                            <select 
                                                className="w-full bg-surface border border-border p-3 rounded-lg text-text-primary focus:ring-2 focus:ring-primary outline-none transition-all"
                                                value={config.reminderTime || ''}
                                                onChange={e => setConfig(prev => ({ ...prev, reminderTime: e.target.value }))}
                                                disabled={loading || !config.reminderChannelId}
                                            >
                                                <option value="">-- Select Time --</option>
                                                {generateTimeOptions().map(time => (
                                                    <option key={time} value={time}>{time} IST</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border bg-background">
                                    <h4 className="font-bold text-text-primary mb-2 text-md flex items-center gap-2">
                                        ⚡ Live Contest Alerts
                                    </h4>
                                    <p className="text-sm text-text-secondary mb-4">Automated 10-minute warnings before LeetCode and Codeforces contests begin.</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">
                                                Alert Channel
                                            </label>
                                            <select 
                                                className="w-full bg-surface border border-border p-3 rounded-lg text-text-primary focus:ring-2 focus:ring-primary outline-none transition-all"
                                                value={config.contestChannelId || ''}
                                                onChange={e => setConfig(prev => ({ ...prev, contestChannelId: e.target.value }))}
                                                disabled={loading}
                                            >
                                                <option value="">-- None (Disable Alerts) --</option>
                                                {channels.map(c => (
                                                    <option key={c.id} value={c.id}># {c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">
                                                Ping Role
                                            </label>
                                            <select 
                                                className="w-full bg-surface border border-border p-3 rounded-lg text-text-primary focus:ring-2 focus:ring-primary outline-none transition-all"
                                                value={config.contestRoleId || ''}
                                                onChange={e => setConfig(prev => ({ ...prev, contestRoleId: e.target.value }))}
                                                disabled={loading || !config.contestChannelId}
                                            >
                                                <option value="">-- None (No Ping) --</option>
                                                {roles.map(r => (
                                                    <option key={r.id} value={r.id}>@ {r.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 mt-8 rounded-lg border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div>
                                        <h4 className="font-bold text-text-primary mb-1 text-sm">Force Sync Leaderboard</h4>
                                        <p className="text-xs text-text-secondary">Manually trigger a full server data scrape. Limited to 1 use per day.</p>
                                    </div>
                                    <button 
                                        type="button"
                                        disabled={loading}
                                        onClick={async () => {
                                            if (confirm('Are you sure? This will scrape data for all users in your server and may take a few minutes.')) {
                                                alert('Force Sync initiated in the background! Please wait a few minutes for the leaderboard to update.');
                                            }
                                        }}
                                        className="px-4 py-2 bg-background border border-primary text-primary hover:bg-primary/10 rounded font-medium text-sm transition-all whitespace-nowrap"
                                    >
                                        Force Sync (Beta)
                                    </button>
                                </div>

                                <div className="pt-6 border-t border-border mt-8 flex justify-end">
                                    <button 
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {loading ? 'Saving...' : success ? 'Saved!' : 'Save Settings'}
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {loading && channels.length === 0 && (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-surface/50 border border-border border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center text-text-secondary">
                        <Settings className="w-12 h-12 text-border mb-4" />
                        <h3 className="text-lg font-medium text-text-primary mb-2">Select a Server</h3>
                        <p>Choose a server from the list to configure its settings. You will only see servers where you have Administrator permissions.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
