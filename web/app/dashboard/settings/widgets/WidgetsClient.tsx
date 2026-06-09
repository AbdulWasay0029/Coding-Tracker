import { Code2, Copy } from 'lucide-react';

export default function WidgetsClient({ userId }: { userId: string }) {
    const widgetUrl = `https://codesync-hub.vercel.app/api/widgets/${userId}.svg`;
    
    const markdownEmbed = `[![CodeSync Stats](${widgetUrl})](https://codesync-hub.vercel.app/dashboard/profile)`;

    return (
        <div className="space-y-6">
            <div className="glass-subtle rounded-2xl p-8">
                <h1 className="text-2xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
                    <Code2 className="w-6 h-6 text-[#60A5FA]" /> GitHub Widgets
                </h1>
                <p className="text-white/50 text-sm mb-8">Embed your unified developer stats dynamically on your GitHub README.</p>
                
                {/* Preview Box */}
                <div className="border border-white/10 bg-[#0B0E14] rounded-xl p-8 mb-8 flex items-center justify-center min-h-[200px]">
                    <div className="text-center text-white/50 border border-dashed border-white/20 rounded-xl p-6 w-full">
                        <p className="text-sm font-mono mb-2">&lt;!-- Preview of SVG --&gt;</p>
                        <p>This will be replaced by your actual dynamic SVG image.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-bold text-white/70 uppercase tracking-wider">
                        Markdown Embed Code
                    </label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            readOnly 
                            value={markdownEmbed}
                            className="flex-1 bg-[#0B0E14] border border-white/10 p-3 rounded-xl text-white font-mono text-sm focus:outline-none"
                        />
                        <button className="p-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors" title="Copy to clipboard">
                            <Copy className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-white/40">Copy and paste this into your GitHub Profile README.md.</p>
                </div>
            </div>
        </div>
    );
}
