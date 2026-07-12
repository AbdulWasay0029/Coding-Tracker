import NextAuth, { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';

async function refreshDiscordToken(token: any) {
    try {
        if (token.accessToken === 'mock-dev-access-token') return token;
        const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID || '',
                client_secret: process.env.DISCORD_CLIENT_SECRET || '',
                grant_type: 'refresh_token',
                refresh_token: token.refreshToken,
            }),
        });

        const tokens = await response.json();
        if (!response.ok) throw tokens;

        return {
            ...token,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token ?? token.refreshToken,
            accessTokenExpires: Date.now() + tokens.expires_in * 1000,
        };
    } catch (error) {
        console.error('Error refreshing discord token', error);
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID || '',
            clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
            authorization: { params: { scope: 'identify guilds' } },
        }),
        CredentialsProvider({
            id: 'dev-bypass',
            name: '⚡ Local Dev Bypass (Test Mode)',
            credentials: {},
            async authorize() {
                // Only allow this when running locally on localhost
                if (process.env.NODE_ENV === 'production') return null;
                return {
                    id: '123456789012345678',
                    name: 'Local Dev Admin',
                    email: 'admin@codesync.local',
                    image: 'https://cdn.discordapp.com/embed/avatars/0.png'
                };
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || 'dev-secret-key-for-local-testing-only-12345',
    callbacks: {
        async jwt({ token, account, user }) {
            // Initial sign in
            if (account) {
                if (account.provider === 'dev-bypass') {
                    token.accessToken = 'mock-dev-access-token';
                    token.sub = user?.id || '123456789012345678';
                    token.accessTokenExpires = Date.now() + 604800000;
                    return token;
                }
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                // Discord tokens usually expire in 604800 seconds (7 days)
                token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 604800000;
                return token;
            }

            // Return previous token if the access token has not expired yet
            // Give a 5 minute buffer before expiry
            if (Date.now() < (token.accessTokenExpires as number) - 5 * 60 * 1000) {
                return token;
            }

            // Access token has expired (or is about to), try to update it
            return await refreshDiscordToken(token);
        },
        async session({ session, token }: { session: any; token: any }) {
            session.accessToken = token.accessToken;
            session.error = token.error;
            if (session.user) {
                // Ensure the user id is stored in the session
                session.user.id = token.sub;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
