"use client"

import { useState } from "react"
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import api from "@/lib/api"
import { notify } from "@/lib/notification";

export default function ChangePass() {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    })
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.oldPassword) {
            newErrors.oldPassword = "Old password is required";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required"
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password"
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords did not match"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const res = await api.put("/auth/change-password", {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            })
            if (res?.data?.success) {
                notify.success(res?.data?.message || "Password updated successfully");
                setFormData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            }
        } catch (error) {
            console.error("Error changing password", error);
            notify.error(error?.response?.data?.message || "Error changing password");
        } finally {
            setLoading(false);
        }
    }

    const renderPasswordInput = (name, placeholder, key) => (
        <div className="relative">
            <input
                type={showPassword[key] ? "text" : "password"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-4 py-3 pr-12 text-sm text-gray-900 dark:text-gray-300 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:placeholder-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-800"
            />
            <button
                type="button"
                onClick={() => {
                    setShowPassword((prev) => ({
                        ...prev,
                        [key]: !prev[key]
                    }))
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
                {showPassword[key] ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
        </div>
    )
    return (
        <div className="min-h-full p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Change password
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Update your password to keep your account secure  
                </p>
            </div>

            <div className="max-w-xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                        <LockKeyhole
                            size={20}
                            className="text-gray-700 dark:text-gray-300"
                        />
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            Password settings
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your current and new password
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Current password
                        </label>
                        {renderPasswordInput(
                            "oldPassword",
                            "Enter current password",
                            "old"
                        )}
                        {errors.oldPassword && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.oldPassword}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            New password
                        </label>
                        {renderPasswordInput(
                            "newPassword",
                            "Enter new password",
                            "new"
                        )}
                        {errors.newPassword && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.newPassword}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm new password
                        </label>
                        {renderPasswordInput(
                            "confirmPassword",
                            "Confirm password",
                            "confirm"
                        )}
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900"
                    >
                        {loading ? "Changing password..." : "Change password"} 
                    </button>
                </form>
            </div>
        </div>
    )
}