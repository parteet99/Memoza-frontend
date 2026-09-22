"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import api from "@/lib/api";
import { notify } from "@/lib/notification";
import { useRouter } from "next/navigation";

export default function ResetPassword({ token }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            notify.error("Invalid or missing reset token");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            notify.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/auth/reset-password", {
                token,
                newPassword: formData.newPassword,
            });

            if (res?.data?.success) {
                notify.success(
                    res?.data?.message || "Password reset successfully"
                );
                router.push("/login");
            }
        } catch (err) {
            console.error("Reset password error", err);

            notify.error(
                err?.response?.data?.message ||
                "Unable to reset password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 text-[var(--foreground)]">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3"
                    >
                        <Image
                            src="/icon.png"
                            width={40}
                            height={40}
                            priority
                            alt="Memoza"
                        />

                        <span className="text-xl font-semibold tracking-tight">
                            Memoza
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">

                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">
                            Reset your password
                        </h1>

                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                            Enter your new password below to reset your
                            Memoza account password.
                        </p>
                    </div>

                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit}
                    >
                        {/* New Password */}
                        <div>
                            <label
                                htmlFor="newPassword"
                                className="mb-2 block text-sm font-medium"
                            >
                                New Password
                            </label>

                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                placeholder="Enter your new password"
                                required
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="
                                    h-11 w-full rounded-lg
                                    border border-[var(--border)]
                                    bg-[var(--background)]
                                    px-3
                                    text-sm
                                    text-[var(--foreground)]
                                    outline-none
                                    transition
                                    placeholder:text-[var(--muted-foreground)]
                                    focus:border-[var(--foreground)]
                                "
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium"
                            >
                                Confirm Password
                            </label>

                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your new password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="
                                    h-11 w-full rounded-lg
                                    border border-[var(--border)]
                                    bg-[var(--background)]
                                    px-3
                                    text-sm
                                    text-[var(--foreground)]
                                    outline-none
                                    transition
                                    placeholder:text-[var(--muted-foreground)]
                                    focus:border-[var(--foreground)]
                                "
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                h-11 w-full rounded-lg
                                bg-[var(--primary)]
                                text-sm font-medium
                                text-[var(--primary-foreground)]
                                transition
                                hover:opacity-90
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    {/* Back to login */}
                    <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
                        Remember your password?{" "}

                        <Link
                            href="/login"
                            className="font-medium text-[var(--foreground)] hover:underline"
                        >
                            Back to login
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
