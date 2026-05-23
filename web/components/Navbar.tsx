'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Bot, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const navLinks = [
        { name: 'Leaderboard', href: '/leaderboard', activeColor: 'primary' },
        { name: 'Documentation', href: '/docs', activeColor: 'primary' },
    ];

    if (session) {
        navLinks.push({ name: 'Dashboard', href: '/dashboard', activeColor: 'secondary' });
    }

    return (
        <nav className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex flex-shrink-0 items-center gap-3 btn-interactive group">
                            <div className="p-1.5 rounded border border-border shadow-[0_0_10px_rgba(0,240,255,0.1)] group-hover:border-primary transition-colors">
                                <Bot className="w-6 h-6 text-primary" />
                            </div>
                            <span className="font-black text-xl tracking-tight text-white group-hover:text-primary transition-colors">
                                Code<span className="text-primary">Sync</span>
                            </span>
                        </Link>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-4 py-2 rounded text-sm font-bold transition-colors btn-interactive ${
                                        pathname === link.href 
                                            ? `text-${link.activeColor} bg-${link.activeColor}/10` 
                                            : 'text-text-secondary hover:text-white hover:bg-surface'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {session ? (
                            <>
                                <div className="flex items-center gap-2">
                                    {session.user?.image ? (
                                        <Image src={session.user.image} alt="Avatar" width={28} height={28} className="rounded-full bg-surface border border-border" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-bold text-white">
                                            {session.user?.name?.charAt(0)}
                                        </div>
                                    )}
                                    <span className="text-sm font-bold text-white">
                                        {session.user?.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="px-4 py-2 text-sm font-bold text-text-secondary border border-transparent rounded hover:border-danger hover:text-danger hover:bg-danger/10 transition-colors btn-interactive"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
                                className="px-5 py-2 text-sm font-bold text-[#0B0E14] bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition-all btn-interactive shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                            >
                                Login with Discord
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={toggleMenu} 
                            className="text-text-secondary hover:text-white p-2 focus:outline-none btn-interactive"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-[#0B0E14] animate-reveal">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-4 rounded text-base font-bold transition-colors ${
                                    pathname === link.href 
                                        ? `text-${link.activeColor} bg-${link.activeColor}/10` 
                                        : 'text-text-secondary hover:text-white hover:bg-surface'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-border mt-4 pt-4">
                            {session ? (
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        signOut();
                                    }}
                                    className="block w-full text-left px-3 py-4 rounded text-base font-bold text-danger hover:bg-danger/10 transition-colors"
                                >
                                    Log Out ({session.user?.name})
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        signIn('discord', { callbackUrl: '/dashboard' });
                                    }}
                                    className="block w-full text-center px-3 py-4 rounded text-base font-bold text-[#0B0E14] bg-primary hover:bg-transparent hover:text-primary border border-primary transition-colors"
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
