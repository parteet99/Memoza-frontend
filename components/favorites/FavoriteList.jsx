"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import NoteModal from "../notes/NoteModal";
import { Eye, Trash2, Star, StarOff } from "lucide-react";
import api from "@/lib/api";
import { notify } from "@/lib/notification";
import ConfirmationModal from "../ui/ConfirmationModal";

export default function FavoriteList({ notes }) {
    const router = useRouter();
    const [noteList, setNoteList] = useState(
        notes?.note || []
    );
    const [selectedNote, setSelectedNote] = useState(null);
    const [deleteNoteId, setDeleteNoteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleNoteClick = (note) => {
        setSelectedNote(note);
    };

    const closeModal = () => {
        setSelectedNote(null);
    };

    const handleNoteUpdated = (updatedNote) => {
        setNoteList((prevNotes) =>
            prevNotes.map((note) =>
                note.id === updatedNote.id
                    ? updatedNote
                    : note
            )
        );

        setSelectedNote(updatedNote);
    };

    const handleStarNote = async (noteId, isStarred) => {
        try {
            const res = await api.post("/notes/favorite-note", {
                id: noteId,
                is_favorite: !isStarred
            })
            if (res?.data?.success) {
                notify.success(res?.data?.message || (isStarred ? "Note removed from favorite successfully" : "Note added to favorite successfully"));
                if (isStarred) {
                    setNoteList((prev) => prev.filter((note) => note.id !== noteId));
                }
            }
        } catch (error) {
            console.error("Error starring note", error);
        }
    }

    const handleDeleteNote = async () => {
        try {
            setDeleting(true);
            const res = await api.delete("/notes/delete-note", {
                data: {
                    id: deleteNoteId
                }
            });
            if (res?.data?.success) {
                notify.success(res?.data?.message || "Note deleted successfully");
                setNoteList((prev) => prev.filter((note) => note.id !== deleteNoteId))
                setShowDeleteModal(false);
                setDeleteNoteId(null);
            }
        } catch (err) {
            console.error("Failed to delete note", err);
            notify.error(err?.response?.data?.message || "Cannot delete note")
        } finally {
            setDeleting(false);
        }
    } 

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Favorites
                </h1>
            </div>

            {noteList.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {noteList.map((note) => (
                        <div
                            key={note.id}
                            className="group relative overflow-hidden rounded-xl border border-gray-300 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <h3 className="mb-2 truncate text-lg font-semibold dark:text-white">
                                {note.title}
                            </h3>

                            <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                                {note.content || "No content"}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                                <span>
                                    {new Date(
                                        note.updated_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black-30 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        title="view note"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNoteClick(note);
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
                                            setDeleteNoteId(note.id);
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
                                        title={note.is_favorite ? "Unstar note" : "Star note"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStarNote(note.id, note.is_favorite);
                                        }}
                                        className="
                                                flex h-12 w-12 items-center justify-center
                                                rounded-full
                                                shadow-lg
                                                transition
                                                hover:scale-110
                                                hover:bg-white
                                                dark:hover:bg-gray-800
                                                cursor-pointer
                                            "
                                    >
                                        {note.is_favorite ? <StarOff size={14} /> : <Star size={14} />}
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center">
                    <p className="mb-4 text-gray-500 dark:text-gray-400">
                        No favorite notes found
                    </p>

                    <button
                        onClick={() => router.push("/notes")}
                        className="rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
                    >
                        Add notes to favorite
                    </button>
                </div>
            )}

            {selectedNote && (
                <NoteModal
                    note={selectedNote}
                    onClose={closeModal}
                    onUpdated={handleNoteUpdated}
                />
            )}


            <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete note?"
                message="Are you sure you want to delete this note? This action cannot be undone."
                actionText={deleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                onCancel={() => setShowDeleteModal(false)}
                onAction={() => {
                    handleDeleteNote();
                }}
            />
        </div>
    )
}