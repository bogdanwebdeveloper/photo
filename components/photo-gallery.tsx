"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export const PhotoGallery = ({ photos, targetRowHeight = 200, margin = 4, onPhotoClick = null }) => {
  const [containerWidth, setContainerWidth] = useState(0)
  const [layoutPhotos, setLayoutPhotos] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  useEffect(() => {
    if (containerWidth > 0 && photos.length > 0) {
      const layout = calculateLayout(photos, containerWidth, targetRowHeight, margin)
      setLayoutPhotos(layout.photos)
    } else {
      setLayoutPhotos([])
    }
  }, [photos, containerWidth, targetRowHeight, margin])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === "Escape") {
          setLightboxIndex(null)
        } else if (e.key === "ArrowLeft") {
          setLightboxIndex((prev) => (prev !== null ? (prev > 0 ? prev - 1 : photos.length - 1) : null))
        } else if (e.key === "ArrowRight") {
          setLightboxIndex((prev) => (prev !== null ? (prev < photos.length - 1 ? prev + 1 : 0) : null))
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxIndex, photos.length])

  const calculateLayout = (photos, containerWidth, targetRowHeight, margin) => {
    const rows = []
    let currentRow = []
    let currentRowWidth = 0

    photos.forEach((photo, index) => {
      const aspectRatio = photo.width / photo.height
      const scaledWidth = targetRowHeight * aspectRatio

      if (currentRowWidth + scaledWidth + margin > containerWidth && currentRow.length > 0) {
        rows.push([...currentRow])
        currentRow = [{ ...photo, index }]
        currentRowWidth = scaledWidth
      } else {
        currentRow.push({ ...photo, index })
        currentRowWidth += scaledWidth + (currentRow.length > 1 ? margin : 0)
      }
    })

    if (currentRow.length > 0) {
      rows.push(currentRow)
    }

    const layoutPhotos = []
    let currentTop = 0

    rows.forEach((row) => {
      const totalMargins = (row.length - 1) * margin
      const availableWidth = containerWidth - totalMargins
      const totalAspectRatio = row.reduce((sum, photo) => sum + photo.width / photo.height, 0)
      const rowHeight = availableWidth / totalAspectRatio

      let currentLeft = 0

      row.forEach((photo) => {
        const aspectRatio = photo.width / photo.height
        const photoWidth = rowHeight * aspectRatio

        layoutPhotos.push({
          ...photo,
          left: currentLeft,
          top: currentTop,
          width: photoWidth,
          height: rowHeight,
        })

        currentLeft += photoWidth + margin
      })

      currentTop += rowHeight + margin
    })

    return { photos: layoutPhotos, containerHeight: currentTop - margin }
  }

  const handlePhotoClick = (index) => {
    if (onPhotoClick) {
      onPhotoClick(index)
    } else {
      setLightboxIndex(index)
    }
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev !== null ? (prev > 0 ? prev - 1 : photos.length - 1) : null))
  }

  const goToNext = () => {
    setLightboxIndex((prev) => (prev !== null ? (prev < photos.length - 1 ? prev + 1 : 0) : null))
  }

  if (photos.length === 0) {
    return <div className="text-center py-10">No photos found</div>
  }

  return (
    <>
      <div ref={containerRef} className="relative w-full">
        {layoutPhotos.map((photo) => (
          <div
            key={photo.id}
            className="absolute group cursor-pointer"
            style={{
              left: photo.left,
              top: photo.top,
              width: photo.width,
              height: photo.height,
            }}
            onClick={() => handlePhotoClick(photo.index)}
          >
            <Card className="w-full h-full overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0 w-full h-full">
                <img
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </CardContent>
            </Card>
          </div>
        ))}
        <div
          style={{
            height: layoutPhotos.length > 0 ? Math.max(...layoutPhotos.map((p) => p.top + p.height)) + "px" : "0px",
          }}
        />
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Main Image */}
            <img
              src={photos[lightboxIndex]?.src || "/placeholder.svg"}
              alt={photos[lightboxIndex]?.alt || "Photo"}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {lightboxIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
