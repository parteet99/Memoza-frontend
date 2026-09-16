"use client"
import { useState } from "react";
import { Trash2, Eye, Check } from "lucide-react";
import ConfirmationModal from "./ui/ConfirmationModal";
import NoteModal from "./notes/NoteModal";
import { notify } from "@/lib/notification";
import api from "@/lib/api";

export default function TrashFile({ notes }) {
    const [noteList, setNoteList] = useState(
        notes?.notes || []
    );
    const [selectedNote, setSelectedNote] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteNoteId, setDeleteNoteId] = useState([]);
    const [deleting, setDeleting] = useState(false);

    const handleSelectNote = (id) => {
        setDeleteNoteId((prev) => {
            if (prev.includes(id)) {
                // remove id if already selected
                return prev.filter((noteId) => noteId !== id);
            }

            return [...prev, id];   //add id
        })
    }

    const handleSelectAll = async () => {
        if (deleteNoteId.length === noteList.length) {
            setDeleteNoteId([]);
        } else {
            setDeleteNoteId(noteList.map((note) => note.id))
        }
    }

    const handleNoteClick = (note) => {
        setSelectedNote(note);
    };

    const closeModal = () => {
        setSelectedNote(null);
        setShowCreateModal(false);
    };

    const handleDeleteNote = async () => {
        if (deleteNoteId.length === 0) return;

        try {
            setDeleting(true);
            const res = await api.delete("/notes/permanent-delete", {
                data: {
                    ids: deleteNoteId
                }
            });
            if (res?.data?.success) {
                notify.success(res?.data?.message || "Note deleted successfully");
                setNoteList((prev) => prev.filter((note) => !deleteNoteId.includes(note.id)));
                setDeleteNoteId([]);
                setShowDeleteModal(false);
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Trash
                </h1>

                {noteList.length > 0 && (
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleSelectAll}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:brder-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            {deleteNoteId.length === noteList.length ? "Deselect all" : "Select all"}
                        </button>

                        {deleteNoteId.length > 0 && (
                            <button
                                type="button"
                                onClick={()=> setShowDeleteModal(true)}
                                className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                            >
                                <Trash2 size={16} />
                                Delete selected ({deleteNoteId.length})
                            </button>
                        )}
                    </div>
                )}
            </div>

            {noteList.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {noteList.map((note) => {
                        const isSelected = deleteNoteId.includes(note.id);

                        return (
                            <div
                                key={note.id}
                                className={`group relative overflow-hidden rounded-xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md
                                    ${isSelected ? "border-red-500 ring-2 ring-red-500/30" : "border-gray-300 dark:border-gray-700"}
                                `}
                            >

                                <button
                                    type="button"
                                    onClick={() => handleSelectNote(note.id)}
                                    className={`absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-md border transition
                                        ${isSelected ? "border-red-500 bg-red-500 text-white" : "border-gray-400 bg-white/80 text-transparent hover:border-red-400 dark:border-gray-600 dark:bg-gray-800/80"}
                                    `}
                                >
                                    <Check size={13} />
                                </button>
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
                                            title={
                                                isSelected
                                                    ? "Deselect note"
                                                    : "Select note"
                                            }
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectNote(note.id);
                                            }}
                                            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-lg transition hover:scale-110 ${isSelected
                                                    ? "bg-red-500 text-white"
                                                    : "bg-white/90 text-gray-800 dark:bg-gray-800/90 dark:text-white"
                                                }`}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center">
                    <p className="mb-4 text-gray-500 dark:text-gray-400">
                        No trash found
                    </p>
                </div>
            )}

            {selectedNote && (
                <NoteModal
                    note={selectedNote}
                    onClose={closeModal}
                    isDeleted={true}
                // onUpdated={handleNoteUpdated}
                />
            )}

            <ConfirmationModal
                isOpen={showDeleteModal}
                title="Permanent delete this note?"
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