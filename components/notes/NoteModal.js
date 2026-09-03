"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { notify } from "@/lib/notification";

export default function NoteModal({ note, onClose, onUpdated, onCreated }) {
    const isCreateMode = !note;
    const [formData, setFormData] = useState({
        title: "",
        content: ""
    })

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (note) {
            setFormData({
                title: note.title || "",
                content: note.content || ""
            });

            setIsEditing(false);
        } else {
            setFormData({
                title: "",
                content: ""
            })

            setIsEditing(true);
        }
    }, [note]);

    if (!note && !isCreateMode) return null;


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCancel = () => {
        if (isCreateMode) {
            onClose();
            return;
        }

        setFormData({
            title: note.title || "",
            content: note.content || ""
        })
        setIsEditing(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);

            if (isCreateMode) {
                const res = await api.post("/notes/create-note", formData);
                if (res?.data?.success) {
                    notify.success(res?.data?.message || "New note created");
                    if (onCreated) {
                        onCreated(res.data?.note);
                    }
                    onClose();
                    return;
                }
            }

            const res = await api.post("/notes/update-note", {
                id: note.id,
                title: formData.title,
                content: formData.content
            });

            if (res?.data?.success) {
                notify.success(res?.data?.message || "Note updated.");
                setIsEditing(false);
                if (onUpdated) {
                    onUpdated(res?.data?.note);
                }
            }
        } catch (error) {
            console.error(isCreateMode ? "Create note error" : "Update note error", err);

            notify.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {isCreateMode ? "Create note" : isEditing ? "Edit note" : "Note"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg px-3 py-1 text-2xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[70vh] overflow-y-auto p-6">
                    {/* Title */}
                    {isEditing ? (
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Note title"
                            className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xl font-semibold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-400"
                            autoFocus
                        />
                    ) : (
                        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                            {formData.title}
                        </h1>
                    )}

                    {/* Content */}
                    {isEditing ? (
                        <textarea
                            value={formData.content}
                            name="content"
                            onChange={handleChange}
                            placeholder="Write your note..."
                            rows={12}
                            className="w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-400"
                        />
                    ) : (
                        <p className="whitespace-pre-wrap leading-7 text-gray-700 dark:text-gray-300">
                            {formData.content || "No content"}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                    {!isCreateMode ? (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            Updated{" "}
                            {new Date(note.updated_at).toLocaleDateString()}
                        </span>
                    ) : (
                        <span />
                    )}

                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                {!isCreateMode && (
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Cancel
                                    </button>
                                )}

                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || !formData.title.trim()}
                                    className="rounded-lg bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                >
                                    {isSaving ? "Saving..." : isCreateMode ? "Create note" : "Save"}
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="rounded-lg bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

