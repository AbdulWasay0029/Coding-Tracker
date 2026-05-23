'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

type Profile = {
    id: string;
    platform: string;
    username: string;
};

export function ProfileManager({ initialProfiles }: { initialProfiles: Profile[] }) {
    const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        platform: 'LEETCODE',
        username: '',
        token: ''
    });

    const handleDelete = async (id: string) => {
        setDeletingId(id);
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
            setDeletingId(null);
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

    return (
        <div className="pt-4 animate-reveal stagger-2">
            <div className="flex justify-between items-baseline mb-8">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-white">Platforms</h2>
                    <p className="text-sm text-text-secondary mt-1">Manage the accounts tracked on your dashboard.</p>
                </div>
                {!isAdding && (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 text-sm font-bold text-primary hover:text-white transition-colors btn-interactive"
                    >
                        <Plus className="w-4 h-4" /> Add Account
                    </button>
                )}
            </div>

            {error && (
                <div className="text-danger text-sm font-mono mb-8 border-l-2 border-danger pl-4">
                    Error: {error}
                </div>
            )}

            {isAdding && (
                <form onSubmit={handleAdd} className="mb-12 space-y-6 animate-reveal">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Platform</label>
                            <select 
                                value={form.platform}
                                onChange={(e) => setForm({...form, platform: e.target.value})}
                                className="w-full bg-transparent border-b-2 border-border text-white text-base py-2 focus:border-primary outline-none transition-colors rounded-none appearance-none cursor-pointer"
                            >
                                <option value="LEETCODE" className="bg-background">LeetCode</option>
                                <option value="CODEFORCES" className="bg-background">Codeforces</option>
                                <option value="HACKERRANK" className="bg-background">HackerRank</option>
                                <option value="CODECHEF" className="bg-background">CodeChef</option>
                                <option value="SMARTINTERVIEWS" className="bg-background">SmartInterviews</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Username</label>
                            <input 
                                type="text"
                                required
                                value={form.username}
                                onChange={(e) => setForm({...form, username: e.target.value})}
                                placeholder="e.g. tourist"
                                className="w-full bg-transparent border-b-2 border-border text-white text-base py-2 focus:border-primary outline-none transition-colors rounded-none placeholder:text-surface"
                            />
                        </div>
                    </div>

                    {form.platform === 'SMARTINTERVIEWS' && (
                        <div className="flex flex-col gap-2 max-w-md">
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Authentication Token</label>
                            <input 
                                type="text"
                                value={form.token}
                                onChange={(e) => setForm({...form, token: e.target.value})}
                                placeholder="Required for SmartInterviews API"
                                className="w-full bg-transparent border-b-2 border-border text-white text-base py-2 focus:border-primary outline-none transition-colors rounded-none placeholder:text-surface"
                            />
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-sm font-bold bg-primary text-[#0B0E14] border border-primary hover:bg-transparent hover:text-primary transition-all btn-interactive disabled:opacity-50"
                        >
                            {loading ? 'Connecting...' : 'Connect Account'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-6 py-2 text-sm font-bold text-text-secondary hover:text-white transition-colors btn-interactive"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="divide-y divide-border border-t border-border mt-4">
                {profiles.map((p) => (
                    <div key={p.id} className="py-4 flex justify-between items-center group">
                        <div className="flex items-baseline gap-4">
                            <span className="font-bold text-white text-base w-32">{p.platform}</span>
                            <span className="font-mono text-sm text-text-secondary group-hover:text-primary transition-colors">{p.username}</span>
                        </div>
                        <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="text-text-secondary opacity-0 group-hover:opacity-100 hover:text-danger transition-all btn-interactive focus:opacity-100 disabled:opacity-50"
                            aria-label={`Disconnect ${p.platform}`}
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}

                {profiles.length === 0 && !isAdding && (
                    <div className="py-12 text-center">
                        <p className="text-text-secondary font-mono text-sm">No platforms connected.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
