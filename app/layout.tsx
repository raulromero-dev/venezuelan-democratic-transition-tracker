import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Eyes on Venezuela",
  description: "Open intelligence platform measuring democratic and economic progress in Venezuela.",
  openGraph: {
    title: "Eyes on Venezuela",
    description: "Open intelligence platform measuring democratic and economic progress in Venezuela.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Eyes on Venezuela",
    description: "Open intelligence platform measuring democratic and economic progress in Venezuela.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${spaceGrotesk.variable} antialiased font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen w-full bg-background text-foreground">{children}</div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
