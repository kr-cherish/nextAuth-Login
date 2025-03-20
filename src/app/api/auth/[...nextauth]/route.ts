import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import User from "@/model/User"; // Ensure correct path
import connect from "@/app/utils/dbConnection";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { DefaultSession } from "next-auth";
// ✅ Define Custom User Interface
interface CustomUser {
  id: string;
  email: string;
  name?: string;
  age?: number;
  mobileNumber?: string;
  gender?: string;
}

// ✅ Define Custom Token Interface
interface CustomToken extends JWT {
  id: string;
  email?: string;
  name?: string;
  age?: number;
  mobileNumber?: string;
  gender?: string;
}  

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
            age: user.age ?? null,
            mobileNumber: user.mobileNumber ?? null,
            gender: user.gender ?? null,
          } as CustomUser;
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

      if (account?.provider === "google") {
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
      if (token?.id) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          age: token.age ?? null, 
          mobileNumber: token.mobileNumber ?? null, 
          gender: token.gender ?? null, 
        } as CustomUser;
      }
      return session;
    },

    async JWT({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.age = user.age;
        token.mobileNumber = user.mobileNumber
        token.gender = user.gender
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
