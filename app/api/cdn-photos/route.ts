import { NextResponse } from "next/server"

const CDN_BASE = "https://cdn.bogdanpics.com"
const PHOTOS_API = `${CDN_BASE}/list-files.php?path=/photos/`

export async function GET() {
  try {
    // Doar pozele pentru gridul principal (din /photos)
    const categoriesRes = await fetch(`${CDN_BASE}/list-directories.php?path=/photos`)
    const categoriesData = await categoriesRes.json()
    const categories: string[] = categoriesData.directories || []

    const photos: { src: string; category: string }[] = []
    for (const category of categories) {
      const filesRes = await fetch(PHOTOS_API + encodeURIComponent(category))
      const filesData = await filesRes.json()
      const files: string[] = filesData.files || []
      files.forEach((file) => {
        photos.push({
          src: `${CDN_BASE}/photos/${encodeURIComponent(category)}/${encodeURIComponent(file)}`,
          category,
        })
      })
    }

    return NextResponse.json({ photos })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch CDN images" }, { status: 500 })
  }
}