"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, Menu } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

export default function LandingHeader() {
  const { user } = useAuth()
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 lg:px-16">
        
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <GraduationCap className="h-8 w-8 text-purple-600" />
          <span className="text-xl font-bold text-gray-800">EduVerse</span>
        </div>

        {/* Navbar Links */}
        <nav className="hidden lg:flex items-center space-x-6">
          {[
            { href: "#services", label: "Services" },
            { href: "#categories", label: "Categories" },
            { href: "#courses", label: "Courses" },
            { href: "#about", label: "About" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors group"
            >
              {item.label}
              {/* modern underline animation */}
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          <Button
            variant="ghost"
            className="text-gray-700 hover:text-[var(--coursera-blue)] font-medium transition-colors"
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button className="text-white font-semibold px-5 py-2 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 brand-btn-primary">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center space-x-3 lg:hidden">
          <Button
            variant="ghost"
            className="text-gray-700 hover:text-[var(--coursera-blue)] font-medium"
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </Button>
        </div>
      </div>
    </header>
  )
}
