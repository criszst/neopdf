import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const pdfs = await prisma.pDF.findMany({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      }
    })

    return NextResponse.json(pdfs)
  } catch (error: any) {
    console.error("Error fetching PDFs:", error)
    return NextResponse.json({ error: `Error fetching PDFs: ${error.message}` }, { status: 500 })
  }
}

