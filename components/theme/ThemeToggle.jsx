"use client"

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button type="button" className="h-10 w-10 rounded-lg border border-[var(--border)]" aria-label="Change theme" />
        )
    }

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="
                flex h-10 w-10 items-center justify-center
                rounded-lg
                border border-[var(--border)]
                bg-[var(--card)]
                text-[var(--foreground)]
                transition
                hover:bg-[var(--muted)]
            "
            aria-label = {isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? (
                <Sun size={18} />
            ) : (
                <Moon size={18} />
            )}
        </button>
    )
}