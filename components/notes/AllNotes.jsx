"use client";

import { useEffect, useState, useRef } from "react";
import NoteModal from "./NoteModal";
import { Eye, Trash2, FolderUp, Pin, Star, PinOff, StarOff, Archive, Search, Plus, Upload } from "lucide-react";
import ConfirmationModal from "../ui/ConfirmationModal";
import api from "@/lib/api";
import { notify } from "@/lib/notification";
import { useRouter } from "next/navigation";
import FolderSelector from "../folders/FolderSelector";
import Pagination from "../ui/Pagination";
import importNoteFromJson from "@/lib/importNote";
import importNoteFromText from "@/lib/importTextNote";

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
    const [openFolderSelector, setOpenFolderSelector] = useState(false);
    const [noteId, setNoteId] = useState(null);
    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);

    const [showImportMenu, setShowImportMenu] = useState(false);
    const [importType, setImportType] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setNoteList(notes?.notes || []);
    }, [notes]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            const query = search.trim();

            if (!query) {
                setNoteList(notes?.notes || []);
                return;
            }

            try {
                setSearching(true);
                const res = await api.get("/notes/search-note", {
                    params: {
                        query
                    }
                })
                if (res?.data?.success) {
                    setNoteList(res?.data?.notes || []);
                }
            } catch (error) {
                console.error("Error searching notes", error)
            } finally {
                setSearching(false);
            }
        }, 500)

        return () => clearTimeout(timer);
    }, [search, notes])
    
    const handleImportClick = (type) => {
        setImportType(type);
        setShowImportMenu(false);

        setTimeout(() => {
            fileInputRef.current?.click();
        }, 0);
    }

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            let note;

            if (importType === "json") {
                note = await importNoteFromJson(file);
            } else if (importType === "text") {
                note = await importNoteFromText(file);
            }

            if (!note) {
                throw new Error("Could not read the imported file")
            }

            const res = await api.post("/notes/import-note", {
                title: note.title,
                content: note.content,
                is_pinned: note.is_pinned ?? false,
                is_favorite: note.is_favorite ?? false,
                is_archived: note.is_archived ?? false
            })
            if (res?.data?.success) {
                notify.success(res?.data?.message || "Note imported successfully")
                router.refresh();
            }
        } catch (error) {
            console.error("Import error", error);
            notify.error(error?.response?.data?.message || error?.message || "Failed to import note");
        } finally {
            event.target.value = "";
            setImportType(null);
        }
    }

    const handleNoteClick = (note) => {
        setSelectedNote(note);
    };

    const closeModal = () => {
        setSelectedNote(null);
        setShowCreateModal(false);
    };

    const closeFolderSelector = () => {
        setOpenFolderSelector(false);
    }

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
        // setNoteList((prevNotes) => [
        //     newNote,
        //     ...prevNotes,
        // ]);

        setShowCreateModal(false);
        router.push("/notes?page=1")
    };

    const handleMoveToTrash = async () => {
        try {
            setDeleting(true);
            const res = await api.post("/notes/delete-note", {
                id: deleteNoteId
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

    const handlePinNote = async (noteId, isPinned) => {
        try {
            const res = await api.post("/notes/pin-note", {
                id: noteId,
                is_pinned: !isPinned
            })
            if (res?.data?.success) {
                notify.success(res?.data?.message || (isPinned ?  "Note Unpinned successfully" : "Note pinned successfully"));
                router.refresh();
            }
        } catch (error) {
            console.error("Error pinning note", error);
        }
    }

    const handleStarNote = async (noteId, isStarred) => {
        try {
            const res = await api.post("/notes/favorite-note", {
                id: noteId,
                is_favorite: !isStarred
            })
            if (res?.data?.success) {
                notify.success(res?.data?.message || (isStarred ?  "Note removed from favorite successfully" : "Note added to favorite successfully"));
                router.refresh();
            }
        } catch (error) {
            console.error("Error starring note", error);
        }
    }

    const handleArchiveNote = async (noteId, isArchived) => {
        try {
            const res = await api.post("/notes/archive-note", {
                id: noteId,
                is_archived: !isArchived
            })
            if (res?.data?.success) {
                notify.success(res?.data?.message || "Note archived successfully");
                router.refresh();
            }
        } catch (error) {
            console.error("Error archiving note", error);
        }
    }

    return (
        <>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        All Notes
                    </h1>

                    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:items-center">
                        <div className="relative w-full sm:w-80">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search notes"
                                className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowImportMenu((prev) => !prev)}
                                    className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 transition hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 cursor-pointer"
                                >
                                    <Upload size={16} />
                                    Import
                                </button>
                                {showImportMenu && (
                                    <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
                                        <button
                                            type="button"
                                            onClick={() => handleImportClick("json")}
                                            className="flex w-full items-center px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                                        >
                                            Import JSON
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleImportClick("text")}
                                            className="flex w-full items-center px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                                        >
                                            Import text
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-black px-4 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            >
                                <Plus size={16} />
                                New Note
                            </button>
                        </div>
                    </div>
                </div>

                {noteList.length > 0 ? (
                    <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {noteList.map((note) => (
                            <div
                                key={note.id}
                                className="group relative overflow-hidden rounded-xl border dark:border-gray-700 border-gray-300 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                {/* Title */}
                                <h3 className="mb-2 truncate text-lg font-semibold text-gray-900 dark:text-white">
                                    {note.title}
                                </h3>

                                <div className="mb-4 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                    <p
                                        className="prose max-w-none dark:prose-invert"
                                        dangerouslySetInnerHTML={{
                                            __html: note.content,
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                                    <span>
                                        {new Date(
                                            note.updated_at
                                        ).toLocaleDateString()}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        {note.is_pinned && (
                                            <span className="text-gray-700 dark:text-gray-300">
                                                <Pin size={14} />
                                            </span>
                                        )}
                                        {note.is_favorite && (
                                            <span className="text-gray-700 dark:text-gray-300">
                                                <Star size={14} />
                                            </span>
                                        )}
                                    </div>

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
                                            title="delete note"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenFolderSelector(true);
                                                setNoteId(note.id);
                                            }}
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:scale-110 hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800 cursor-pointer"
                                        >
                                            <FolderUp size={14} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            title={note.is_pinned ? "Unpin note": "Pin note"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePinNote(note.id, note.is_pinned)
                                            }}
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:scale-110 hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800 cursor-pointer"
                                        >
                                            {note.is_pinned ? <PinOff size={14} />  : <Pin size={14} />}
                                        </button>
                                        <button
                                            type="button"
                                            title={note.is_favorite ? "Unstar note": "Star note"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStarNote(note.id, note.is_favorite);
                                            }}
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:scale-110 hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800 cursor-pointer"
                                        >
                                            {note.is_favorite ? <StarOff size={14} />  : <Star size={14} />}
                                        </button>
                                        <button
                                            type="button"
                                            title="Archive note"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleArchiveNote(note.id, note.is_archived);
                                            }}
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:scale-110 hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800 cursor-pointer"
                                        >
                                            <Archive size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {!search.trim() && (
                        <Pagination
                            currentPage={notes?.pagination?.page || 1}
                            totalPages={notes?.pagination?.totalPages || 1}
                        />
                    )}
                </>
                ) : (
                    <div className="flex min-h-[300px] flex-col items-center justify-center">
                        <p className="mb-4 text-gray-500 dark:text-gray-400">
                            {search.trim() ? "No notes match your search" : "No notes found"}
                        </p>

                        {!search.trim() && (
                            <button
                                onClick={() =>
                                    setShowCreateModal(true)
                                }
                                className="rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
                            >
                                Create your first note
                            </button>
                        )}
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
                title="Move note to tras?"
                message="Are you sure you want to move this note to trash? You can restore from trash anytime"
                actionText={deleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                onCancel={() => setShowDeleteModal(false)}
                onAction={() => {
                    handleMoveToTrash();
                }}
            />

            <FolderSelector isOpen={openFolderSelector} onClose={closeFolderSelector} noteId={noteId} />

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={
                    importType === "json"
                        ? ".json,application/json"
                        : ".txt,text/plain"
                }
                onChange={handleFileChange}
            />
        </>
    );
}

