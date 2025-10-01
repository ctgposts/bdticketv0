"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Menu } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">Travel Agency Management</h2>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
