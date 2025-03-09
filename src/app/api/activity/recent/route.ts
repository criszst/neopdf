import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
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

    // Buscar as atividades recentes do usuário
    const activities = await prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        pdf: {
          select: {
            id: true,
            name: true,
            fileType: true,
          },
        },
      },
    })

    return NextResponse.json(activities)
  } catch (error: any) {
    console.error("Erro ao buscar atividades recentes:", error)
    return NextResponse.json({ error: `Erro ao buscar atividades recentes: ${error.message}` }, { status: 500 })
  }
}

