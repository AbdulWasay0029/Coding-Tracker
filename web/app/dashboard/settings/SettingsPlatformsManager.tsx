'use client';

import { useState, useEffect } from 'react';
import { Globe, Trash2, CheckCircle2 } from 'lucide-react';

type Profile = {
    id: string;
    platform: string;
    username: string;
};

export default function SettingsPlatformsManager() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [form, setForm] = useState({
        platform: 'LEETCODE',
        username: ''
    });

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const res = await fetch('/api/profiles');
            if (res.ok) {
                const data = await res.json();
                setProfiles(data);
            }
        } catch (err) {
            console.error('Failed to fetch profiles', err);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.username) return;
        
        setActionLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            const res = await fetch('/api/profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Failed to connect platform');
            
            setProfiles([...profiles, data]);
            setForm({ platform: 'LEETCODE', username: '' });
            setSuccess(`Successfully connected to ${form.platform}!`);
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDisconnect = async (id: string) => {
        if (!confirm('Are you sure you want to disconnect this platform?')) return;
        
        setActionLoading(true);
        setError(null);
        
        try {
            const res = await fetch(`/api/profiles?id=${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to disconnect platform');
            setProfiles(profiles.filter(p => p.id !== id));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const availablePlatforms = [
        { id: 'LEETCODE', name: 'LeetCode', color: '#F59E0B' },
        { id: 'CODEFORCES', name: 'Codeforces', color: '#EF4444' },
        { id: 'HACKERRANK', name: 'HackerRank', color: '#10B981' },
    ];

    if (loading) return <div className="text-white/50 text-sm animate-pulse">Loading connected platforms...</div>;

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {success}
                </div>
            )}

            {/* List of currently connected platforms */}
            {profiles.length > 0 && (
                <div className="space-y-3 mb-8">
                    <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">Currently Connected</h3>
                    {profiles.map(p => {
                        const platformData = availablePlatforms.find(ap => ap.id === p.platform) || { color: '#60A5FA' };
                        return (
                            <div key={p.id} className="p-4 bg-[#0B0E14] border border-white/5 rounded-xl flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-white/90" style={{ color: platformData.color }}>
                                        {p.platform.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-white/90">{p.username}</span>
                                        <span className="text-[10px] uppercase font-mono tracking-wider text-white/40">{p.platform}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDisconnect(p.id)}
                                    disabled={actionLoading}
                                    className="p-2 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Disconnect"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Form to add a new platform */}
            <form onSubmit={handleConnect} className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">Connect New Platform</h3>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <select 
                        value={form.platform}
                        onChange={(e) => setForm({...form, platform: e.target.value})}
                        className="bg-[#1A1D24] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#60A5FA] cursor-pointer"
                    >
                        {availablePlatforms.map(p => (
                            <option key={p.id} value={p.id} className="bg-[#0B0E14] text-white">
                                {p.name}
                            </option>
                        ))}
                    </select>
                    
                    <input 
                        type="text" 
                        required
                        value={form.username}
                        onChange={(e) => setForm({...form, username: e.target.value})}
                        placeholder="Platform Username"
                        className="flex-1 bg-[#1A1D24] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#60A5FA]"
                    />
                    
                    <button 
                        type="submit"
                        disabled={actionLoading || !form.username}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50"
                    >
                        {actionLoading ? 'Connecting...' : 'Connect'}
                    </button>
                </div>
            </form>
        </div>
    );
}
