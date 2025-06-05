"use client"

import { useState, useRef, useEffect } from "react"
import { Moon, Sun, Instagram, ChevronLeft, ChevronRight, X, ArrowUp, Filter, User, Mail, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import Link from "next/link"

// Category display mapping (English internal -> Romanian display)
const CATEGORY_DISPLAY_MAP = {
  TopPicks: "Top Picks",
  Nature: "Natură",
  Portraits: "Portrete",
  Street: "Stradă",
  Architecture: "Arhitectură",
  Travel: "Călătorii",
  Events: "Evenimente",
}

export default function PhotoPortfolio() {
  const { theme, setTheme } = useTheme()
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0)
  const [photos, setPhotos] = useState([])
  const [albums, setAlbums] = useState([])
  const [availableCategories, setAvailableCategories] = useState(["All"])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const photosResponse = await fetch("https://cdn.bogdanpics.com/public/photos/photos.json")
        const rawPhotos = await photosResponse.json()
        const photosWithSize = rawPhotos.map((p: any) => ({
          ...p,
          id: p.src,
          alt: p.category,
        }))

        setPhotos(photosWithSize)
        const categories = Array.from(new Set(photosWithSize.map((p: any) => p.category)))
        setAvailableCategories(["TopPicks", ...categories.filter(c => c !== "TopPicks")])
        setSelectedCategory("TopPicks")
      } catch (error) {
        setPhotos([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        e.preventDefault()
        switch (e.key) {
          case "Escape":
            setLightboxIndex(null)
            setIsFullscreen(false)
            break
          case "ArrowLeft":
            setLightboxIndex((prev) => (prev !== null ? (prev > 0 ? prev - 1 : photos.length - 1) : null))
            break
          case "ArrowRight":
            setLightboxIndex((prev) => (prev !== null ? (prev < photos.length - 1 ? prev + 1 : 0) : null))
            break
          case "f":
          case "F":
            toggleFullscreen()
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxIndex, photos.length])

  const nextAlbum = () => {
    setCurrentAlbumIndex((prev) => (prev + 1) % albums.length)
  }

  const prevAlbum = () => {
    setCurrentAlbumIndex((prev) => (prev - 1 + albums.length) % albums.length)
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    setIsFullscreen(false)
  }

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev !== null ? (prev > 0 ? prev - 1 : photos.length - 1) : null))
  }

  const goToNext = () => {
    setLightboxIndex((prev) => (prev !== null ? (prev < photos.length - 1 ? prev + 1 : 0) : null))
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const getVisibleAlbums = () => {
    const visible = []
    for (let i = 0; i < Math.min(3, albums.length); i++) {
      const index = (currentAlbumIndex + i) % albums.length
      visible.push(albums[index])
    }
    return visible
  }

  const filteredPhotos =
    selectedCategory === "TopPicks"
      ? photos.filter((photo) => photo.category === "top-picks" || photo.category === "TopPicks")
      : photos.filter((photo) => photo.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background cursor-camera-light dark:cursor-camera-dark">
      {/* Sticky Navigation - Mobile Optimized */}
      <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent truncate">
                BogdanPics
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                className="font-medium text-sm hover:scale-105 transition-transform hover:text-accent"
              >
                <User className="h-4 w-4 mr-2" />
                Despre mine
              </Button>
              <Link href="/contact">
                <Button
                  variant="ghost"
                  className="font-medium text-sm hover:scale-105 transition-transform hover:text-accent"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:scale-110 transition-transform hover:text-accent"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Schimbă tema</span>
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center space-x-1">
              <Link href="/contact">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2 hover:scale-105 transition-transform hover:text-accent"
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Contact
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:scale-110 transition-transform h-8 w-8 hover:text-accent"
              >
                <Sun className="h-3 w-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-3 w-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Schimbă tema</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Instagram Header */}
      <section className="py-6 sm:py-8 border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4 animate-fade-in">
            <Instagram className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
              @bogdanfotograful
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Fotograf pasionat din Botoșani, România. Captez momente autentice și emoții reale prin obiectiv. De la
            portrete și peisaje până la evenimente speciale - fiecare fotografie spune o poveste unică.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 mt-4 text-xs sm:text-sm text-muted-foreground">
            <span>~50 urmăritori</span>
            <span className="hidden sm:inline">•</span>
            <span>Disponibil pentru colaborări</span>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-8 sm:py-12 photo-gradient-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
              Despre mine - Fotograf Botoșani
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-left">
                <p className="text-muted-foreground leading-relaxed">
                  Salut! Mă numesc Bogdan, sunt fotograf din Botoșani, România, și am o experiență de aproximativ 2 ani
                  în domeniul fotografiei. Pasiunea mea pentru captarea momentelor unice m-a dus de la proiecte cu
                  autovehicule și portrete până la diverse tipuri de fotografii.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Pentru mine, fotografia nu este doar un job, ci o formă de a spune povești prin imagini – emoții,
                  zâmbete, detalii care rămân vii în timp. Lucrez preponderent în Botoșani, dar sunt deschis și pentru
                  colaborări în județele din apropiere. Încerc mereu să ofer servicii de calitate la prețuri accesibile.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                    Portrete
                  </Badge>
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                    Fotografie de stradă
                  </Badge>
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                    Peisaje
                  </Badge>
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                    Evenimente
                  </Badge>
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                    Fotografie auto
                  </Badge>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://cdn.bogdanpics.com/principal.jpg"
                  alt="Bogdan - Fotograf Botoșani"
                  className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 accent-glow-hover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Editing Services Section */}
      <section className="py-8 sm:py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
              Servicii Editare Foto Profesională
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed mb-8">
              Ai fotografii care au nevoie de o mică îmbunătățire? Ofer servicii de editare foto profesională pentru a
              face imaginile tale să strălucească. Nu voi schimba radical aspectul fotografiilor, dar pot face acele
              mici modificări care fac diferența.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 accent-glow-hover border-accent/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Retușare Portrete</h3>
                  <p className="text-sm text-muted-foreground">
                    Îmbunătățirea tenului, eliminarea imperfecțiunilor minore, ajustarea luminozității
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 accent-glow-hover border-accent/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Color Grading</h3>
                  <p className="text-sm text-muted-foreground">
                    Ajustarea culorilor, saturației și tonurilor pentru un aspect mai vibrant și profesional
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 accent-glow-hover border-accent/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Corecții Lumină</h3>
                  <p className="text-sm text-muted-foreground">
                    Ajustarea expunerii, contrastului și luminozității pentru imagini echilibrate
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 accent-glow-hover border-accent/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Eliminare Obiecte</h3>
                  <p className="text-sm text-muted-foreground">
                    Îndepărtarea obiectelor nedorite din fundal sau a elementelor care distrag atenția
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">De ce să alegi serviciile mele de editare?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong>Stil natural:</strong> Nu exagerez cu editarea - păstrez aspectul autentic al fotografiilor
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong>Prețuri accesibile:</strong> Tarife competitive pentru servicii de editare de calitate
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong>Livrare rapidă:</strong> Procesez imaginile în 2-5 zile lucrătoare, în funcție de
                    complexitate
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong>Revizii incluse:</strong> O rundă de modificări gratuită pentru a te asigura că ești
                    mulțumit
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="photo-gradient hover:scale-105 transition-all duration-300 accent-glow-hover"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Solicită editare foto
                </Button>
              </Link>
              <Link href="/before-after">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:scale-105 transition-transform border-accent/30 hover:border-accent hover:text-accent"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Vezi exemple before/after
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8 sm:py-12 photo-gradient-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
              Servicii Foto Botoșani
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 accent-glow-hover border-accent/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Portrete</h3>
                  <p className="text-muted-foreground">
                    Ședințe foto portret profesionale în Botoșani. Captez personalitatea și emoțiile autentice ale
                    fiecărei persoane cu atenție la detalii.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 accent-glow-hover border-accent/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Evenimente</h3>
                  <p className="text-muted-foreground">
                    Documentez momentele speciale din viața ta - de la sărbători de familie la evenimente corporate,
                    păstrând amintiri prețioase pentru totdeauna.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 accent-glow-hover border-accent/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Fotografie Creativă</h3>
                  <p className="text-muted-foreground">
                    De la fotografia de stradă și peisaje până la proiecte auto și arhitectură - explorez diverse
                    stiluri pentru a crea imagini unice și memorabile.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Albums Carousel */}
      {albums.length > 0 && (
        <section className="py-8 sm:py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
                Albumele mele
              </h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevAlbum}
                  disabled={albums.length <= 3}
                  className="hover:scale-110 transition-transform border-accent/30 hover:border-accent hover:text-accent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextAlbum}
                  disabled={albums.length <= 3}
                  className="hover:scale-110 transition-transform border-accent/30 hover:border-accent hover:text-accent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {getVisibleAlbums().map((album) => (
                <Card
                  key={album.id}
                  className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 accent-glow-hover border-accent/20"
                  onClick={() => setSelectedAlbum(album.id)}
                >
                  <CardContent className="p-0">
                    <div className="relative bg-muted">
                      <img
                        src={album.coverImage || "/placeholder.svg"}
                        alt={album.title}
                        className="w-full h-48 sm:h-64 object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                        <div className="text-white text-center">
                          <h3 className="text-lg sm:text-xl font-semibold mb-2">{album.title}</h3>
                          <p className="text-sm opacity-90">{album.photoCount} fotografii</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MODIFICARE: Album grid modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <Button
            onClick={() => setSelectedAlbum(null)}
            className="absolute top-6 right-6 z-10"
            variant="secondary"
          >
            <X className="mr-2" /> Închide albumul
          </Button>
          <h2 className="text-2xl font-bold text-white mb-6">
            {albums.find(a => a.id === selectedAlbum)?.title}
          </h2>
          <PhotoGallery
            photos={photos.filter(p => p.category === selectedAlbum)}
            targetRowHeight={250}
            margin={8}
            onPhotoClick={openLightbox}
          />
        </div>
      )}

      {/* Photo Gallery with Filtering */}
      <section className="py-8 sm:py-12 photo-gradient-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
              Lucrările mele recente
            </h2>

            {/* Category Filter */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-2 bg-accent/5 border border-accent/20 rounded-lg p-1 shadow-sm overflow-x-auto">
                <Filter className="h-4 w-4 text-accent ml-2 flex-shrink-0" />
                {availableCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`transition-all duration-200 hover:scale-105 whitespace-nowrap ${
                      selectedCategory === category
                        ? "photo-gradient text-white"
                        : "hover:text-accent hover:bg-accent/10"
                    }`}
                  >
                    {CATEGORY_DISPLAY_MAP[category] || category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : (
            <PhotoGallery photos={filteredPhotos} targetRowHeight={250} margin={8} onPhotoClick={openLightbox} />
          )}
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="py-8 sm:py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
              Ce mă recomandă
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="h-8 w-8 text-accent" />
                </div>
                <h4 className="text-xl font-semibold">Echipament profesional & Experiență</h4>
                <p className="text-muted-foreground">
                  2 ani de experiență în fotografierea de oameni și autovehicule, echipat cu aparatură profesională
                  pentru a capta fiecare detaliu perfect.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-8 w-8 text-accent" />
                </div>
                <h4 className="text-xl font-semibold">Abordare prietenoasă & flexibilă</h4>
                <p className="text-muted-foreground">
                  Stil personal și accesibil cu programare flexibilă. Lucrez cu tine pentru a ne asigura că viziunea ta
                  prinde viață.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <ArrowUp className="h-8 w-8 text-accent" />
                </div>
                <h4 className="text-xl font-semibold">Livrare rapidă și organizată</h4>
                <p className="text-muted-foreground">
                  Timpi de livrare rapizi cu fotografii de înaltă calitate, organizate profesional. Amintirile tale,
                  livrate prompt și profesional.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-accent" />
                </div>
                <h4 className="text-xl font-semibold">Prețuri accesibile</h4>
                <p className="text-muted-foreground">
                  Servicii foto de calitate la prețuri competitive. Fiind la început de drum înseamnă valoare excelentă
                  pentru rezultate profesionale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 sm:py-12 photo-gradient-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
              Să captăm împreună momentele tale!
            </h2>
            <p className="text-muted-foreground mb-8">
              Cauți un fotograf în Botoșani? Să colaborăm și să surprindem împreună cele mai frumoase momente!
              Contactează-mă pentru disponibilitate și pachete foto personalizate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="photo-gradient hover:scale-105 transition-all duration-300 accent-glow-hover"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Solicită ofertă
                </Button>
              </Link>
              <a href="https://instagram.com/bogdanfotograful" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:scale-105 transition-transform border-accent/30 hover:border-accent hover:text-accent"
                >
                  <Instagram className="h-4 w-4 mr-2" />
                  Vezi Instagram
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p className="text-sm sm:text-base mb-2">
            &copy; 2025 BogdanPics - Fotograf Botoșani, România. Toate drepturile rezervate.
          </p>
          <p className="text-xs">Fotograf Botoșani | Servicii foto profesionale | Portrete și evenimente</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 z-30 rounded-full shadow-lg hover:scale-110 transition-all duration-300 animate-fade-in photo-gradient accent-glow"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      {/* Enhanced Lightbox Modal */}
      {lightboxIndex !== null && filteredPhotos.length > 0 && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-2 sm:p-4 ${
            isFullscreen ? "cursor-none" : ""
          }`}
          onClick={closeLightbox}
        >
          <div className="relative w-full h-full max-w-[98vw] max-h-[98vh] flex items-center justify-center">
            {/* Enhanced Controls */}
            <div
              className={`absolute top-4 right-4 z-10 flex space-x-2 ${isFullscreen ? "opacity-0 hover:opacity-100" : ""} transition-opacity`}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFullscreen()
                }}
                className="bg-black/50 hover:bg-black/70 text-white"
                title="Comută ecran complet (F)"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white"
                onClick={closeLightbox}
                title="Închide (ESC)"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white hover:scale-110 transition-all ${
                isFullscreen ? "opacity-0 hover:opacity-100" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              title="Anterior (←)"
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white hover:scale-110 transition-all ${
                isFullscreen ? "opacity-0 hover:opacity-100" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              title="Următor (→)"
            >
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </Button>

            {/* Main Image - Properly Constrained */}
            <img
              src={`https://cdn.bogdanpics.com${filteredPhotos[lightboxIndex]?.src || "/placeholder.svg"}`}
              alt={filteredPhotos[lightboxIndex]?.alt || "Fotografie"}
              className="max-w-full max-h-full w-auto h-auto object-contain select-none"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "calc(100vw - 2rem)",
                maxHeight: "calc(100vh - 2rem)",
              }}
            />

            {/* Image Info */}
            <div
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm ${
                isFullscreen ? "opacity-0 hover:opacity-100" : ""
              } transition-opacity`}
            >
              <span className="mr-4">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
              <span className="text-xs opacity-75">Apasă F pentru ecran complet</span>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Light theme camera cursor - dark camera icon */
        .cursor-camera-light {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>') 12 12, auto;
        }
        
        /* Dark theme camera cursor - light camera icon with outline */
        .cursor-camera-dark {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" fill="%23000000" fillOpacity="0.3"/><circle cx="12" cy="13" r="3" fill="%23000000" fillOpacity="0.3"/></svg>') 12 12, auto;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}

// Enhanced Photo Gallery Component
const PhotoGallery = ({ photos, targetRowHeight = 200, margin = 4, onPhotoClick }) => {
  const [containerWidth, setContainerWidth] = useState(0)
  const [layoutPhotos, setLayoutPhotos] = useState([])
  const [visiblePhotos, setVisiblePhotos] = useState(new Set())
  const containerRef = useRef(null)
  const observerRef = useRef(null)

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

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const photoId = entry.target.getAttribute("data-photo-id")
            if (photoId) {
              setVisiblePhotos((prev) => new Set([...prev, photoId]))
            }
          }
        })
      },
      { rootMargin: "50px" },
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [layoutPhotos])

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
      const totalAspectRatio = row.reduce((sum, photo) => sum + photo.width / photo.height, 0)
      const availableWidth = containerWidth - margin * (row.length - 1)
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

  if (photos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg sm:text-xl text-muted-foreground mb-4">Nu s-au găsit fotografii</p>
        <p className="text-sm text-muted-foreground">
          Adaugă imagini în dosarele de categorii din <code className="bg-muted px-2 py-1 rounded">public/photos/</code>{" "}
          pentru a începe
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {layoutPhotos.map((photo) => (
        <LazyPhoto
          key={photo.id}
          photo={photo}
          onPhotoClick={onPhotoClick}
          observer={observerRef.current}
          isVisible={visiblePhotos.has(photo.id)}
        />
      ))}
      <div
        style={{
          height: layoutPhotos.length > 0 ? Math.max(...layoutPhotos.map((p) => p.top + p.height)) + "px" : "0px",
        }}
      />
    </div>
  )
}

// Lazy Loading Photo Component
const LazyPhoto = ({ photo, onPhotoClick, observer, isVisible }) => {
  const photoRef = useRef(null)

  useEffect(() => {
    const currentRef = photoRef.current
    if (currentRef && observer) {
      observer.observe(currentRef)
      return () => {
        if (currentRef) {
          observer.unobserve(currentRef)
        }
      }
    }
  }, [observer])

  return (
    <div
      ref={photoRef}
      data-photo-id={photo.id}
      className="absolute group cursor-pointer"
      style={{
        left: photo.left,
        top: photo.top,
        width: photo.width,
        height: photo.height,
      }}
      onClick={() => onPhotoClick?.(photo.index)}
    >
      <Card className="w-full h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-muted accent-glow-hover border-accent/20">
        <CardContent className="p-0 w-full h-full flex items-center justify-center relative">
          {isVisible ? (
            <>
              <picture>
                <source
                  srcSet={`https://cdn.bogdanpics.com${photo.src.replace(/\.(jpg|jpeg|png)$/i, ".webp")}`}
                  type="image/webp"
                />
                <img
                  src={`https://cdn.bogdanpics.com${photo.src}`}
                  alt={photo.alt}
                  className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </picture>
              {/* Category Badge */}
              {photo.category && (
                <Badge className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent/90 text-white border-accent">
                  {CATEGORY_DISPLAY_MAP[photo.category] || photo.category}
                </Badge>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
              <Camera className="h-8 w-8 text-accent" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getImageSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 1200, height: 800 }); // fallback
    img.src = src;
  });
}
