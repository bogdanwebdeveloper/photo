import { NextResponse } from "next/server"
import { getAvailableCategories } from "@/lib/photo-utils"
import { testConnection } from "@/lib/database"

export async function GET() {
  try {
    // Test database connection first
    const isConnected = await testConnection()
    if (!isConnected) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const categories = await getAvailableCategories()
    return NextResponse.json({
      categories,
      count: categories.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
