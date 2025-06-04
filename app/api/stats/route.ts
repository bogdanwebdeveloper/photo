import { NextResponse } from "next/server"
import { getPhotoStats } from "@/lib/photo-utils"
import { testConnection } from "@/lib/database"

export async function GET() {
  try {
    // Test database connection first
    const isConnected = await testConnection()
    if (!isConnected) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const stats = await getPhotoStats()
    return NextResponse.json({
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
