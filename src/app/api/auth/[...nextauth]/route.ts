import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
          isVerified: user.isVerified,
          isPremium: user.isPremium
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        })

        if (!existingUser) {
          const baseUsername = user.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_")
          const randomSuffix = Math.random().toString(36).substring(7)
          const username = `${baseUsername}_${randomSuffix}`
          
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "User",
              image: user.image,
              username: username,
            }
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! }
        })
        token.id = dbUser?.id || user.id
        token.username = dbUser?.username || (user as any).username
        token.isVerified = dbUser?.isVerified || false
        token.isPremium = dbUser?.isPremium || false
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.isVerified = token.isVerified as boolean
        session.user.isPremium = token.isPremium as boolean
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
})
