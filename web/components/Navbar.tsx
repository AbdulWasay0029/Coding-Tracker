'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <nav className="border-b border-border bg-surface sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 font-bold text-xl text-primary tracking-tight">
                            CodeSync
                        </Link>
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                <Link
                                    href="/leaderboard"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        pathname === '/leaderboard' ? 'bg-border text-white' : 'text-text-secondary hover:bg-border hover:text-white'
                                    }`}
                                >
                                    Leaderboard
                                </Link>
                                {session && (
                                    <Link
                                        href="/dashboard"
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                                            pathname === '/dashboard' ? 'bg-border text-white' : 'text-text-secondary hover:bg-border hover:text-white'
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
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-text-secondary hidden sm:block">
                                    {session.user?.name}
                                </span>
                                <button
                                    onClick={() => signOut()}
                                    className="px-4 py-2 text-sm font-medium text-white bg-border rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#5865F2] rounded-md hover:bg-[#4752C4] transition-colors"
                            >
                                Login with Discord
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
