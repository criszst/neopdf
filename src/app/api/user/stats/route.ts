import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface MonthlyActivity {
  month: Date
  count: bigint
}

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

    // Contar PDFs por tipo
    const pdfTypeCount = await prisma.pDF.groupBy({
      by: ["fileType"],
      where: { userId: user.id },
      _count: true,
    })

    // Formatar os dados para o gráfico
    const pdfTypes = pdfTypeCount.map((item) => ({
      type: item.fileType,
      count: Number(item._count), // Convertendo BigInt para Number
    }))

    // Contar total de PDFs
    const totalPdfs = Number(
      await prisma.pDF.count({
        where: { userId: user.id },
      })
    )

    // Contar PDFs favoritados
    const starredPdfs = Number(
      await prisma.pDF.count({
        where: {
          userId: user.id,
          isStarred: true,
        },
      })
    )

    // Calcular espaço de armazenamento usado
    const storageUsed = Number(user.storageUsed) || 0
    const storageLimit = Number(user.storageLimit) || 1 // Evita divisão por zero
    const storagePercentage = (storageUsed / storageLimit) * 100

    // Buscar atividades por mês (últimos 6 meses)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyActivities = await prisma.$queryRaw<MonthlyActivity[]>`
      SELECT
        DATE_TRUNC('month', "createdAt") AS month,
        COUNT(*)::bigint AS count -- Força COUNT(*) como bigint
      FROM "PDF"
      WHERE "userId" = ${user.id}
        AND "createdAt" >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC;
    `

    // Criando um array com os últimos 6 meses
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const activityData = Array.from({ length: 6 }).map((_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)

      const monthIndex = date.getMonth()
      const found = monthlyActivities.find((item) => {
        const itemDate = new Date(item.month)
        return itemDate.getMonth() === monthIndex && itemDate.getFullYear() === date.getFullYear()
      })

      return {
        month: months[monthIndex],
        count: found ? Number(found.count) : 0, // Convertendo BigInt para Number
      }
    }).reverse()

    return NextResponse.json({
      totalPdfs,
      starredPdfs,
      pdfTypes,
      storage: {
        used: storageUsed,
        limit: storageLimit,
        percentage: storagePercentage,
      },
      activityData,
    })
  } catch (error: any) {
    console.error("Erro ao buscar estatísticas do usuário:", error)
    return NextResponse.json({ error: `Erro ao buscar estatísticas do usuário: ${error.message}` }, { status: 500 })
  }
}
