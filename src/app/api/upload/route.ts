import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/auth"
import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { calculateFileHash } from "@/lib/hash"

const prisma = new PrismaClient()

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: NextRequest) {
  try {
    // Obter sessão do usuário
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter usuário do banco de dados
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Calcular o hash do arquivo
    const fileHash = await calculateFileHash(file)
    const fileSize = file.size

    // Verificar se já existe um PDF com o mesmo hash
    const existingPdf = await prisma.pDF.findFirst({
      where: {
        fileHash,
        // Opcional: verificar se o arquivo pertence ao mesmo usuário
        // userId: user.id
      },
    })

    // Se o arquivo já existe, retorne a referência existente
    if (existingPdf) {
      console.log(`Arquivo duplicado encontrado: ${existingPdf.id}`)

      return NextResponse.json({
        success: true,
        id: existingPdf.id,
        name: existingPdf.name,
        url: `/pdf/${existingPdf.id}`,
        isDuplicate: true,
      })
    }

    // Se o arquivo não existe, continue com o upload
    // Gerar UUID para o arquivo
    const fileId = uuidv4()

    // Converter arquivo para buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = file.name
    const s3Key = `uploads/${fileId}/${fileName}`

    // Verificar se o bucket está definido
    if (!process.env.AWS_BUCKET_NAME) {
      console.error("AWS_BUCKET_NAME não está definido")
      return NextResponse.json({ error: "Configuração do S3 incompleta" }, { status: 500 })
    }

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: file.type || "application/pdf",
    }

    await s3.send(new PutObjectCommand(uploadParams))

    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`

    // Salvar metadados do PDF no banco de dados, incluindo o hash
    const pdf = await prisma.pDF.create({
      data: {
        id: fileId,
        name: fileName,
        s3Key,
        s3Url,
        fileHash,
        fileSize,
        userId: user.id,
      },
    })

    return NextResponse.json({
      success: true,
      id: pdf.id,
      name: pdf.name,
      url: `/pdf/${pdf.id}`,
      isDuplicate: false,
    })
  } catch (error: any) {
    console.error("Erro ao enviar para S3:", error)
    return NextResponse.json(
      {
        error: `Erro ao enviar arquivo: ${error.message || "Erro desconhecido"}`,
      },
      { status: 500 },
    )
  }
}

