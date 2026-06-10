'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2, X, Check, Link as LinkIcon } from 'lucide-react';

type Profile = {
    id: string;
    platform: string;
    username: string;
    token?: string | null;
    hasToken?: boolean;
};

export default function SettingsPlatformsManager() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [initLoading, setInitLoading] = useState(true);

    const [form, setForm] = useState({
        platform: 'LEETCODE',
        username: '',
        token: ''
    });

    const [editForm, setEditForm] = useState({
        username: '',
        token: ''
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
            setInitLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to disconnect this platform?')) return;
        setActionId(id);
        setError(null);
        try {
            const res = await fetch(`/api/profiles?id=${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete profile');
            setProfiles(profiles.filter(p => p.id !== id));
        } catch (err) {
            setError('Failed to delete profile');
        } finally {
            setActionId(null);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to add profile');
            
            setProfiles([...profiles, data]);
            setForm({ platform: 'LEETCODE', username: '', token: '' });
            setIsAdding(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        setActionId(id);
        setError(null);
        try {
            const res = await fetch('/api/profiles', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...editForm })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update profile');
            
            setProfiles(profiles.map(p => p.id === id ? { ...p, username: data.username, hasToken: data.hasToken } : p));
            setEditingId(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionId(null);
        }
    };

    const startEditing = (p: Profile) => {
        setEditingId(p.id);
        setEditForm({ username: p.username, token: '' });
    };

    if (initLoading) return <div className="text-white/50 text-sm animate-pulse">Loading connected platforms...</div>;

    return (
        <div className="bg-[#0B0E14] border border-white/10 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-[#60A5FA]" />
                        Connected Accounts
                    </h2>
                    <p className="text-sm text-white/50 mt-1">Manage credentials for your coding accounts.</p>
                </div>
                {!isAdding && (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#0B0E14] bg-white rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Account
                    </button>
                )}
            </div>

            {error && (
                <div className="mx-6 mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm flex items-center">
                    <span className="font-semibold mr-2">Error:</span> {error}
                </div>
            )}

            {isAdding && (
                <div className="p-6 bg-[#1A1D24] border-b border-white/5">
                    <form onSubmit={handleAdd} className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-white/70">Platform</label>
                                <select 
                                    value={form.platform}
                                    onChange={(e) => setForm({...form, platform: e.target.value})}
                                    className="w-full bg-[#0B0E14] border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:border-[#60A5FA] outline-none"
                                >
                                    <option value="LEETCODE">LeetCode</option>
                                    <option value="CODEFORCES">Codeforces</option>
                                    <option value="HACKERRANK">HackerRank</option>
                                    <option value="CODECHEF">CodeChef</option>
                                    <option value="SMARTINTERVIEWS">SmartInterviews</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-white/70">Username</label>
                                <input 
                                    type="text"
                                    required
                                    value={form.username}
                                    onChange={(e) => setForm({...form, username: e.target.value})}
                                    placeholder="e.g. tourist"
                                    className="w-full bg-[#0B0E14] border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:border-[#60A5FA] outline-none placeholder:text-white/30"
                                />
                            </div>
                        </div>

                        {form.platform === 'SMARTINTERVIEWS' && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-white/70">Authentication Token</label>
                                <input 
                                    type="text"
                                    value={form.token}
                                    onChange={(e) => setForm({...form, token: e.target.value})}
                                    placeholder="Required for SmartInterviews API"
                                    className="w-full bg-[#0B0E14] border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:border-[#60A5FA] outline-none placeholder:text-white/30"
                                />
                                <p className="text-xs text-white/40">Paste your session cookie or auth token here to allow sync.</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-bold text-[#0B0E14] bg-[#60A5FA] rounded-lg hover:bg-[#3B82F6] transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Connecting...' : 'Connect Account'}
                            </button>
                            <button 
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="divide-y divide-white/5">
                {profiles.map((p) => (
                    <div key={p.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors group">
                        {editingId === p.id ? (
                            <form onSubmit={(e) => handleUpdate(e, p.id)} className="flex-1 w-full flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-white uppercase tracking-wider">{p.platform}</span>
                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            type="submit"
                                            disabled={actionId === p.id}
                                            className="px-3 py-1.5 text-xs font-medium text-[#0B0E14] bg-[#10B981] hover:bg-[#059669] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                                        >
                                            <Check className="w-3 h-3" /> Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingId(null)}
                                            className="px-3 py-1.5 text-xs font-medium text-white/70 bg-white/5 border border-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <X className="w-3 h-3" /> Cancel
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 mt-1">
                                    <input 
                                        type="text"
                                        required
                                        value={editForm.username}
                                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                        placeholder="Username"
                                        className="w-full bg-[#0B0E14] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:border-[#60A5FA] outline-none placeholder:text-white/30"
                                    />
                                    {p.platform === 'SMARTINTERVIEWS' && (
                                        <div className="flex flex-col gap-1">
                                            <input 
                                                type="text"
                                                value={editForm.token}
                                                onChange={(e) => setEditForm({...editForm, token: e.target.value})}
                                                placeholder={p.hasToken ? "SmartInterviews Token (Saved - leave blank to keep)" : "SmartInterviews Token (Required)"}
                                                className="w-full bg-[#0B0E14] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:border-[#60A5FA] outline-none placeholder:text-white/30"
                                            />
                                            {p.hasToken && <span className="text-xs text-[#10B981] ml-1">✅ Token is securely saved</span>}
                                        </div>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-[#60A5FA]">
                                        {p.platform.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-base font-bold text-white truncate">{p.platform}</h3>
                                        <p className="text-sm font-mono text-white/50 truncate mt-0.5">{p.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => startEditing(p)}
                                        disabled={actionId === p.id}
                                        title="Edit"
                                        className="p-2.5 text-white/40 bg-white/5 border border-white/10 rounded-lg hover:text-white hover:border-[#60A5FA] transition-colors disabled:opacity-50"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(p.id)}
                                        disabled={actionId === p.id}
                                        title="Disconnect"
                                        className="p-2.5 text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg hover:bg-[#EF4444] hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {profiles.length === 0 && !isAdding && (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                            <LinkIcon className="w-5 h-5 text-white/40" />
                        </div>
                        <h3 className="text-sm font-medium text-white mb-1">No platforms connected</h3>
                        <p className="text-sm text-white/50 max-w-sm mx-auto">Get started by connecting your coding accounts to track your progress globally.</p>
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="mt-6 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#0B0E14] bg-white rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Account
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
