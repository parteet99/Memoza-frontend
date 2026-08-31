"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { notify } from "@/lib/notification";


export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const res = await api.post(
                "/auth/login",
                formData
            )
            if (res?.data?.success) {
                notify.success(res?.data?.message || "Login successful");
                const userId = res?.data?.user?.id;
                if (userId) {
                    document.cookie = `userId=${userId}; path=/; max-age=${60*60*24*7};` //7 days
                }
                router.push("/");
            }
        } catch (err) {
            console.error("Login error", err);
            notify.error(err.response?.data?.message || "Invalid email or password")
        } finally {
            setLoading(false);
        }
    }
    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 text-[var(--foreground)]">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)]">
                            M
                        </div>

                        <span className="text-xl font-semibold tracking-tight">
                            Memoza
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                            Login to continue to your notes.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
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
                                value={formData.email}
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

                        {/* Password */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    Password
                                </label>

                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                                value={formData.password}
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

                        {error && (
                            <p className="text-sm text-red-500">
                                {error}
                            </p>
                        )}

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
                            "
                        >
                            {loading ? "Loggin in...": "Login"}
                        </button>
                    </form>

                    {/* Signup */}
                    <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-medium text-[var(--foreground)] hover:underline"
                        >
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}