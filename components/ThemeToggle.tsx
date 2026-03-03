"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle({ className = "" }: { className?: string }) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <Button variant="ghost" size="icon" className={`rounded-xl ${className}`} disabled><span className="w-5 h-5" /></Button> // Placeholder to prevent hydration mismatch
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className={`relative hover:bg-gray-200 dark:hover:bg-white/5 rounded-xl transition-all ${className}`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            <Sun className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-6 w-6 text-gray-700 dark:text-gray-300 transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
        </Button>
    )
}
