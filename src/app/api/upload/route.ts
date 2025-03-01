import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file = data.get('file') as unknown as File
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileId = `${uuidv4()}.pdf`
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    const filePath = path.join(uploadDir, fileId)
    
    await writeFile(filePath, buffer)
    console.log(`File saved at: ${filePath}`)
    
    return NextResponse.json({ 
      success: true, 
      fileId,
      path: `/uploads/${fileId}`
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload file' 
    }, { status: 500 })
  }
}