import { NextResponse } from "next/server"
import { getPhotos } from "@/lib/photo-utils"
import { testConnection } from "@/lib/database"

export async function GET() {
  try {
    // Test database connection first
    const isConnected = await testConnection()
    if (!isConnected) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const photos = await getPhotos()
    return NextResponse.json({
      photos,
      count: photos.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching photos:", error)
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 })
  }
}
