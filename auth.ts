import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import {prisma}  from "./server" 
import Google from "next-auth/providers/google"
export const { handlers, signIn, signOut, auth } = NextAuth({
  
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers:
        [Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
          
        })],
  secret: process.env.NEXTAUTH_SECRET,

})