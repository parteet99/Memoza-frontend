"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Folder, X } from "lucide-react"
import { notify } from "@/lib/notification"


export default function FolderSelector({ isOpen, onClose, noteId }) {
    const [folderList, setFolderList] = useState([]);
    const [folderLoading, setFolderLoading] = useState(false);
    const [movingNote, setMovingNote] = useState(false);

    const moveNoteToFolder = async (selectedFolderId) => {
        try {
            setMovingNote(true);
            const res = await api.put("/folders/move-to-folder", {
                id: noteId,
                folder_id: selectedFolderId
            });
            if (res?.data?.success) {
                notify.success(res?.data?.message || "Note moved successfully");
                onClose();
            }
        } catch (error) {
            console.error("Error moving note to folder", error);
        } finally {
            setMovingNote(false);
        }
    }

    const getFolders = async () => {
        try {
            setFolderLoading(true);
            const res = await api.get("/folders/get-folders");
            if (res?.data?.success) {
                const folderList = res?.data?.folders || [];
                setFolderList(folderList);
            }
        } catch (error) {
            console.error("Error fetching folders");
        } finally {
            setFolderLoading(false);
        }
    }

    useEffect(() => {
        if (isOpen) {
            getFolders();
        }
    }, [isOpen])

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Select folder
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg px-3 py-1 text-2xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                {folderList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {folderList.map((folder) => (
                            <button
                                key={folder.id}
                                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 cursor-pointer"
                                onClick={() => {
                                    moveNoteToFolder(folder.id);
                                }}
                            >
                                <h3 className="mb-2 truncate text-lg font-semibold text-gray-900 dark:text-white"> 
                                    {folder.name}
                                </h3>
                                
                                <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                    {folder.note_count}{" "}
                                    {folder.note_count === 1 ? "note" : "notes"}
                                </p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-[300px] flex-col items-center justify-center">
                        <p className="mb-4 text-gray-500 dark:text-gray-400">
                            No folders found
                        </p>
                    </div>
                )}

            </div>
        </div>
    )
}