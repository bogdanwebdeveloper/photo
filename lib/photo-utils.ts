import { cache } from "react"
import { queryRows, queryRow } from "./database"

// IONOS CDN Configuration
const IONOS_CDN_URL = "https://cdn.bogdanpics.com" // Your CDN subdomain
const PHOTOS_BASE_PATH = "/photos"
const ALBUMS_BASE_PATH = "/albums"

// Define photo categories in English (no diacritics issues)
export const PHOTO_CATEGORIES = ["All", "Nature", "Portraits", "Street", "Architecture", "Travel", "Events"]

// Interface for photo objects
interface Photo {
  id: string
  src: string
  width: number
  height: number
  alt: string
  title?: string
  dateAdded: Date
  category: string
  tags?: string[]
  isFeature?: boolean
}

// Interface for album objects
interface Album {
  id: string
  title: string
  description?: string
  coverImage: string
  photoCount: number
  path: string
  slug: string
}

// Generate CDN URL for photos
const generatePhotoUrl = (category: string, filename: string): string => {
  return `${IONOS_CDN_URL}${PHOTOS_BASE_PATH}/${encodeURIComponent(category)}/${encodeURIComponent(filename)}`
}

// Generate CDN URL for album photos
const generateAlbumPhotoUrl = (albumSlug: string, filename: string): string => {
  return `${IONOS_CDN_URL}${ALBUMS_BASE_PATH}/${encodeURIComponent(albumSlug)}/${encodeURIComponent(filename)}`
}

// Get all photos from database
export const getPhotos = cache(async (): Promise<Photo[]> => {
  try {
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(pt.name) as tags
      FROM photos p
      LEFT JOIN photo_tag_relations ptr ON p.id = ptr.photo_id
      LEFT JOIN photo_tags pt ON ptr.tag_id = pt.id
      WHERE p.status = 'active'
      GROUP BY p.id
      ORDER BY p.is_featured DESC, p.sort_order ASC, p.created_at DESC
    `

    const rows = await queryRows(query)

    return rows.map((row: any) => ({
      id: row.id.toString(),
      src: generatePhotoUrl(row.category, row.filename),
      width: row.width,
      height: row.height,
      alt: row.alt_text || row.title || row.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      title: row.title,
      dateAdded: new Date(row.created_at),
      category: row.category,
      tags: row.tags ? row.tags.split(",") : [],
      isFeature: row.is_featured === 1,
    }))
  } catch (error) {
    console.error("Error loading photos from database:", error)
    return []
  }
})

// Get photos by category
export const getPhotosByCategory = cache(async (category: string): Promise<Photo[]> => {
  try {
    if (category === "All") {
      return await getPhotos()
    }

    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(pt.name) as tags
      FROM photos p
      LEFT JOIN photo_tag_relations ptr ON p.id = ptr.photo_id
      LEFT JOIN photo_tags pt ON ptr.tag_id = pt.id
      WHERE p.status = 'active' AND p.category = ?
      GROUP BY p.id
      ORDER BY p.is_featured DESC, p.sort_order ASC, p.created_at DESC
    `

    const rows = await queryRows(query, [category])

    return rows.map((row: any) => ({
      id: row.id.toString(),
      src: generatePhotoUrl(row.category, row.filename),
      width: row.width,
      height: row.height,
      alt: row.alt_text || row.title || row.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      title: row.title,
      dateAdded: new Date(row.created_at),
      category: row.category,
      tags: row.tags ? row.tags.split(",") : [],
      isFeature: row.is_featured === 1,
    }))
  } catch (error) {
    console.error(`Error loading photos for category ${category}:`, error)
    return []
  }
})

// Get all albums from database
export const getAlbums = cache(async (): Promise<Album[]> => {
  try {
    const query = `
      SELECT 
        a.*,
        p.filename as cover_filename,
        p.category as cover_category,
        COUNT(ap.photo_id) as photo_count
      FROM albums a
      LEFT JOIN photos p ON a.cover_photo_id = p.id
      LEFT JOIN album_photos ap ON a.id = ap.album_id
      WHERE a.status = 'active'
      GROUP BY a.id
      ORDER BY a.is_featured DESC, a.sort_order ASC, a.created_at DESC
    `

    const rows = await queryRows(query)

    return rows.map((row: any) => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      coverImage: row.cover_filename
        ? generateAlbumPhotoUrl(row.slug, row.cover_filename)
        : "/placeholder.svg?height=300&width=400",
      photoCount: row.photo_count || 0,
      path: `/albums/${row.slug}`,
      slug: row.slug,
    }))
  } catch (error) {
    console.error("Error loading albums from database:", error)
    return []
  }
})

