import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "LLMChat - Knowledge Base & LLM Platform",
  description: "An intelligent conversation platform with knowledge base management and LLM integration",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers suppressHydrationWarning>
          {children}
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'