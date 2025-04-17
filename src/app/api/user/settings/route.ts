import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET - Obter configurações do usuário
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { settings: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Se o usuário não tiver configurações, crie configurações padrão
    if (!user.settings) {
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId: user.id,
          darkMode: true,
          language: "pt-BR",
          emailNotifications: true,
          pushNotifications: true,
          twoFactorAuth: false,
          autoDeleteItems: false,
        }
      })

      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(user.settings)
  } catch (error: any) {
    console.error("Erro ao buscar configurações:", error)
    return NextResponse.json({ error: `Erro ao buscar configurações: ${error.message}` }, { status: 500 })
  }
}

// POST - Atualizar configurações do usuário
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

    const data = await req.json()

    // Verificar se o usuário já tem configurações
    const existingSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    })

    let settings

    if (existingSettings) {
      // Atualizar configurações existentes
      settings = await prisma.userSettings.update({
        where: { userId: user.id },
        data: {
          darkMode: data.darkMode !== undefined ? data.darkMode : existingSettings.darkMode,
          language: data.language || existingSettings.language,
          emailNotifications: data.emailNotifications !== undefined ? data.emailNotifications : existingSettings.emailNotifications,
          pushNotifications: data.pushNotifications !== undefined ? data.pushNotifications : existingSettings.pushNotifications,
          twoFactorAuth: data.twoFactorAuth !== undefined ? data.twoFactorAuth : existingSettings.twoFactorAuth,
          autoDeleteItems: data.autoDeleteItems !== undefined ? data.autoDeleteItems : existingSettings.autoDeleteItems,
          phone: data.phone !== undefined ? data.phone : existingSettings.phone,
          address: data.address !== undefined ? data.address : existingSettings.address,
          birthdate: data.birthdate !== undefined ? data.birthdate : existingSettings.birthdate,
          secondaryEmails: data.secondaryEmails !== undefined ? data.secondaryEmails : existingSettings.secondaryEmails,
        },
      })
    } else {
      // Criar novas configurações
      settings = await prisma.userSettings.create({
        data: {
          userId: user.id,
          darkMode: data.darkMode !== undefined ? data.darkMode : true,
          language: data.language || "pt-BR",
          emailNotifications: data.emailNotifications !== undefined ? data.emailNotifications : true,
          pushNotifications: data.pushNotifications !== undefined ? data.pushNotifications : true,
          twoFactorAuth: data.twoFactorAuth !== undefined ? data.twoFactorAuth : false,
          autoDeleteItems: data.autoDeleteItems !== undefined ? data.autoDeleteItems : false,
          phone: data.phone,
          address: data.address,
          birthdate: data.birthdate,
          secondaryEmails: data.secondaryEmails || [],
        },
      })
    }

    // Atualizar o nome do usuário se fornecido
    if (data.name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: data.name },
      })
    }

    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    console.error("Erro ao atualizar configurações:", error)
    return NextResponse.json({ error: `Erro ao atualizar configurações: ${error.message}` }, { status: 500 })
  }
}
