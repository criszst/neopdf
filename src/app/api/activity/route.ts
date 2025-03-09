import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const { type, pdfId, details } = await req.json()

    // Validar tipo de atividade
    if (!["UPLOAD", "VIEW", "DOWNLOAD", "DELETE", "STAR", "UNSTAR", "SHARE"].includes(type)) {
      return NextResponse.json({ error: "Tipo de atividade inválido" }, { status: 400 })
    }

    // Se a atividade está relacionada a um PDF, verificar se o PDF existe
    if (pdfId) {
      const pdf = await prisma.pDF.findUnique({
        where: { id: pdfId },
      })

      if (!pdf) {
        return NextResponse.json({ error: "PDF não encontrado" }, { status: 404 })
      }

      // Verificar se o usuário tem acesso ao PDF
      if (pdf.userId !== user.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
      }

      // Atualizar estatísticas do PDF
      if (type === "VIEW") {
        await prisma.pDF.update({
          where: { id: pdfId },
          data: {
            viewCount: { increment: 1 },
            lastViewed: new Date(),
          },
        })
      } else if (type === "STAR") {
        await prisma.pDF.update({
          where: { id: pdfId },
          data: { isStarred: true },
        })
      } else if (type === "UNSTAR") {
        await prisma.pDF.update({
          where: { id: pdfId },
          data: { isStarred: false },
        })
      }
    }

    // Registrar a atividade
    const activity = await prisma.activity.create({
      data: {
        type,
        details,
        userId: user.id,
        pdfId,
      },
    })

    return NextResponse.json({ success: true, activity })
  } catch (error: any) {
    console.error("Erro ao registrar atividade:", error)
    return NextResponse.json({ error: `Erro ao registrar atividade: ${error.message}` }, { status: 500 })
  }
}

