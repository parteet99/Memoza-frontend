"use client"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import { FileClock, FileText } from "lucide-react";

export default function DashboardRecentNotes() {
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRecentNotes = async () => {
            try {
                const res = await api.get("/dashboard/recentUpdated-note");
                if (res?.data?.success) {
                    setNote(res?.data?.note);
                }
            } catch (error) {
                console.error("Failed to fetch pinned notes", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRecentNotes();
    }, [])

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
            <div className="mb-4 gap-3 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Recently notes</h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        You recently updated notes
                    </p>
                </div>
                <div className="rounded-xl bg-gray-100 p-2.5 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400">
                    <FileText size={20} />
                </div>
            </div>
            {loading && (
                <div className="flex flex-1 flex-col justify-center gap-3">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                </div>
            )}

            {!loading && !note && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <div className="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                        <FileText
                            size={24}
                            className="text-gray-400"
                        />
                    </div>

                    <p className="font-medium">
                        No recent notes
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Create or update note to see here
                    </p>
                </div>
            )}

            {!loading && note?.length > 0 && (
                <div className="space-y-3 w-full">
                    {note.map((note) => (
                        <div
                            key={note.id}
                            className="
                                group cursor-pointer rounded-xl
                                border border-gray-200 p-4
                                transition hover:shadow-md
                                dark:border-gray-800 bg-[var(--background)]
                            "
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1 shrink-0">
                                    <FileClock
                                        size={16}
                                        className="text-gray-500"
                                        // fill="currentColor"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate font-medium max-w-[]">
                                        {note.title || "Untitled Note"}
                                    </h3>

                                    <div
                                        className="
                                            mt-1 line-clamp-2
                                            text-sm text-gray-500
                                            dark:text-gray-400 truncate
                                        "
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                note.content ||
                                                "No content",
                                        }}
                                    />

                                    <p className="mt-2 text-xs text-gray-400">
                                        Updated{" "}
                                        {new Date(
                                            note.updated_at
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}