'use client';

import { Code2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function WidgetsClient({ userId }: { userId: string }) {
    const [copied, setCopied] = useState(false);
    const widgetUrl = `https://codesync-hub.vercel.app/api/widgets/${userId}.svg`;
    
    const markdownEmbed = `[![CodeSync Stats](${widgetUrl})](https://codesync-hub.vercel.app/dashboard/profile)`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(markdownEmbed);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass-subtle rounded-2xl p-8">
                <h1 className="text-2xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
                    <Code2 className="w-6 h-6 text-[#60A5FA]" /> GitHub Widgets
                </h1>
                <p className="text-white/50 text-sm mb-8">Embed your unified developer stats dynamically on your GitHub README.</p>
                
                {/* Preview Box */}
                <div className="border border-white/10 bg-[#0B0E14] rounded-xl p-8 mb-8 flex items-center justify-center min-h-[200px]">
                    <img 
                        src={widgetUrl} 
                        alt="CodeSync GitHub Widget Preview" 
                        className="max-w-full shadow-2xl rounded-xl border border-white/5"
                    />
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
                        <button 
                            onClick={handleCopy}
                            className="p-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors" 
                            title="Copy to clipboard"
                        >
                            {copied ? <Check className="w-5 h-5 text-[#10B981]" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                    <p className="text-xs text-white/40">Copy and paste this into your GitHub Profile README.md.</p>
                </div>
            </div>
        </div>
    );
}
