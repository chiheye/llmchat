"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/lib/auth/auth-context"
import { SessionProvider } from "next-auth/react"

interface ProvidersProps {
  children: React.ReactNode
  suppressHydrationWarning?: boolean
}

export function Providers({ children, suppressHydrationWarning }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 使用客户端专用的包装器组件
  const ClientOnly = ({ children }: { children: React.ReactNode }) => {
    return mounted ? <>{children}</> : null;
  }

  return (
    <SessionProvider>
      <AuthProvider>
        <div suppressHydrationWarning={true}>
          <ClientOnly>
            <NextUIProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
              </ThemeProvider>
            </NextUIProvider>
          </ClientOnly>
          {!mounted && (
            <div style={{ visibility: "hidden" }} suppressHydrationWarning={true}>
              {children}
            </div>
          )}
        </div>
      </AuthProvider>
    </SessionProvider>
  )
}

