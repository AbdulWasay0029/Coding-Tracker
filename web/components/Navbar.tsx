'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Bot } from 'lucide-react';

export function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <nav className="border-b-2 border-border bg-background sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex flex-shrink-0 items-center gap-3 btn-interactive">
                            {/* Glowing Neon Bot Logo */}
                            <div className="p-1.5 rounded bg-surface border border-border shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                                <Bot className="w-6 h-6 text-primary" />
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-white">
                                Code<span className="text-primary">Sync</span>
                            </span>
                        </Link>
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-6">
                                <Link
                                    href="/leaderboard"
                                    className={`px-1 py-5 text-sm font-bold border-b-2 transition-colors btn-interactive ${
                                        pathname === '/leaderboard' 
                                            ? 'border-primary text-primary' 
                                            : 'border-transparent text-text-secondary hover:text-white hover:border-border'
                                    }`}
                                >
                                    Leaderboard
                                </Link>
                                {session && (
                                    <Link
                                        href="/dashboard"
                                        className={`px-1 py-5 text-sm font-bold border-b-2 transition-colors btn-interactive ${
                                            pathname === '/dashboard' 
                                                ? 'border-secondary text-secondary' 
                                                : 'border-transparent text-text-secondary hover:text-white hover:border-border'
                                        }`}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        {session ? (
                            <div className="flex items-center space-x-6">
                                <span className="text-sm font-mono text-text-secondary hidden sm:block">
                                    {session.user?.name}
                                </span>
                                <button
                                    onClick={() => signOut()}
                                    className="px-4 py-2 text-sm font-bold text-white bg-surface border border-border rounded hover:border-danger hover:text-danger btn-interactive"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
                                className="px-5 py-2 text-sm font-bold text-[#0B0E14] bg-primary border border-primary rounded hover:bg-transparent hover:text-primary btn-interactive shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
