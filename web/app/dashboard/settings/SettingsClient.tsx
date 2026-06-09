'use client';

import { useState, useEffect } from 'react';
import { User, Globe, Palette, Shield, Save, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import SettingsPlatformsManager from './SettingsPlatformsManager';
import { AdminClient } from './AdminClient';
import WidgetsClient from './widgets/WidgetsClient';
import DocsClient from './docs/DocsClient';
import { FileText, Code2, Server } from 'lucide-react';

export default function SettingsHub({ session: serverSession, adminGuilds }: { session: any, adminGuilds: any[] }) {
    const { data: clientSession } = useSession();
    const session = clientSession || serverSession;
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'account');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const tabs = [
        { id: 'account', label: 'Account Profile', icon: User },
        { id: 'platforms', label: 'Connected Platforms', icon: Globe },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'security', label: 'Security & Privacy', icon: Shield },
        { id: 'admin', label: 'Server Admin', icon: Server },
        { id: 'widgets', label: 'GitHub Widgets', icon: Code2 },
        { id: 'docs', label: 'Documentation', icon: FileText },
    ];

    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-10 animate-reveal">
                <h1 className="text-3xl font-bold text-white/95 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-lg">
                        <User className="w-6 h-6 text-[#60A5FA]" />
                    </div>
                    Settings
                </h1>
                <p className="text-white/50 mt-2">Manage your profile, preferences, and platform integrations.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0 animate-reveal stagger-1">
                    <div className="glass-subtle rounded-2xl p-4 sticky top-24 flex flex-col gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        router.push(`?tab=${tab.id}`, { scroll: false });
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-[#3B82F6]/10 text-[#60A5FA] border border-[#3B82F6]/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                                            : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 animate-reveal stagger-2">
                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <div className="glass-subtle rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-white/90 mb-6">Public Profile</h2>
                                
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-20 h-20 rounded-full bg-[#1A1D24] border border-[#60A5FA]/30 flex items-center justify-center text-2xl font-bold text-[#60A5FA] shadow-[0_0_15px_rgba(96,165,250,0.1)]">
                                        {session?.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                                            Change Avatar
                                        </button>
                                        <p className="text-xs text-white/40 mt-2 font-mono uppercase tracking-wider">JPG, GIF or PNG. Max size of 800K</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Display Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue={session?.user?.name || ''}
                                            className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA] transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Bio</label>
                                        <textarea 
                                            rows={3}
                                            placeholder="Tell us a little bit about yourself..."
                                            className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA] transition-all resize-none"
                                        />
                                    </div>
                                    <div className="pt-6 border-t border-white/5 flex justify-end">
                                        <button className="flex items-center gap-2 px-6 py-3 bg-[#60A5FA] hover:bg-[#3B82F6] text-[#0B0E14] font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(96,165,250,0.3)] hover:scale-105 hover:shadow-[0_0_30px_rgba(96,165,250,0.4)]">
                                            <Save className="w-5 h-5" /> Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'platforms' && (
                        <div className="space-y-6">
                            <div className="glass-subtle rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-white/90 mb-2">Connected Platforms</h2>
                                <p className="text-sm text-white/50 mb-8">Link your coding accounts to automatically sync your stats to your profile.</p>

                                <SettingsPlatformsManager />
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <div className="glass-subtle rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-white/90 mb-6">Theme Preferences</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <button className="p-8 border-2 border-[#60A5FA] bg-[#3B82F6]/5 rounded-2xl flex flex-col items-center gap-4 relative overflow-hidden group hover:bg-[#3B82F6]/10 transition-colors">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/20 to-transparent opacity-50" />
                                        <div className="w-16 h-16 rounded-full bg-[#0B0E14] border border-[#3B82F6]/30 flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                            <div className="w-5 h-5 rounded-full bg-[#60A5FA] shadow-[0_0_15px_#60A5FA]" />
                                        </div>
                                        <span className="font-bold text-lg text-white relative z-10">CodeSync Dark</span>
                                        <span className="text-xs text-[#60A5FA] font-bold tracking-wider uppercase relative z-10">Active Theme</span>
                                    </button>

                                    <button className="p-8 border border-white/10 bg-[#0B0E14] hover:bg-[#1A1D24] rounded-2xl flex flex-col items-center gap-4 transition-colors opacity-50 cursor-not-allowed">
                                        <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                                            <div className="w-5 h-5 rounded-full bg-gray-400" />
                                        </div>
                                        <span className="font-bold text-lg text-white/50">Light Mode</span>
                                        <span className="text-xs text-white/30 font-bold tracking-wider uppercase">Coming Soon</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="glass-subtle rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-white/90 mb-6">Privacy Options</h2>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-6 bg-[#0B0E14] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                                        <div>
                                            <h3 className="font-bold text-white/90">Public Leaderboard</h3>
                                            <p className="text-sm text-white/50 mt-1">Allow your stats to be shown on global rankings.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#10B981] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-[#0B0E14] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                                        <div>
                                            <h3 className="font-bold text-white/90">Discord DM Notifications</h3>
                                            <p className="text-sm text-white/50 mt-1">Receive direct messages for daily streak summaries.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#10B981] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Danger Zone */}
                            <div className="glass-subtle rounded-2xl p-8 border-[#EF4444]/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#EF4444] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
                                <h2 className="text-xl font-bold text-[#EF4444] mb-6 relative z-10">Danger Zone</h2>
                                <div className="p-6 bg-[#0B0E14] border border-[#EF4444]/20 rounded-2xl flex items-center justify-between relative z-10">
                                    <div>
                                        <h3 className="font-bold text-white/90">Delete Account</h3>
                                        <p className="text-sm text-white/50 mt-1">Permanently remove your account and all associated data.</p>
                                    </div>
                                    <button className="px-6 py-3 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 rounded-xl text-sm font-bold transition-colors">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'admin' && (
                        <AdminClient guilds={adminGuilds} />
                    )}

                    {activeTab === 'widgets' && (
                        <WidgetsClient userId={session?.user?.id || ''} />
                    )}

                    {activeTab === 'docs' && (
                        <DocsClient />
                    )}
                </div>
            </div>
        </div>
    );
}
