"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ collapsed }) {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                type="button"
                className={`
                    flex h-11 items-center rounded-xl
                    text-[var(--muted-foreground)]
                    transition-all duration-200
                    hover:bg-[var(--muted)]
                    hover:text-[var(--foreground)]
                    ${collapsed
                        ? "justify-center px-2"
                        : "gap-3 px-3"
                    }
                `}
                aria-label="Change theme"
            >
                <Moon
                    size={20}
                    strokeWidth={1.8}
                    className="shrink-0"
                />

                {!collapsed && (
                    <span className="text-sm font-medium">
                        Theme
                    </span>
                )}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={() =>
                setTheme(isDark ? "light" : "dark")
            }
            title={collapsed ? "Theme" : undefined}
            aria-label={
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
            className={`
                group flex h-11 w-full
                items-center rounded-xl
                text-[var(--muted-foreground)]
                transition-all duration-200
                hover:bg-[var(--muted)]
                hover:text-[var(--foreground)]
                ${collapsed
                    ? "justify-center px-2"
                    : "gap-3 px-3"
                }
            `}
        >
            {isDark ? (
                <Sun
                    size={20}
                    strokeWidth={1.8}
                    className="shrink-0"
                />
            ) : (
                <Moon
                    size={20}
                    strokeWidth={1.8}
                    className="shrink-0"
                />
            )}

            {!collapsed && (
                <span className="text-sm font-medium">
                    Theme
                </span>
            )}
        </button>
    );
}