"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { PhotoGallery } from "@/components/photo-gallery"

export default function AlbumPage({ params }: { params: { albumSlug: string } }) {
  const router = useRouter()
  const [photos, setPhotos] = useState([])
  const [albumTitle, setAlbumTitle] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlbumPhotos = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/albums/${params.albumSlug}`)
        const data = await response.json()
        setPhotos(data.photos || [])
        // Convert slug to readable title
        setAlbumTitle(params.albumSlug.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()))
      } catch (error) {
        console.error("Error fetching album photos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlbumPhotos()
  }, [params.albumSlug])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{albumTitle}</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : photos.length > 0 ? (
          <PhotoGallery photos={photos} targetRowHeight={250} margin={8} />
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No photos found in this album</p>
          </div>
        )}
      </div>
    </div>
  )
}
