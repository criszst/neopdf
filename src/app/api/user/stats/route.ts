import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface MonthlyActivity {
  month: string;
  year: string;
  count: number;
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
      count: item._count,
    }))

    // Contar total de PDFs
    const totalPdfs = await prisma.pDF.count({
      where: { userId: user.id },
    })

    // Contar PDFs favoritados
    const starredPdfs = await prisma.pDF.count({
      where: {
        userId: user.id,
        isStarred: true,
      },
    })

    // Calcular espaço de armazenamento usado
    const storageUsed = user.storageUsed
    const storageLimit = user.storageLimit
    const storagePercentage = (storageUsed / storageLimit) * 100

    // Buscar atividades por mês (últimos 6 meses)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyActivities = await prisma.$queryRaw<MonthlyActivity[]>`
      SELECT
        DATE_TRUNC('month', "createdAt") AS month,
        DATE_TRUNC('year', "createdAt") AS year,
        COUNT(*) AS count
      FROM "Activity"
      WHERE "userId" = ${user.id}
        AND "createdAt" >= ${sixMonthsAgo}
      GROUP BY month, year
      ORDER BY month DESC;
    `

    // Formatar os dados para o gráfico
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const activityData = Array(6)
      .fill(0)
      .map((_, i) => {
        const month = (currentMonth - i + 12) % 12
        const year = currentMonth - i < 0 ? currentYear - 1 : currentYear

        const found = monthlyActivities.find((item) => item.month === `${year}-${month + 1}`)

        return {
          month: months[month],
          count: found ? found.count : 0,
        }
      })
      .reverse()

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
