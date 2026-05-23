import Link from 'next/link';
import { Bot, Code2, Globe } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border bg-[#0B0E14] py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded border border-border shadow-[0_0_10px_rgba(0,240,255,0.05)]">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-white text-lg tracking-tight">CodeSync</span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm font-medium text-text-secondary">
                        <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
                        <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
                        <Link href="/api/auth/signin" className="hover:text-white transition-colors">Dashboard</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white transition-colors">
                            <Code2 className="w-5 h-5" />
                            <span className="sr-only">GitHub</span>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
                            <Globe className="w-5 h-5" />
                            <span className="sr-only">Twitter</span>
                        </a>
                    </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary">
                    <p>© {new Date().getFullYear()} CodeSync. All rights reserved.</p>
                    <p>Designed for competitive programming communities.</p>
                </div>
            </div>
        </footer>
    );
}
