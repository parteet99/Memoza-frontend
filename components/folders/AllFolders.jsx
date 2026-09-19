"use client";

import { useState } from "react";
import {
    Folder,
    Eye,
    Trash2,
    SquarePen
} from "lucide-react";
import CreateFolderModal from "./CreateFolderModal";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { notify } from "@/lib/notification";
import ConfirmationModal from "../ui/ConfirmationModal";

export default function AllFolders({ folder }) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openFolderEdit, setOpenFolderEdit] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteFolderId, setDeleteFolderId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const foldersList = folder?.folders || []

    const handleDeleteFolder = async () => {
        if (deleteFolderId === null) return;
        try {
            setDeleting(true);
            const res = await api.delete("/folders/delete-folder", {
                data: {
                    id: deleteFolderId
                }
            })
            if (res?.data?.success) {
                notify.success(res?.data?.message || "Folder deleted successfully");
                setShowDeleteModal(false);
                router.refresh();
            }
        } catch (error) {
            console.error("Error deleting folder", error);
            setShowDeleteModal(false);
        } finally {
            setDeleting(false);
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

            {foldersList.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {foldersList.map((folder) => (
                        <div
                            key={folder.id}
                            onClick={() => router.push(`/folders/${folder.id}`)}
                            className="group relative overflow-hidden rounded-xl border dark:border-gray-700 border-gray-300 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-gray-900"
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
                                </div>
                            </div>

                            <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                                {folder.name}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Click to view notes
                            </p>

                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black-30 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        title="view note"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/folders/${folder.id}`)
                                        }}
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:scale-110 hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800 cursor-pointer"
                                    >
                                        <Eye size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        title="delete note"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteFolderId(folder.id);
                                            setShowDeleteModal(true);
                                        }}
                                        className="
                                            flex h-12 w-12 items-center justify-center
                                            rounded-full
                                            bg-red-500/90
                                            text-white
                                            shadow-lg
                                            transition
                                            hover:scale-110
                                            hover:bg-red-600
                                            cursor-pointer
                                        "
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        title="delete note"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFolder(folder);
                                            setOpenFolderEdit(true);
                                        }}
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:scale-110 hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800 cursor-pointer"
                                    >
                                        <SquarePen size={14} />
                                    </button>
                                </div>
                            </div>
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
            <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete folder?"
                message="Are you sure you want to delete this folder? This action cannot be undone"
                actionText={deleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                onCancel={() => setShowDeleteModal(false)}
                onAction={() => {
                    handleDeleteFolder();
                }}
            />
        </div>
    );
}

