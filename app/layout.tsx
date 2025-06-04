import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "BogdanPics - Fotograf Profesionist Botoșani | Editare Foto România | Servicii Foto Complete",
  description:
    "Fotograf profesionist din Botoșani, România. Servicii complete: fotografii portrete, evenimente, peisaje + editare foto profesională (retușare, color grading, corecții). Prețuri accesibile, calitate superioară. Fotograf Botoșani, editare foto România.",
  keywords:
    "fotograf Botoșani, editare foto România, retușare foto profesională, color grading Botoșani, fotograf portrete Botoșani, fotograf evenimente România, servicii foto complete Botoșani, corecții foto digitale, fotograf profesionist România, editare imagini Botoșani, fotografie și post-procesare, servicii foto și editare România, fotograf cu editare inclusă",
  authors: [{ name: "Bogdan - BogdanPics" }],
  creator: "BogdanPics",
  publisher: "BogdanPics",
  robots: "index, follow",
  openGraph: {
    title: "BogdanPics - Fotograf și Editor Foto Profesionist Botoșani",
    description:
      "Servicii complete de fotografie și editare foto în Botoșani, România. De la ședințe foto la retușare profesională - totul într-un singur loc.",
    type: "website",
    locale: "ro_RO",
    siteName: "BogdanPics",
  },
  twitter: {
    card: "summary_large_image",
    title: "BogdanPics - Fotograf și Editor Foto Botoșani",
    description:
      "Fotograf profesionist din Botoșani cu servicii complete de editare foto. Calitate superioară la prețuri accesibile.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://bogdanpics.com" />
        <meta name="geo.region" content="RO-BT" />
        <meta name="geo.placename" content="Botoșani" />
        <meta name="geo.position" content="47.7475;26.6617" />
        <meta name="ICBM" content="47.7475, 26.6617" />
        <meta name="language" content="Romanian" />
        <meta name="coverage" content="Romania" />
        <meta name="distribution" content="Romania" />
        <meta name="target" content="Romania" />
        <meta name="audience" content="Romania" />
        <meta name="DC.language" content="ro" />
        <meta name="DC.coverage" content="Romania" />
        <meta name="DC.subject" content="Fotografie profesională și editare foto în România" />
      </head>
      <body className={poppins.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
