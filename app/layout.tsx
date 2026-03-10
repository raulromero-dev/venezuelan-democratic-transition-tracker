import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthCheck } from "@/components/auth-check"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Mofeta: CS Ops",
  description: "Mofeta: CS Ops.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Mofeta: CS Ops.",
    description: "Mofeta: CS Ops.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Mofeta Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Mofeta: CS Ops.",
    description: "Mofeta: CS Ops.",
    images: ["/logo.png"],
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
      </head>
      <body className={`${spaceGrotesk.variable} antialiased font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthCheck>
            <div className="flex flex-col min-h-screen w-full bg-background text-foreground">{children}</div>
          </AuthCheck>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
