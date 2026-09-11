"use client";

import { useState } from "react";
import {
    Folder,
    MoreVertical
} from "lucide-react";
import CreateFolderModal from "./CreateFolderModal";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { notify } from "@/lib/notification";

export default function AllFolders({ folder }) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [openFolderEdit, setOpenFolderEdit] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);

    const filteredFolders = folder.folders.filter((folder) =>
        folder.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDeleteFolder = async (folderId) => {
        try {
            const res = await api.delete("/folders/delete-folder", {
                data: {
                    id: folderId
                }
            })
            if (res?.data?.success) {
                notify.success(res?.data?.message || "Folder deleted successfully");
                router.refresh();
            }
        } catch (error) {
            console.error("Error deleting folder", error);
        }
    }

    return (
        <div className="min-h-full p-6 md:p-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        All Folders
                    </h1>
                </div>

                <button
                    onClick={() => setOpenCreateModal(true)}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 cursor-pointer"
                >
                    + New Folder
                </button>
            </div>

            {filteredFolders.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredFolders.map((folder) => (
                        <div
                            key={folder.id}
                            onClick={() => router.push(`/folders/${folder.id}`)}
                            className="group rounded-2xl border border-gray-200 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 cursor-pointer"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                    <Folder
                                        size={22}
                                        className="text-gray-600 dark:text-gray-300"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-400">
                                        {folder.note_count}{" "}
                                        {folder.note_count === 1
                                            ? "note"
                                            : "notes"}
                                    </span>

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenu(openMenu === folder.id ? null : folder.id);
                                            }}
                                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        {openMenu === folder.id && (
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute right-0 top-10 z-50 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
                                            >
                                                <button
                                                    type="button"
                                                    className="w-full cursor-pointer px-4 y-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                                                    onClick={() => {
                                                        setSelectedFolder(folder);
                                                        setOpenFolderEdit(true);
                                                        setOpenMenu(null);
                                                    }}
                                                >
                                                    Update folder name
                                                </button>
                                                <button
                                                    type="button"
                                                    className="w-full cursor-pointer px-4 y-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                                                    onClick={() => handleDeleteFolder(folder.id)}
                                                >
                                                    Delete folder
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                                {folder.name}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Click to view notes
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <Folder size={40} className="mb-3 text-gray-400" />

                    <h3 className="font-medium text-gray-700 dark:text-gray-300">
                        No folders found
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                        Try searching for another folder.
                    </p>
                </div>
            )}


            {openCreateModal && (
                <CreateFolderModal
                    onClose={() => setOpenCreateModal(false)}
                />
            )}
            {openFolderEdit && selectedFolder && (
                <CreateFolderModal
                    onClose={() => {
                        setOpenFolderEdit(false);
                        setSelectedFolder(null);
                    }} 
                    isEdit={true}
                    folderId={selectedFolder.id}
                    folderName={selectedFolder.name}
                />
            )}
        </div>
    );
}

