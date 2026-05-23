import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
    title: 'CodeSync | Competitive Programming Tracker',
    description: 'Track your competitive programming progress seamlessly across LeetCode, Codeforces, and more.',
    icons: {
        icon: '/favicon.svg',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
                <Providers>
                    <Navbar />
                    <div className="flex-1">
                        {children}
                    </div>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
