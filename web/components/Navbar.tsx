'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Command, Menu, X, ArrowRight, Settings } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const navLinks = [
        ...(pathname === '/' ? [
            { name: 'Features', href: '/#features' },
            { name: 'FAQ', href: '/#community' }
        ] : []),
        { name: 'Leaderboard', href: '/leaderboard' },
    ];

    return (
        <nav className="bg-[#0B0E14] border-b border-[#1A1D24] sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Brand & Main Links */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex flex-shrink-0 items-center gap-3 group">
                            <div className="relative w-32 h-16 flex items-center justify-start transition-transform group-hover:scale-105">
                                <Image src="/logo_new_navbar.png" alt="CodeSync Logo" fill className="object-contain object-left" />
                            </div>
                        </Link>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                        pathname === link.href 
                                            ? 'text-white bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right: User Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {session ? (
                            <div className="flex items-center gap-3">
                                {/* Profile Link (Dashboard) */}
                                <Link 
                                    href="/dashboard"
                                    className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-white/10 bg-[#0B0E14]/50 hover:bg-white/5 hover:border-[#60A5FA]/30 transition-all group shadow-sm"
                                >
                                    {session.user?.image ? (
                                        <Image src={session.user.image} alt="Avatar" width={28} height={28} className="rounded-full border border-[#60A5FA]/30 group-hover:border-[#60A5FA] transition-colors" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-[#1A1D24] border border-[#60A5FA]/30 flex items-center justify-center text-xs font-bold text-white group-hover:border-[#60A5FA] transition-colors">
                                            {session.user?.name?.charAt(0)}
                                        </div>
                                    )}
                                    <span className="text-sm font-semibold text-white/90 group-hover:text-white">{session.user?.name}</span>
                                </Link>

                                {/* Settings Icon */}
                                <Link 
                                    href="/dashboard/settings"
                                    className={`p-2 rounded-lg transition-colors ${
                                        pathname === '/dashboard/settings' 
                                            ? 'text-[#60A5FA] bg-[#3B82F6]/10 border border-[#3B82F6]/20' 
                                            : 'text-white/50 hover:text-white hover:bg-white/10 border border-transparent'
                                    }`}
                                    title="Settings"
                                >
                                    <Settings className="w-5 h-5" />
                                </Link>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#0B0E14] bg-[#60A5FA] rounded-lg hover:bg-[#93C5FD] transition-colors shadow-[0_0_15px_rgba(96,165,250,0.3)]"
                            >
                                Login with Discord <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        {session && (
                            <Link href="/dashboard" className="flex items-center">
                                {session.user?.image ? (
                                    <Image src={session.user.image} alt="Avatar" width={32} height={32} className="rounded-full border border-[#60A5FA]/30" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-[#1A1D24] border border-[#60A5FA]/30 flex items-center justify-center text-xs font-bold text-white">
                                        {session.user?.name?.charAt(0)}
                                    </div>
                                )}
                            </Link>
                        )}
                        <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleMenu(); }} 
                            className="relative z-50 text-white/70 hover:text-white p-2 focus:outline-none bg-white/5 border border-white/10 rounded-lg"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6 pointer-events-none" /> : <Menu className="w-6 h-6 pointer-events-none" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full border-b border-white/10 bg-[#0B0E14]/98 backdrop-blur-xl shadow-2xl">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                                    pathname === link.href 
                                        ? 'text-white bg-white/10 border border-white/5' 
                                        : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-white/10 mt-4 pt-4">
                            {session ? (
                                <div className="space-y-2">
                                    <Link
                                        href="/dashboard/settings"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                                        Settings
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            signOut();
                                        }}
                                        className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-[#EF4444]/80 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                                        Log out
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        signIn('discord', { callbackUrl: '/dashboard' });
                                    }}
                                    className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold text-[#0B0E14] bg-[#60A5FA] hover:bg-[#93C5FD] transition-colors"
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
