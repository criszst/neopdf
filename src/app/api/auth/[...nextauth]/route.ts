import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GoogleProvider from "next-auth/providers/google"

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma), // Adicionando o Prisma
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET, // Definir a chave secreta

  callbacks: {
    async session({ session, user }: { session, user: { id: string } }) {
      session.user.id = user.id // Adiciona o ID do usuário à sessão
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
