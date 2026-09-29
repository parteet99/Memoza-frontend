"use client"
import { useState, useEffect } from "react"
import { NotebookIcon, Trash, Archive, Folder } from "lucide-react";
import api from "@/lib/api"

export default function DashboardCount() {
    const [noteCount, setNoteCount] = useState(null);
    const [trashCount, setTrashCount] = useState(null);
    const [folderCount, setFolderCount] = useState(null);
    const [archiveCount, setArchiveCount] = useState(null);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const [note, trash, folder, archive] = await Promise.all([
                    api.get("/count/note-count"),
                    api.get("/count/trash-count"),
                    api.get("/count/folder-count"),
                    api.get("/count/archive-count"),
                ])

                setNoteCount(note.data.note);
                setTrashCount(trash.data.note);
                setFolderCount(folder.data.note);
                setArchiveCount(archive.data.note);
            } catch (error) {
                console.error("Failed to fetch count", error);
                return null;
            }
        }

        fetchCount();
    }, [])

    const counts = [
        {
            title: "Notes",
            count: noteCount,
            icon: NotebookIcon,
            href: "/notes",
        },
        {
            title: "Folders",
            count: folderCount,
            icon: Folder,
            href: "/folders",
        },
        {
            title: "Archive",
            count: archiveCount,
            icon: Archive,
            href: "/archive",
        },
        {
            title: "Trash",
            count: trashCount,
            icon: Trash,
            href: "/trash",
        },
    ]
    
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
            <h2 className="mb-4 text-lg font-semibold">Total Counts</h2>

            <div className="grid grid-cols-2 w-full gap-3">
                {counts.map((count) => {
                    const Icon = count.icon

                    return (
                        <div
                            key={count.title}
                            href={count.href}
                            className="
                                group flex w-full items-center
                                justify-between rounded-xl border
                                border-gray-200
                                bg-[var(--background)]
                                p-4
                                transition-all
                                hover:-translate-y-0.5
                                hover:border-gray-300
                                hover:shadow-md
                                dark:border-gray-800
                                dark:hover:border-gray-700
                            "
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                                        flex h-10 w-10 shrink-0
                                        items-center justify-center
                                        rounded-lg
                                        bg-gray-100
                                        text-gray-700
                                        transition-colors
                                        group-hover:bg-gray-200
                                        dark:bg-gray-900
                                        dark:text-gray-300
                                        dark:group-hover:bg-gray-800
                                    "
                                >
                                    <Icon size={18} />
                                </div>
                                <p className="text-sm font-medium">
                                    {count.title}
                                </p>
                            </div>
                             <p className="
                                text-xl font-medium
                                text-gray-500
                                dark:text-gray-400
                            ">
                                {count.count ?? 0}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}