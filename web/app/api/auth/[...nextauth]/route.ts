import NextAuth, { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID || '',
            clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
            authorization: { params: { scope: 'identify guilds' } },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string | undefined;
            if (session.user) {
                // Ensure the user id is stored in the session
                session.user.id = token.sub as string;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
