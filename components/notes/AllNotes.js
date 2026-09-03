"use client";

import { useEffect, useState } from "react";
import NoteModal from "./NoteModal";
import { Eye, Trash2 } from "lucide-react";
import ConfirmationModal from "../ui/ConfirmationModal";
import api from "@/lib/api";
import { notify } from "@/lib/notification";
import { useRouter } from "next/navigation";

export default function AllNotes({ notes }) {
    const [noteList, setNoteList] = useState(
        notes?.notes || []
    );
    const router = useRouter();

    const [selectedNote, setSelectedNote] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteNoteId, setDeleteNoteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        setNoteList(notes?.notes || []);
    }, [notes]);

    const handleNoteClick = (note) => {
        setSelectedNote(note);
    };

    const closeModal = () => {
        setSelectedNote(null);
        setShowCreateModal(false);
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

    //add new created note to grid
    const handleNoteCreated = (newNote) => {
        setNoteList((prevNotes) => [
            newNote,
            ...prevNotes,
        ]);

        setShowCreateModal(false);
    };

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
                router.refresh();
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
        <>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        All Notes
                    </h1>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        + New Note
                    </button>
                </div>

                {noteList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {noteList.map((note) => (
                            <div
                                key={note.id}
                                onClick={() =>
                                    handleNoteClick(note)
                                }
                                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
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

                                    {note.is_pinned && (
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Pinned
                                        </span>
                                    )}
                                </div>

                                <div
                                    className="absolute inset-0 flex items-center justify-center gap-4 bg-black-30 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                >
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
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-[300px] flex-col items-center justify-center">
                        <p className="mb-4 text-gray-500 dark:text-gray-400">
                            No notes found
                        </p>

                        <button
                            onClick={() =>
                                setShowCreateModal(true)
                            }
                            className="rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
                        >
                            Create your first note
                        </button>
                    </div>
                )}
            </div>

            {selectedNote && (
                <NoteModal
                    note={selectedNote}
                    onClose={closeModal}
                    onUpdated={handleNoteUpdated}
                />
            )}

            {showCreateModal && (
                <NoteModal
                    note={null}
                    onClose={closeModal}
                    onCreated={handleNoteCreated}
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
        </>
    );
}

