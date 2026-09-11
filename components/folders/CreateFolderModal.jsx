"use client";

import { X, Folder } from "lucide-react";
import api from "@/lib/api";
import { notify } from "@/lib/notification";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateFolderModal({ onClose, isEdit = false, folderId, folderName = "" }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: folderName
    });
    const [error, setError] = useState({
        name: ""
    })
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    };

    const handleSubmit = async () => {

        try {
            setLoading(true);
            let res
            if (isEdit) {
                res = await api.put("/folders/update-folder", {
                    id: folderId,
                    name: formData.name
                })
            } else {
                res = await api.post("/folders/create-new-folder", formData);
            }
            if (res?.data?.success) {
                notify.success(res?.data?.message || (isEdit ? "Folder name updated" : "New folder created"));
                onClose();
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to create new folder", error);
        } finally {
            setLoading(false);
        }
    }
    
    
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
            >
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <Folder
                                size={20}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        </div>

                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {isEdit ? "Edit Folder" : "Create Folder"}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Folder Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        value={formData.name}
                        placeholder={isEdit ? "Enter new folder name" : "Enter folder name"}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? isEdit ? "Updating..." : "Creating..."  : isEdit ? "Update folder" : "Create folder"}
                    </button>
                </div>
            </div>
        </div>
    );
}

