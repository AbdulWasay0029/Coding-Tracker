import Link from 'next/link';
import { Bot, Code2, Globe } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border bg-[#05070A] py-16 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded bg-surface border border-border shadow-[0_0_10px_rgba(0,240,255,0.05)]">
                                <Bot className="w-6 h-6 text-primary" />
                            </div>
                            <span className="font-bold text-white text-xl tracking-tight">CodeSync</span>
                        </div>
                        <p className="text-text-secondary max-w-sm text-sm leading-relaxed">
                            The ultimate Discord bot and platform to track, sync, and rank your coding progress across multiple competitive programming platforms.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-4">Platform</h3>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li><Link href="/api/auth/signin" className="hover:text-primary transition-colors">Dashboard</Link></li>
                            <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Global Leaderboard</Link></li>
                            <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-4">Community</h3>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li>
                                <a href="https://github.com/AbdulWasay0029/Coding-Tracker" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <Code2 className="w-4 h-4" /> Source Code
                                </a>
                            </li>
                            <li>
                                <a href="https://discord.com/oauth2/authorize?client_id=1478104744391344359&permissions=8&integration_type=0&scope=bot+applications.commands" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#5865F2] transition-colors">
                                    <Bot className="w-4 h-4" /> Invite Bot
                                </a>
                            </li>
                            <li>
                                <a href="https://discord.gg/qfhKfnJCau" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#5865F2] transition-colors">
                                    <Globe className="w-4 h-4" /> Updates
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-4">Legal</h3>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li><Link href="/legal/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary">
                    <p>© {new Date().getFullYear()} CodeSync. Built for competitive programmers.</p>
                    <p>Designed with <span className="text-primary">Next.js</span> and <span className="text-secondary">Neon PostgreSQL</span></p>
                </div>
            </div>
        </footer>
    );
}
