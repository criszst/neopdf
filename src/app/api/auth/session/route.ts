import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  return NextResponse.json(session)
}

