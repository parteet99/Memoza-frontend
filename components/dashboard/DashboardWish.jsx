"use client"

import { getGreeting } from "@/lib/getGreeting"

export default function DashboardWish() {
    return (
        <div
            className="
                flex flex-col items-center gap-4 rounded-2xl border
                border-gray-200 p-6 text-center shadow-sm
                bg-[var(--background)] text-[var(--foreground)]
                dark:border-gray-800
            "
            style={{
                backgroundImage: `
                    radial-gradient(
                        circle,
                        rgba(107, 114, 128, 0.25) 1px,
                        transparent 1px
                    )
                `,
                backgroundSize: "16px 16px",
            }}
        >
            <h1 className="text-2xl font-semibold">
                {getGreeting()}, Parteet
            </h1>

            <p className="text-muted-foreground">
                What would you like to write today?
            </p>
        </div>
    )
}