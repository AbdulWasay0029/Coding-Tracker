'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Command, Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const navLinks = [
        { name: 'Leaderboard', href: '/leaderboard' },
        { name: 'Documentation', href: '/docs' },
    ];

    if (session) {
        navLinks.push(
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Admin', href: '/admin' }
        );
    }

    return (
        <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-14">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex flex-shrink-0 items-center gap-2.5 btn-interactive group">
                            <div className="p-1 rounded bg-surface border border-border group-hover:border-primary transition-colors">
                                <Command className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-semibold text-lg tracking-tight text-white transition-colors">
                                Code<span className="text-primary">Sync</span>
                            </span>
                        </Link>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors btn-interactive ${
                                        pathname === link.href 
                                            ? 'text-text-primary bg-surface border border-border shadow-sm' 
                                            : 'text-text-secondary hover:text-text-primary hover:bg-surface/50 border border-transparent'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {session ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    {session.user?.image ? (
                                        <Image src={session.user.image} alt="Avatar" width={24} height={24} className="rounded bg-surface border border-border" />
                                    ) : (
                                        <div className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center text-xs font-medium text-text-primary">
                                            {session.user?.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="h-4 w-px bg-border"></div>
                                <button
                                    onClick={() => signOut()}
                                    className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors btn-interactive"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-background bg-text-primary rounded hover:bg-white transition-colors btn-interactive shadow-sm"
                            >
                                Login with Discord <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={toggleMenu} 
                            className="text-text-secondary hover:text-text-primary p-2 focus:outline-none btn-interactive"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-14 left-0 w-full border-b border-border bg-background/95 backdrop-blur-md shadow-xl">
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded text-sm font-medium transition-colors ${
                                    pathname === link.href 
                                        ? 'text-text-primary bg-surface border border-border' 
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface/50 border border-transparent'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-border mt-2 pt-2">
                            {session ? (
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        signOut();
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface/50 transition-colors"
                                >
                                    Log out
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        signIn('discord', { callbackUrl: '/dashboard' });
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded text-sm font-medium text-text-primary hover:bg-surface/50 transition-colors"
                                >
                                    Login with Discord
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
