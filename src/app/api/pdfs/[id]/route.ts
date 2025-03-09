import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') ?? undefined;

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

    const pdf = await prisma.pDF.findUnique({
      where: { id },
    })

    if (!pdf) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 })
    }

    if (pdf.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(pdf)
  } catch (error: any) {
    console.error("Error fetching PDF:", error)
    return NextResponse.json({ error: `Error fetching PDF: ${error.message}` }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: RouteContext<{ id: string }>) {
  const { id } = context.params

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

    const pdf = await prisma.pDF.findUnique({
      where: { id },
    })

    if (!pdf) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 })
    }

    if (pdf.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.pDF.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting PDF:", error)
    return NextResponse.json({ error: `Error deleting PDF: ${error.message}` }, { status: 500 })
  }
}
