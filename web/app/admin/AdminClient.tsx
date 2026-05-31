'use client';

import React, { useState, useEffect } from 'react';
import { getGuildChannels, getGuildConfig, updateGuildConfig } from './actions';
import { Settings, Save, AlertTriangle, ShieldCheck } from 'lucide-react';

export function AdminClient({ guilds }: { guilds: any[] }) {
    const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
    const [channels, setChannels] = useState<{id: string, name: string}[]>([]);
    const [config, setConfig] = useState<{welcomeChannelId: string | null, contestChannelId: string | null}>({ welcomeChannelId: null, contestChannelId: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!selectedGuild) return;
        setLoading(true);
        setError(null);
        setSuccess(false);
        setChannels([]);

        Promise.all([
            getGuildChannels(selectedGuild).catch(err => {
                setError(err.message);
                return [];
            }),
            getGuildConfig(selectedGuild).catch(() => null)
        ]).then(([fetchedChannels, fetchedConfig]) => {
            setChannels(fetchedChannels);
            if (fetchedConfig) {
                setConfig({
                    welcomeChannelId: fetchedConfig.welcomeChannelId,
                    contestChannelId: fetchedConfig.contestChannelId
                });
            } else {
                setConfig({ welcomeChannelId: '', contestChannelId: '' });
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
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">
                                        Welcome Channel
                                    </label>
                                    <p className="text-sm text-text-secondary mb-3">Where the bot will ping users if their DMs are disabled during onboarding.</p>
                                    <select 
                                        className="w-full bg-background border border-border p-3 rounded-lg text-text-primary focus:ring-2 focus:ring-primary outline-none transition-all"
                                        value={config.welcomeChannelId || ''}
                                        onChange={e => setConfig(prev => ({ ...prev, welcomeChannelId: e.target.value }))}
                                        disabled={loading}
                                    >
                                        <option value="">-- None (Disable Fallback) --</option>
                                        {channels.map(c => (
                                            <option key={c.id} value={c.id}># {c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider mt-6">
                                        Contest Alerts Channel
                                    </label>
                                    <p className="text-sm text-text-secondary mb-3">Where the bot will send automated 10-minute warnings before LeetCode/Codeforces contests begin.</p>
                                    <select 
                                        className="w-full bg-background border border-border p-3 rounded-lg text-text-primary focus:ring-2 focus:ring-primary outline-none transition-all"
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
