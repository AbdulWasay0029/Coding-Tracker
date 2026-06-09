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
        <main className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-10 animate-reveal stagger-1 border-b border-border pb-6">
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <Terminal className="w-8 h-8 text-primary" /> Settings & Configuration
                </h1>
                <p className="text-text-secondary mt-2 text-lg">Manage your developer identity and explore integrations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-reveal stagger-2">
                {settingsLinks.map((link) => (
                    <Link href={link.href} key={link.title} className="block group">
                        <div className="bg-surface border border-border rounded-xl p-6 h-full hover:border-primary/50 hover:bg-surface/80 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] relative overflow-hidden">
                            <div className="absolute top-4 right-4 bg-background border border-border px-2 py-1 rounded text-[10px] font-mono text-text-tertiary uppercase tracking-wider">
                                {link.tag}
                            </div>
                            
                            <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                {link.icon}
                            </div>
                            
                            <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
                                {link.title}
                                <ChevronRight className="w-5 h-5 text-text-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </h2>
                            <p className="text-text-secondary text-sm">
                                {link.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
