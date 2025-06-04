"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Moon, Sun, Camera, ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "next-themes"

export default function ContactPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message")
      }

      console.log("✅ Message sent successfully:", result)
      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("❌ Error sending message:", error)
      setError(
        error.message || "Nu s-a putut trimite mesajul. Te rog încearcă din nou sau contactează-mă direct prin email.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name && formData.email && formData.subject && formData.message

  return (
    <div className="min-h-screen bg-background cursor-camera-light dark:cursor-camera-dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()} className="hover:scale-105 transition-transform">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Înapoi
              </Button>
              <Camera className="h-6 w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                BogdanPics
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:scale-110 transition-transform"
              >
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Schimbă tema</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Email */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Să captăm povestea ta
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
              Gata să rezervi o ședință foto în Botoșani? Mi-ar plăcea să aud despre proiectul tău și să te ajut să
              păstrezi acele momente prețioase pentru totdeauna.
            </p>

            {/* Email Display - Big and Prominent */}
            <div className="mb-12">
              <div className="inline-flex items-center justify-center p-6 sm:p-8 bg-primary/10 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                <Mail className="h-8 w-8 sm:h-12 sm:w-12 text-primary mr-4 sm:mr-6" />
                <div className="text-left">
                  <p className="text-sm sm:text-base text-muted-foreground mb-1">Scrie-mi direct</p>
                  <a
                    href="mailto:contact@bogdanpics.com"
                    className="text-2xl sm:text-4xl lg:text-5xl font-bold text-primary hover:text-primary/80 transition-colors duration-300"
                  >
                    contact@bogdanpics.com
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-muted/50">
                <Phone className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="font-semibold">La cerere</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-muted/50">
                <MapPin className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Locație</p>
                  <p className="font-semibold">Botoșani, România</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-muted/50">
                <Camera className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Timp răspuns</p>
                  <p className="font-semibold">În 24 de ore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Solicită oferta ta foto</h2>
              <p className="text-muted-foreground text-lg">
                Spune-mi despre proiectul tău și îți voi oferi un pachet foto personalizat și prețuri.
              </p>
            </div>

            <Card className="shadow-xl border-0 bg-background/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-semibold">Cerere colaborare foto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-green-600 mb-2">Cererea a fost trimisă! 📧</h3>
                    <p className="text-muted-foreground mb-4">
                      Mulțumesc pentru interesul tău! Îți voi răspunde în 24 de ore cu o ofertă personalizată.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Vei primi în scurt timp un email de confirmare la adresa furnizată.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Trimite altă cerere
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Numele complet *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Numele tău complet"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="transition-all duration-200 focus:scale-[1.02]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Adresa de email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="email@exemplu.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="transition-all duration-200 focus:scale-[1.02]"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">
                        Tipul de fotografie *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Portrete, evenimente, editare foto, retușare, color grading, etc."
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="transition-all duration-200 focus:scale-[1.02]"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Detalii despre proiect *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Te rog să-mi spui despre proiectul tău: tipul de serviciu (fotografie nouă sau editare foto existentă), data, locația, durata, numărul de persoane, cerințe specifice și orice alte detalii care m-ar ajuta să îți ofer o ofertă precisă..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="transition-all duration-200 focus:scale-[1.02] resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="w-full py-6 text-lg font-semibold hover:scale-105 transition-all duration-300 disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                          Se trimite cererea...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Solicită oferta foto
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      * Câmpuri obligatorii. Informațiile tale sunt păstrate private și sigure.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">La ce să te aștepți</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold">Răspuns rapid</h4>
                <p className="text-muted-foreground">
                  Răspund la toate cererile foto în 24 de ore cu o ofertă detaliată și disponibilitate.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold">Pachet personalizat</h4>
                <p className="text-muted-foreground">
                  Fiecare proiect este unic. Voi crea un pachet foto personalizat adaptat nevoilor și bugetului tău
                  specific.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold">Serviciu profesional</h4>
                <p className="text-muted-foreground">
                  De la consultare până la livrarea finală, vei primi servicii profesionale și prietenoase la fiecare
                  pas.
                </p>
              </div>
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