// Get photos for a specific album
export const getAlbumPhotos = cache(async (albumSlug: string): Promise<Photo[]> => {
  try {
    const query = `
      SELECT 
        p.*,
        ap.sort_order as album_sort_order,
        GROUP_CONCAT(pt.name) as tags
      FROM album_photos ap
      JOIN photos p ON ap.photo_id = p.id
      JOIN albums a ON ap.album_id = a.id
      LEFT JOIN photo_tag_relations ptr ON p.id = ptr.photo_id
      LEFT JOIN photo_tags pt ON ptr.tag_id = pt.id
      WHERE a.slug = ? AND p.status = 'active' AND a.status = 'active'
      GROUP BY p.id
      ORDER BY ap.sort_order ASC, p.created_at DESC
    `

    const rows = await queryRows(query, [albumSlug])

    return rows.map((row: any) => ({
      id: row.id.toString(),
      src: generateAlbumPhotoUrl(albumSlug, row.filename),
      width: row.width,
      height: row.height,
      alt: row.alt_text || row.title || row.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      title: row.title,
      dateAdded: new Date(row.created_at),
      category: row.category,
      tags: row.tags ? row.tags.split(",") : [],
      isFeature: row.is_featured === 1,
    }))
  } catch (error) {
    console.error(`Error loading album ${albumSlug} from database:`, error)
    return []
  }
})

// Get available categories from database
export const getAvailableCategories = cache(async (): Promise<string[]> => {
  try {
    const query = `
      SELECT DISTINCT category
      FROM photos
      WHERE status = 'active'
      ORDER BY 
        CASE category
          WHEN 'Nature' THEN 1
          WHEN 'Portraits' THEN 2
          WHEN 'Street' THEN 3
          WHEN 'Architecture' THEN 4
          WHEN 'Travel' THEN 5
          WHEN 'Events' THEN 6
          ELSE 7
        END
    `

    const rows = await queryRows(query)
    const categories = ["All", ...rows.map((row: any) => row.category)]

    return categories
  } catch (error) {
    console.error("Error getting available categories:", error)
    return ["All"]
  }
})

// Get featured photos
export const getFeaturedPhotos = cache(async (limit = 6): Promise<Photo[]> => {
  try {
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(pt.name) as tags
      FROM photos p
      LEFT JOIN photo_tag_relations ptr ON p.id = ptr.photo_id
      LEFT JOIN photo_tags pt ON ptr.tag_id = pt.id
      WHERE p.status = 'active' AND p.is_featured = 1
      GROUP BY p.id
      ORDER BY p.sort_order ASC, p.created_at DESC
      LIMIT ?
    `

    const rows = await queryRows(query, [limit])

    return rows.map((row: any) => ({
      id: row.id.toString(),
      src: generatePhotoUrl(row.category, row.filename),
      width: row.width,
      height: row.height,
      alt: row.alt_text || row.title || row.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      title: row.title,
      dateAdded: new Date(row.created_at),
      category: row.category,
      tags: row.tags ? row.tags.split(",") : [],
      isFeature: true,
    }))
  } catch (error) {
    console.error("Error loading featured photos:", error)
    return []
  }
})

// Record photo view for analytics
export const recordPhotoView = async (photoId: string, ipAddress?: string, userAgent?: string) => {
  try {
    const query = `
      INSERT INTO photo_views (photo_id, ip_address, user_agent)
      VALUES (?, ?, ?)
    `

    await queryRows(query, [photoId, ipAddress || null, userAgent || null])
  } catch (error) {
    console.error("Error recording photo view:", error)
    // Don't throw error for analytics failure
  }
}

// Get photo statistics
export const getPhotoStats = cache(async () => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_photos,
        COUNT(CASE WHEN is_featured = 1 THEN 1 END) as featured_photos,
        COUNT(DISTINCT category) as categories,
        (SELECT COUNT(*) FROM albums WHERE status = 'active') as total_albums,
        (SELECT COUNT(*) FROM photo_views WHERE viewed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as views_last_30_days
      FROM photos 
      WHERE status = 'active'
    `

    const result = await queryRow(query)
    return (
      result || {
        total_photos: 0,
        featured_photos: 0,
        categories: 0,
        total_albums: 0,
        views_last_30_days: 0,
      }
    )
  } catch (error) {
    console.error("Error getting photo stats:", error)
    return {
      total_photos: 0,
      featured_photos: 0,
      categories: 0,
      total_albums: 0,
      views_last_30_days: 0,
    }
  }
})
