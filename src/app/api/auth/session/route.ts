import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)
  return NextResponse.json(session)
}

