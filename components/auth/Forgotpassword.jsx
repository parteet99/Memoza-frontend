"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import api from "@/lib/api";
import { notify } from "@/lib/notification";

export default function ForgetPass() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const res = await api.post("/auth/forget-password", {
                email,
            });

            if (res?.data?.success) {
                notify.success(
                    res?.data?.message || "Password reset link sent to your email"
                );
            }
        } catch (err) {
            console.error("Forgot password error", err);

            notify.error(
                err?.response?.data?.message ||
                "Something went wrong. Please try again."
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
                            Forgot your password?
                        </h1>

                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                            Enter your email address and we'll send you a link
                            to reset your password.
                        </p>
                    </div>

                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit}
                    >
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                disabled:opacity-60 cursor-pointer
                            "
                        >
                            {loading ? "Sending..." : "Send reset link"}
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
