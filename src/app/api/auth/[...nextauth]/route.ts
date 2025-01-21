import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { Users } from "@/lib/db/schema/user/Users";
import { eq } from "drizzle-orm";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Missing Google OAuth Credentials');
}

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    // Check if user exists
                    const existingUser = await db.query.Users.findFirst({
                        where: eq(Users.email, user.email!)
                    });

                    if (!existingUser) {
                        // Create new user if doesn't exist
                        await db.insert(Users).values({
                            email: user.email!,
                            firstName: user.name?.split(' ')[0] || '',
                            lastName: user.name?.split(' ')[1] || '',
                            role: 'user',
                            // No password needed for OAuth users
                        });
                        console.log('Created new user from Google sign-in:', user.email);
                    }

                    return true;
                } catch (error) {
                    console.error("Error during Google sign in:", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            // Add user data to session
            if (session.user?.email) {
                const dbUser = await db.query.Users.findFirst({
                    where: eq(Users.email, session.user.email)
                });

                if (dbUser) {
                    session.user.id = dbUser.id;
                    session.user.role = dbUser.role;
                }
            }
            return session;
        },
    },
    pages: {
        signIn: '/register',
    },
});

export { handler as GET, handler as POST }; 