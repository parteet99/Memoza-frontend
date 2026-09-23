"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { Sparkles, X } from "lucide-react";
import api from "@/lib/api";
import { notify } from "@/lib/notification";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => (
        <div className="h-[300px] animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
    )
});

 const quillModules = {
        toolbar: [[{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
        ],
    };

const quillFormats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "indent", "blockquote", "code-block", "link", "image"];

export default function NoteModal({ note, onClose, onUpdated, onCreated, isDeleted = false }) {
    const isCreateMode = !note;
    const [formData, setFormData] = useState({
        title: "",
        content: ""
    })

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [summary, setSummary] = useState("");
    const [isSummarizing, setIsSummarizing] = useState(false);
    const quillRef = useRef(null);

    useEffect(() => {
        if (note) {
            setFormData({
                title: note.title || "",
                content: note.content || ""
            });

            setSummary("");
            setIsEditing(false);
        } else {
            setFormData({
                title: "",
                content: ""
            })

            setSummary("");
            setIsEditing(true);
        }
    }, [note]);

    if (!note && !isCreateMode) return null;


    const handleTitleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            title: e.target.value
        }))
    }

    const handleContentChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            content: value
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

    const handleSummarize = async () => {
        if (!note?.content?.trim()) {
            notify.error("There is no content to summarize");
            return;
        }

        try {
            setIsSummarizing(true);
            const res = await api.post("/ai/summarize", {
                content: note.content
            })
            if (res?.data?.success) {
                setSummary(res?.data.summary || "");
                notify.success("Note summarized successfully");
            }
        } catch (error) {
            console.error("Summarize note error", error);
            notify.error(error?.response?.data?.message || "Failed to summarize note");
        } finally {
            setIsSummarizing(false);
         }
    }

    const handleImageUpload = () => {
        const input = document.createElement("input");

        input.type = "file";
        input.accept = "image/*";

        input.addEventListener("change", async (event) => {
            const file = event.target.files?.[0];

            if (!file) {
                notify.error("No file selected");
                return;
            }

            if (!file.type.startsWith("image/")) {
                notify.warning("Please select an image file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                notify.warning("Image must be less than 5MB");
                return;
            }

            try {
                notify.info("Uploading image...")
                
                const uploadData = new FormData();
                uploadData.append("image", file);

                const res = await api.post(
                    "/notes/upload-image",
                    uploadData
                );

                if (!res.data?.success) {
                    throw new Error(
                        res.data?.message || "Image upload failed"
                    );
                }

                const imageUrl = res.data.imageUrl;

                const quill = quillRef.current?.getEditor();

                if (!quill) {
                    notify.warning("Quill editor not found");
                    return;
                }

                const range = quill.getSelection(true);

                quill.insertEmbed(
                    range.index,
                    "image",
                    imageUrl
                );

                quill.setSelection(range.index + 1);

                notify.success("Image uploaded successfully");
            } catch (error) {
                console.error("Image upload error:", error);

                notify.error(
                    error?.response?.data?.message ||
                    "Failed to upload image"
                );
            }
        });

        input.click();
    };

    const setQuillRef = (instance) => {
        if (!instance) {
            quillRef.current = null;
            return;
        }

        quillRef.current = instance;
        const quill = instance.getEditor();
        const toolbar = quill.getModule("toolbar");

        if (toolbar) {
            toolbar.addHandler("image", handleImageUpload);
        }
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
            console.error(isCreateMode ? "Create note error" : "Update note error", error);

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
                        {isCreateMode
                            ? "Create note"
                            : isEditing
                              ? "Edit note"
                              : "Note"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg cursor-pointer px-3 py-1 text-2xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    >
                        <X size={20} />
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
                            onChange={handleTitleChange}
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
                        <div className="note-editor">
                            <ReactQuill
                                ref={setQuillRef}
                                theme="snow"
                                value={formData.content}
                                onChange={handleContentChange}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Write your note..."
                            />
                        </div>
                    ) : (
                        <div className="note-content">
                            {isSummarizing ? (
                                <p className="leading-7 text-gray-700 dark:text-gray-300">
                                    Summarizing your note...
                                </p>
                            ) : summary ? (
                                <p className="whitespace-pre-wrap leading-7 text-gray-700 dark:text-gray-300">
                                    {summary}
                                </p>
                            ) : formData.content ? (
                                <div
                                    className="prose max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{
                                        __html: formData.content,
                                    }}
                                />
                            ) : (
                                <p className="text-gray-500"> No content </p>
                            )}
                        </div>
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

                    <div className="flex items-center gap-3">
                        {!isCreateMode && !isEditing && !isDeleted && (
                            <button
                                type="button"
                                onClick={handleSummarize}
                                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md transition hover:scale-[1.02] cursor-pointer"
                                disabled={
                                    isSummarizing || !note?.content?.trim()
                                }
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
                                <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.35)_40%,transparent_60%)] bg-[length:200%_100%] transition-all duration-700 group-hover:bg-[position:100%_0]" />

                                <Sparkles size={16} className="relative" />
                                <span className="relative">
                                    {" "}
                                    {isSummarizing
                                        ? "Summarizing..."
                                        : "Summarize with AI"}{" "}
                                </span>
                            </button>
                        )}

                        {!isDeleted && (
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        {!isCreateMode && (
                                            <button
                                                onClick={handleCancel}
                                                disabled={isSaving}
                                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        )}

                                        <button
                                            onClick={handleSave}
                                            disabled={
                                                isSaving ||
                                                !formData.title.trim()
                                            }
                                            className="rounded-lg bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200 cursor-pointer"
                                        >
                                            {isSaving
                                                ? "Saving..."
                                                : isCreateMode
                                                  ? "Create note"
                                                  : "Save"}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="rounded-lg bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

