"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import api from "@/lib/api";
// import axios from "axios";
import { notify } from "@/lib/notification";
import Image from "next/image";


export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(formData.email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            errors.password = "Password is required";
        }

        setError(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || data.error || "Login failed");
            }

            notify.success(data.message || "Login successful");

            const user = data.user;

            if (user) {
                document.cookie = `userId=${user.id}; path=/; max-age=${60 * 60 * 24 * 7}`;
                document.cookie = `userName=${encodeURIComponent(user.name)}; path=/; max-age=${60 * 60 * 24 * 7}`;
            }

            router.push("/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            notify.error(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };
    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 text-[var(--foreground)]">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
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
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                            Login to continue to your notes.
                        </p>
                    </div>

                    <form className="space-y-3" noValidate onSubmit={handleSubmit}>
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
                                value={formData.email}
                                onChange={handleChange}
                                className={
                                    `h-11 w-full rounded-lg
                                    border 
                                    bg-[var(--background)]
                                    px-3
                                    text-sm
                                    text-[var(--foreground)]
                                    outline-none
                                    transition
                                    placeholder:text-[var(--muted-foreground)]
                                    focus:border-[var(--foreground)]
                                    ${error.email ? "border-red-500 focus:border-red-500" : "border-[var(--border)]"}
                                    `
                                }
                            />
                        </div>
                        {error.email && (
                            <p className="text-xs text-red-500">
                                {error.email}
                            </p>
                        )}

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
                                value={formData.password}
                                onChange={handleChange}
                                className={
                                    `h-11 w-full rounded-lg
                                    border 
                                    bg-[var(--background)]
                                    px-3
                                    text-sm
                                    text-[var(--foreground)]
                                    outline-none
                                    transition
                                    placeholder:text-[var(--muted-foreground)]
                                    focus:border-[var(--foreground)]
                                    ${error.password ? "border-red-500 focus:border-red-500" : "border-[var(--border)]"}
                                    `
                                }
                            />
                        </div>

                        {error.password && (
                            <p className="text-xs text-red-500">
                                {error.password}
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