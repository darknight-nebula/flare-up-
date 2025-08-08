import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FLAREUP Game - Test Your Compatibility",
  description: "Discover your relationship destiny with the classic FLAREUP game. Test compatibility with friends, crushes, and loved ones!",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          storageKey="flames-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
