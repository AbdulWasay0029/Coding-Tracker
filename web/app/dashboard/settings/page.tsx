import Link from 'next/link';
import { Settings, ShieldAlert, LayoutTemplate, BookOpen, Terminal, ChevronRight } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SettingsHubPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect('/');
    }

    const settingsLinks = [
        {
            title: 'Profile & Account',
            description: 'Manage your connected platforms and tokens.',
            icon: <Settings className="w-6 h-6 text-primary" />,
            href: '/dashboard',
            tag: 'General'
        },
        {
            title: 'Profile Widgets',
            description: 'Generate dynamic images of your stats for your GitHub README.',
            icon: <LayoutTemplate className="w-6 h-6 text-indigo-400" />,
            href: '/dashboard/settings/widgets',
            tag: 'Integrations'
        },
        {
            title: 'Documentation',
            description: 'Learn about all bot commands and setup guides.',
            icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
            href: '/dashboard/settings/docs',
            tag: 'Resources'
        },
        {
            title: 'Admin Portal',
            description: 'Manage server configurations and data exports. (Admin only)',
            icon: <ShieldAlert className="w-6 h-6 text-warning" />,
            href: '#', // Placeholder for future admin portal
            tag: 'Restricted'
        }
    ];

    return (
        <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
            <div className="mb-12 animate-reveal stagger-1 flex flex-col items-center md:items-start border-b border-white/5 pb-8 relative">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[100px] bg-[#60A5FA] opacity-[0.05] blur-[50px] rounded-full pointer-events-none" />
                <h1 className="text-3xl md:text-4xl font-bold text-white/95 tracking-tight flex items-center gap-3 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/20">
                        <Terminal className="w-6 h-6 text-[#60A5FA]" />
                    </div>
                    Settings Hub
                </h1>
                <p className="text-white/60 mt-4 text-lg max-w-2xl text-center md:text-left relative z-10">
                    Manage your unified developer identity, configure integrations, and explore platform capabilities.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-reveal stagger-2">
                {settingsLinks.map((link, i) => (
                    <Link href={link.href} key={link.title} className={`block group ${i === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}>
                        <div className="glass-subtle rounded-2xl p-8 h-full hover:bg-[#1A1D24]/80 hover:border-[#60A5FA]/30 transition-all duration-300 hover:shadow-[0_8px_32px_-8px_rgba(96,165,250,0.2)] relative overflow-hidden flex flex-col">
                            {/* Accent Glow on Hover */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#60A5FA] opacity-0 group-hover:opacity-10 blur-[50px] rounded-full transition-opacity duration-500" />
                            
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-[#0B0E14]/60 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-[#60A5FA]/30 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.2)] transition-all duration-300 relative z-10">
                                    {link.icon}
                                </div>
                                <div className="bg-[#0B0E14]/60 border border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-mono text-[#60A5FA] uppercase tracking-wider relative z-10">
                                    {link.tag}
                                </div>
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-end relative z-10">
                                <h2 className="text-xl md:text-2xl font-bold text-white/95 mb-3 flex items-center justify-between group-hover:text-[#60A5FA] transition-colors">
                                    {link.title}
                                    <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-[#60A5FA] group-hover:translate-x-2 transition-all duration-300" />
                                </h2>
                                <p className="text-white/50 text-sm md:text-base leading-relaxed">
                                    {link.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
