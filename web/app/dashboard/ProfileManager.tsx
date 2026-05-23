'use client';

import { useState } from 'react';
import { Trash2, Plus, Edit2, X, Check, Link as LinkIcon, ExternalLink } from 'lucide-react';

type Profile = {
    id: string;
    platform: string;
    username: string;
    token?: string | null;
};

export function ProfileManager({ initialProfiles }: { initialProfiles: Profile[] }) {
    const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        platform: 'LEETCODE',
        username: '',
        token: ''
    });

    const [editForm, setEditForm] = useState({
        username: '',
        token: ''
    });

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
            
            setProfiles(profiles.map(p => p.id === id ? { ...p, username: data.username } : p));
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

    return (
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden animate-reveal">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-text-secondary" />
                        Connected Platforms
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">Link your coding accounts to sync your solved problems.</p>
                </div>
                {!isAdding && (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#0B0E14] bg-white rounded-md hover:bg-gray-200 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Account
                    </button>
                )}
            </div>

            {error && (
                <div className="mx-6 mt-6 p-4 bg-danger/10 border border-danger/20 rounded-md text-danger text-sm flex items-center">
                    <span className="font-semibold mr-2">Error:</span> {error}
                </div>
            )}

            {isAdding && (
                <div className="p-6 bg-[#0B0E14]/50 border-b border-border">
                    <form onSubmit={handleAdd} className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-primary">Platform</label>
                                <select 
                                    value={form.platform}
                                    onChange={(e) => setForm({...form, platform: e.target.value})}
                                    className="w-full bg-background border border-border text-white text-sm rounded-md px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
                                >
                                    <option value="LEETCODE">LeetCode</option>
                                    <option value="CODEFORCES">Codeforces</option>
                                    <option value="HACKERRANK">HackerRank</option>
                                    <option value="CODECHEF">CodeChef</option>
                                    <option value="SMARTINTERVIEWS">SmartInterviews</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-primary">Username</label>
                                <input 
                                    type="text"
                                    required
                                    value={form.username}
                                    onChange={(e) => setForm({...form, username: e.target.value})}
                                    placeholder="e.g. tourist"
                                    className="w-full bg-background border border-border text-white text-sm rounded-md px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow placeholder:text-text-secondary/50"
                                />
                            </div>
                        </div>

                        {form.platform === 'SMARTINTERVIEWS' && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-primary">Authentication Token</label>
                                <input 
                                    type="text"
                                    value={form.token}
                                    onChange={(e) => setForm({...form, token: e.target.value})}
                                    placeholder="Required for SmartInterviews API"
                                    className="w-full bg-background border border-border text-white text-sm rounded-md px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow placeholder:text-text-secondary/50"
                                />
                                <p className="text-xs text-text-secondary">Paste your session cookie or auth token here to allow sync.</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#0B0E14] bg-primary rounded-md hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                            >
                                {loading ? 'Connecting...' : 'Connect Account'}
                            </button>
                            <button 
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-surface border border-border rounded-md hover:bg-border transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="divide-y divide-border">
                {profiles.map((p) => (
                    <div key={p.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface/30 transition-colors">
                        {editingId === p.id ? (
                            <form onSubmit={(e) => handleUpdate(e, p.id)} className="flex-1 w-full flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-white uppercase tracking-wider">{p.platform}</span>
                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            type="submit"
                                            disabled={actionId === p.id}
                                            className="px-3 py-1 text-xs font-medium text-white bg-success hover:bg-success/80 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                                        >
                                            <Check className="w-3 h-3" /> Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingId(null)}
                                            className="px-3 py-1 text-xs font-medium text-text-secondary bg-surface border border-border hover:text-white rounded-md transition-colors flex items-center gap-1"
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
                                        className="w-full bg-[#05070A] border border-border text-white text-sm rounded-md px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-text-secondary/50"
                                    />
                                    {p.platform === 'SMARTINTERVIEWS' && (
                                        <input 
                                            type="text"
                                            value={editForm.token}
                                            onChange={(e) => setEditForm({...editForm, token: e.target.value})}
                                            placeholder="SmartInterviews Token (Optional)"
                                            className="w-full bg-[#05070A] border border-border text-white text-sm rounded-md px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-text-secondary/50"
                                        />
                                    )}
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="min-w-0">
                                        <h3 className="text-base font-bold text-white truncate">{p.platform}</h3>
                                        <p className="text-sm font-mono text-text-secondary truncate mt-0.5">{p.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => startEditing(p)}
                                        disabled={actionId === p.id}
                                        className="px-3 py-1.5 text-sm font-medium text-text-secondary bg-surface border border-border rounded-md hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        disabled={actionId === p.id}
                                        className="px-3 py-1.5 text-sm font-medium text-danger bg-danger/10 border border-danger/20 rounded-md hover:bg-danger hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {profiles.length === 0 && !isAdding && (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
                            <LinkIcon className="w-5 h-5 text-text-secondary" />
                        </div>
                        <h3 className="text-sm font-medium text-white mb-1">No platforms connected</h3>
                        <p className="text-sm text-text-secondary max-w-sm mx-auto">Get started by connecting your coding accounts to track your progress globally.</p>
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="mt-6 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#0B0E14] bg-white rounded-md hover:bg-gray-200 transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Account
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
