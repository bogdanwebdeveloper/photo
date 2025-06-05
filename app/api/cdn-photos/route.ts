import { NextResponse } from "next/server"

const CDN_BASE = "https://cdn.bogdanpics.com"
const PHOTOS_API = `${CDN_BASE}/list-files.php?path=/photos/`
const ALBUMS_DIR_API = `${CDN_BASE}/list-directories.php?path=/albums`
const ALBUMS_FILES_API = `${CDN_BASE}/list-files.php?path=/albums/`

export async function GET() {
  try {
    // Pozele pentru gridul principal
    const categoriesRes = await fetch(`${CDN_BASE}/list-directories.php?path=/photos`)
    const categoriesData = await categoriesRes.json()
    const categories: string[] = categoriesData.directories || []

    const gridPhotos: { src: string; category: string }[] = []
    for (const category of categories) {
      const filesRes = await fetch(PHOTOS_API + encodeURIComponent(category))
      const filesData = await filesRes.json()
      const files: string[] = filesData.files || []
      files.forEach((file) => {
        gridPhotos.push({
          src: `${CDN_BASE}/photos/${encodeURIComponent(category)}/${encodeURIComponent(file)}`,
          category,
        })
      })
    }

    // Albumele (toate pozele din fiecare album)
    const albumsRes = await fetch(ALBUMS_DIR_API)
    const albumsData = await albumsRes.json()
    const albumFolders: string[] = albumsData.directories || []

    const albums: Record<string, { src: string; album: string }[]> = {}
    for (const album of albumFolders) {
      const filesRes = await fetch(ALBUMS_FILES_API + encodeURIComponent(album))
      const filesData = await filesRes.json()
      const files: string[] = filesData.files || []
      albums[album] = files.map((file) => ({
        src: `${CDN_BASE}/albums/${encodeURIComponent(album)}/${encodeURIComponent(file)}`,
        album,
      }))
    }

    return NextResponse.json({ gridPhotos, albums })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch CDN images" }, { status: 500 })
  }
}