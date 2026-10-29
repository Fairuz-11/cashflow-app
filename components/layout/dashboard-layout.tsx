"use client"

import { ReactNode } from "react"
import { Sidebar } from "../ui/sidebar"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: ReactNode
  userName?: string | null
}

export function DashboardLayout({ children, userName }: DashboardLayoutProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen min-w-0 bg-gray-50">
      <Sidebar userName={userName} onLogout={handleLogout} />

      {/* 
        Mobile:  pt-14 (top bar) + pb-16 (bottom nav) 
        Desktop: p-8, sidebar ada di kiri 
      */}
      <main className="min-w-0 flex-1 px-3 pt-20 pb-28 sm:px-4 sm:pb-24 md:px-6 lg:px-8 lg:pt-8 lg:pb-8">
        {children}
      </main>
    </div>
  )
}
