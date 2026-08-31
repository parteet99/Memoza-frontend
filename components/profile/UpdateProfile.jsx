"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { notify } from "@/lib/notification";
import { useRouter } from "next/navigation";

export default function UpdateProfile({ user, onClose, onSave }) {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
    });
    const userId = user.id;
    const router = useRouter();

    useEffect(() => {
        setFormData({
            id: userId || "",
            name: user?.name || "",
            email: user?.email || "",
        });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.put("/users/update-user", formData);
            if (res?.data?.success) {
                notify.success(res?.data?.message || "User updated successfully");
                router.refresh();
                onClose();
            }
        } catch (err) {
            console.err("Failed to update user", err)
            notify.error(err.response?.data?.message || "Cannot update user due to error");
       }
        onSave?.(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium"
                >
                    Full Name
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                />
            </div>


            <div>
                <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium"
                >
                    Email Address
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                />
            </div>


            <div className="flex justify-end gap-3 border-t pt-5">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-80"
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
}