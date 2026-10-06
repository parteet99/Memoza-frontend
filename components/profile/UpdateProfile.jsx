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
    const [error, setError] = useState({});
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

        setError((prev) => ({
            ...prev,
            [name]: ""
        }))
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = "Name is required"
        }

        if (!formData.email) {
            errors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(formData.email)) {
            errors.email = "Please enter a valid email address";
        }

        setError(errors);

        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

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
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                    className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary ${error.name ? "border-red-500" : "dark:border-gray-800"}`}
                />
                {error.name && (
                    <p className="mt-1 text-xs text-red-500">
                        {error.name}
                    </p>
                )}
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
                    className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary ${error.email ? "border-red-500" : "dark:border-gray-800"}`}
                />
                {error.email && (
                    <p className="mt-1 text-xs text-red-500">
                        {error.email}
                    </p>
                )}
            </div>


            <div className="flex justify-end gap-3 pt-5">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg cursor-pointer px-4 py-2 text-sm font-medium transition hover:bg-muted hover:opacity-80"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="rounded-lg bg-gray-950 dark:bg-white dark:text-black text-white px-4 py-2 text-sm font-medium transition hover:opacity-80 cursor-pointer"
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
}