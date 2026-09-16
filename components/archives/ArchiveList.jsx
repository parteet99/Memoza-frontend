"use client"
import { useState } from "react"
import api from "@/lib/api";
import { ArchiveRestore, Trash2, Eye } from "lucide-react";
import NoteModal from "../notes/NoteModal";
import ConfirmationModal from "../ui/ConfirmationModal";
import { notify } from "@/lib/notification";

export default function ArchiveList({ notes }) {
    const [noteList, setNoteList] = useState(notes?.notes || []);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteNoteId, setDeleteNoteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

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

    const handleMoveToTrash = async () => {
        try {
            setDeleting(true);
            const res = await api.post("/notes/delete-note", {
                id: deleteNoteId
            });
            if (res?.data?.success) {
                notify.success(res?.data?.message || "Note deleted successfully");
                setNoteList((prev) => prev.filter((note) => note.id !== deleteNoteId));
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

    const handleUnarchive = async (noteId, isArchived) => {
        try {
            const res = await api.post("/notes/archive-note", {
                id: noteId,
                is_archived: !isArchived
            });
            if (res?.data?.success) {
                notify.success(res?.data?.message || "Note unarchived successfully");
                setNoteList((prev) => prev.filter((note) => note.id !== noteId));
            }
        } catch (err) {
            console.error("Failed to unarchive note", err);
            notify.error(err?.response?.data?.message || "Cannot unarchive note")
        }
    }


    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Archive
                </h2>
            </div>

            {noteList.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {noteList.map((note) => (
                        <div
                            key={note.id}
                            className="group relative overflow-hidden rounded-xl border border-gray-300 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            {/* Title */}
                            <h3 className="mb-2 truncate text-lg font-semibold text-gray-900 dark:text-white">
                                {note.title}
                            </h3>

                            <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                {note.content || "No content"}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                                <span>
                                    {new Date(
                                        note.updated_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            <div
                                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black-30 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            >
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
                                        title="Unarchive note"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUnarchive(note.id, note.is_archived);
                                        }}
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:scale-110 hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800 cursor-pointer"
                                    >
                                        <ArchiveRestore size={14} />
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center">
                    <p className="mb-4 text-gray-500 dark:text-gray-400">
                        No archives found
                    </p>
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
                title="Move note to tras?"
                message="Are you sure you want to move this note to trash? You can restore from trash anytime."
                actionText={deleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                onCancel={() => setShowDeleteModal(false)}
                onAction={() => {
                    handleMoveToTrash();
                }}
            />
        </div>
    )
}