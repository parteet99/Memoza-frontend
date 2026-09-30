"use client"

import Link from "next/link"
import { FilePlus, NotebookPen, Archive, Folder } from "lucide-react"

const shortcuts = [
    {
        title: "New Note",
        description: "Create a new note",
        icon: FilePlus,
        href: "/notes"
    },
    {
        title: "All Notes",
        description: "View your notes",
        icon: NotebookPen,
        href: "/notes"
    },
    {
        title: "Archives",
        description: "View archives",
        icon: Archive,
        href: "/archive"
    },
    {
        title: "Folders",
        description: "View notes folders",
        icon: Folder,
        href: "/folders"
    }
]

export default function DashboardShortcuts() {
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
            <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>

            <div className="grid grid-cols-2 gap-2 w-full">
                {shortcuts.map((shortcut) => {
                    const Icon = shortcut.icon

                    return (
                        <Link
                            key={shortcut.title}
                            href={shortcut.href}
                            className="
                                group rounded-xl border h-full
                                border-gray-200 bg-[var(--background)]
                                p-4 transition-all
                                hover:-translate-y-0.5
                                hover:border-gray-300
                                hover:shadow-md
                                dark:border-gray-800
                                dark:hover:border-gray-700
                            "
                        >
                            <div className="flex items-center gap-4">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors group-hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:group-hover:bg-gray-800">
                                    <Icon size={20} />
                                </div>

                                <div className="flex flex-col items-center">
                                    <h3 className="text-sm font-medium">{shortcut.title}</h3>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {shortcut.description}
                                </p>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}