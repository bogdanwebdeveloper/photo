import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"

export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), "app", "api", "cdn-photos", "photos.json")
    const data = await fs.readFile(jsonPath, "utf-8")
    const photos = JSON.parse(data)
    return NextResponse.json({ photos })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch CDN images" }, { status: 500 })
  }
}