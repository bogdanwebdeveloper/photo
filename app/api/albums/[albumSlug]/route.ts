import { NextResponse } from "next/server"
import { getAlbumPhotos } from "@/lib/photo-utils"

export async function GET(request: Request, { params }: { params: { albumSlug: string } }) {
  try {
    // Test database connection first
    // const isConnected = await testConnection()
    // if (!isConnected) {
    //   return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    // }

    const albumSlug = params.albumSlug
    const photos = await getAlbumPhotos(albumSlug)

    return NextResponse.json({
      photos,
      count: photos.length,
      albumSlug,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Error fetching album ${params.albumSlug}:`, error)
    return NextResponse.json({ error: "Failed to fetch album photos" }, { status: 500 })
  }
}
