import { NextResponse } from "next/server"
import { getAlbums } from "@/lib/photo-utils"
import { testConnection } from "@/lib/database"

export async function GET() {
  try {
    // Test database connection first
    const isConnected = await testConnection()
    if (!isConnected) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const albums = await getAlbums()
    return NextResponse.json({
      albums,
      count: albums.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching albums:", error)
    return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 })
  }
}
