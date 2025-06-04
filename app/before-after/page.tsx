"use client"

import { useRouter } from "next/navigation"
import { Moon, Sun, Camera, ArrowLeft, Wrench, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"

export default function BeforeAfterPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background cursor-camera-light dark:cursor-camera-dark">
      {/* Navigation - Mobile Optimized */}
      <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Back Button & Logo */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="hover:scale-105 transition-transform p-1 sm:p-2"
                size="sm"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Înapoi</span>
              </Button>
              <Camera className="h-4 w-4 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent truncate">
                BogdanPics
              </h1>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:scale-110 transition-transform h-8 w-8 sm:h-10 sm:w-10"
              >
                <Sun className="h-3 w-3 sm:h-4 sm:w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-3 w-3 sm:h-4 sm:w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Schimbă tema</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Wrench className="h-12 w-12 sm:h-16 sm:w-16 text-primary mr-4" />
              <Clock className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground animate-pulse" />
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Galerie Before/After
            </h1>

            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 sm:p-12 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">🚧 Pagina este în lucru</h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 leading-relaxed">
                Lucrez în prezent la această secțiune pentru a-ți arăta transformările incredibile pe care le pot face
                fotografiilor tale prin editare profesională.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-background/50">
                  <Star className="h-6 w-6 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">Retușare portrete</p>
                    <p className="text-sm text-muted-foreground">Exemple în curând</p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-background/50">
                  <Star className="h-6 w-6 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">Color grading</p>
                    <p className="text-sm text-muted-foreground">Exemple în curând</p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-background/50">
                  <Star className="h-6 w-6 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">Corecții lumină</p>
                    <p className="text-sm text-muted-foreground">Exemple în curând</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 text-base sm:text-lg">
              În scurt timp vei putea vedea aici exemple concrete de fotografii înainte și după editare, demonstrând
              calitatea serviciilor mele de post-procesare.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="hover:scale-105 transition-transform"
                onClick={() => router.push("/contact")}
              >
                <Camera className="h-4 w-4 mr-2" />
                Contactează-mă pentru editare
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="hover:scale-105 transition-transform"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Înapoi la portofoliu
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">Ce vei găsi aici în curând</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold mb-3">Comparații vizuale</h4>
                  <p className="text-muted-foreground">
                    Slider-e interactive pentru a vedea diferența clară între imaginea originală și cea editată.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold mb-3">Detalii tehnice</h4>
                  <p className="text-muted-foreground">
                    Explicații despre tehnicile folosite și timpul necesar pentru fiecare tip de editare.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold mb-3">Categorii diverse</h4>
                  <p className="text-muted-foreground">
                    Exemple din toate categoriile: portrete, peisaje, evenimente, fotografie auto și multe altele.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold mb-3">Informații prețuri</h4>
                  <p className="text-muted-foreground">
                    Estimări de preț pentru fiecare tip de editare, în funcție de complexitatea lucrării.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p className="text-sm sm:text-base mb-2">
            &copy; 2025 BogdanPics - Fotograf Botoșani, România. Toate drepturile rezervate.
          </p>
          <p className="text-xs">Fotograf Botoșani | Servicii foto profesionale | Portrete și evenimente</p>
        </div>
      </footer>

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
      `}</style>
    </div>
  )
}
