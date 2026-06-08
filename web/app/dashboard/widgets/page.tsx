import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Code2, Copy } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WidgetsPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        redirect('/api/auth/signin');
    }

    const userId = session.user.id;
    const widgetUrl = `https://codesync.vercel.app/api/widgets/${userId}.svg`;
    
    const markdownEmbed = `[![CodeSync Stats](${widgetUrl})](https://codesync.vercel.app/dashboard/profile)`;

    return (
        <main className="max-w-4xl mx-auto px-4 py-16">
            <div className="mb-12 animate-reveal stagger-1">
                <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                    <Code2 className="w-8 h-8 text-primary" /> GitHub Widgets
                </h1>
                <p className="text-text-secondary text-lg">Embed your unified developer stats dynamically on your GitHub README.</p>
            </div>

            <div className="bg-[#05070A] border border-border rounded-xl p-8 animate-reveal stagger-2">
                <h3 className="text-xl font-bold text-white mb-6">Your Live SVG Embed</h3>
                
                {/* Preview Box */}
                <div className="border border-border bg-surface rounded-lg p-8 mb-8 flex items-center justify-center min-h-[200px]">
                    <div className="text-center text-text-secondary border border-dashed border-border/50 rounded-lg p-6 w-full">
                        <p className="text-sm font-mono mb-2">&lt;!-- Preview of SVG --&gt;</p>
                        <p>This will be replaced by your actual dynamic SVG image.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider">
                        Markdown Embed Code
                    </label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            readOnly 
                            value={markdownEmbed}
                            className="flex-1 bg-surface border border-border p-3 rounded-lg text-text-primary font-mono text-sm focus:outline-none"
                        />
                        <button className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary/20 transition-colors" title="Copy to clipboard">
                            <Copy className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-text-secondary">Copy and paste this into your GitHub Profile README.md.</p>
                </div>
            </div>
        </main>
    );
}
