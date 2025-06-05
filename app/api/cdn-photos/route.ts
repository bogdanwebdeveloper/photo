import { NextResponse } from "next/server"

const CDN_BASE = "https://cdn.bogdanpics.com"
const DIR_API = `${CDN_BASE}/list-directories.php?path=/photos`
const FILES_API = `${CDN_BASE}/list-files.php?path=/photos/`

export async function GET() {
  try {
    // Get all categories
    const dirRes = await fetch(DIR_API);
    const dirData = await dirRes.json();
    const categories: string[] = dirData.directories || [];

    // Get all images in each category
    const allImages: { src: string; category: string }[] = [];
    for (const category of categories) {
      const filesRes = await fetch(FILES_API + encodeURIComponent(category));
      const filesData = await filesRes.json();
      const files: string[] = filesData.files || [];
      files.forEach((file) => {
        allImages.push({
          src: `${CDN_BASE}/photos/${encodeURIComponent(category)}/${encodeURIComponent(file)}`,
          category,
        });
      });
    }

    return NextResponse.json({ photos: allImages });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch CDN images" }, { status: 500 });
  }
}