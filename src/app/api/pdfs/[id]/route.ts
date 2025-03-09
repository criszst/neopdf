import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Função para extrair o `id` da URL
function extractIdFromUrl(url: string): string | null {
  // Divide a URL em partes usando '/' como delimitador
  const parts = url.split('/')
  // O `id` é o último segmento da URL
  return parts[parts.length - 1] || null
}

export async function GET(req: NextRequest) {
  const id = extractIdFromUrl(req.url)

  if (!id) {
    return NextResponse.json({ error: "Missing PDF ID" }, { status: 400 })
  }

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
    console.error("Error buscando o PDF:", error)
    return NextResponse.json({ error: `Erro buscando o PDF: ${error.message}` }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = extractIdFromUrl(req.url)

  if (!id) {
    return NextResponse.json({ error: "Missing PDF ID" }, { status: 400 })
  }

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User não encontrado" }, { status: 404 })
    }

    const pdf = await prisma.pDF.findUnique({
      where: { id },
    })

    if (!pdf) {
      return NextResponse.json({ error: "PDF não encontrado" }, { status: 404 })
    }

    if (pdf.userId !== user.id) {
      return NextResponse.json({ error: "User não possui esse PDF" }, { status: 403 })
    }

    await prisma.pDF.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Erro ao deletar o PDF:", error)
    return NextResponse.json({ error: `Erro ao deletar o PDF: ${error.message}` }, { status: 500 })
  }
}
