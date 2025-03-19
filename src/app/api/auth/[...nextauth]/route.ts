    import NextAuth, { NextAuthOptions } from "next-auth";
    import CredentialsProvider from "next-auth/providers/credentials";
    import GoogleProvider from "next-auth/providers/google";
    import bcrypt from "bcryptjs";
    import User from "@/model/User";
    import connect from "@/app/utils/dbConnection";

    export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "text", required: true },
            password: { label: "Password", type: "password", required: true },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials");
            }

            await connect();
            try {
            console.log("--------1")
            const user = await User.findOne({ email: credentials.email });

            if (!user) {
                throw new Error("User not found");
            }

            const isPasswordCorrect = await bcrypt.compare(
                credentials.password,
                user.password
            );

            if (!isPasswordCorrect) {
                throw new Error("Invalid credentials");
            }

            return {
                id: user._id.toString(),
                email: user.email,
                name: user.name || "User",
            };
            } catch (error) {
            console.error("Authorize Error:", error);
            throw new Error("Something went wrong");
            }
        },
        }),

        GoogleProvider({
        clientId: process.env.GOOGLE_ID || "",
        clientSecret: process.env.GOOGLE_SECRET || "",
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
        await connect();

        if (account?.provider === "credentials") {
            return true;
        }

        if (account?.provider === "google" || account?.provider === "github") {
            try {
            const existingUser = await User.findOne({ email: user.email });

            if (!existingUser) {
                const newUser = new User({
                email: user.email,
                name: user.name,
                provider: account.provider,
                });

                await newUser.save();
            }

            return true;
            } catch (err) {
            console.error("Error saving user:", err);
            return false;
            }
        }

        return false;
        },

        async session({ session, token }) {
            interface CustomUser {
                id: string;
                email: string;
                name?: string;
            }
        if (token?.id) {
            session.user = {
                ...(session.user as CustomUser),
            // id: String(token.id),
            email: token.email,
            name: token.name,
            };
        }
        return session;
        },

        async jwt({ token, user }) {
        if (user) {
            token.id = user.id as String;
            token.email = user.email;
            token.name = user.name;
        }
        return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    };

    const handler = NextAuth(authOptions);
    export { handler as GET, handler as POST };
    