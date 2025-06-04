import { NextResponse } from "next/server"
import { recordPhotoView } from "@/lib/photo-utils"
import { headers } from "next/headers"

export async function POST(request: Request, { params }: { params: { photoId: string } }) {
  try {
    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    await recordPhotoView(params.photoId, ipAddress, userAgent)

    return NextResponse.json({
      success: true,
      photoId: params.photoId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Error recording view for photo ${params.photoId}:`, error)
    // Return success even if analytics fail
    return NextResponse.json({
      success: true,
      photoId: params.photoId,
      error: "Analytics recording failed",
    })
  }
}
