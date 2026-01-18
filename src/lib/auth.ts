import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/sign-in"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user || !user.passwordHash) {
          return null;
        }
        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existing = await prisma.user.findUnique({ where: { email: user.email } });
        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email,
              oauthProvider: "google",
              profile: {
                create: {
                  displayName: user.name ?? user.email,
                  username: user.email.split("@")[0],
                  timezone: "America/Toronto",
                  tags: [],
                  skillsOffered: [],
                  skillsWanted: [],
                  goals: []
                }
              },
              preferences: {
                create: {
                  intentPrefs: [],
                  tagPrefs: [],
                  notificationPrefs: ["messages", "pods"]
                }
              }
            }
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "USER";
      }
      if (!token.role && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        token.role = dbUser?.role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "USER";
      }
      return session;
    }
  }
};

export type SessionUser = {
  id: string;
  email?: string | null;
  role: string;
};
