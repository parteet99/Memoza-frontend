"use client";

import Link from "next/link";
import api from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/notification";
import Image from "next/image";


export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleChange = async (e) => {
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

        if (!formData.name.trim()) {
            errors.name = "Name is required"
        }

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
            const res = await api.post("/users/register", formData);
            if (res?.data?.success) {
                notify.success(res?.data?.message || "Signup successfull");
                router.push("/login");
            }
        } catch (err) {
            console.error("Signup error:", err);
            notify.error(err?.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center py-2 justify-center bg-[var(--background)] px-4 text-[var(--foreground)]">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-5 text-center">
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
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
                    <div className="mb-5">
                        <h1 className="text-2xl font-semibold">
                            Create your account
                        </h1>

                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                            Start organizing your thoughts with Memoza.
                        </p>
                    </div>

                    <form className="space-y-3" noValidate onSubmit={handleSubmit}>
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium"
                            >
                                Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.value}
                                onChange={handleChange}
                                placeholder="Your name"
                                className={`
                                    h-11 w-full rounded-lg
                                    border
                                    bg-[var(--background)]
                                    px-3
                                    text-sm
                                    text-[var(--foreground)]
                                    outline-none
                                    transition
                                    placeholder:text-[var(--muted-foreground)]
                                    focus:border-[var(--foreground)]
                                    ${error.name ? "border-red-500 focus:border-red-500" : "border-[var(--border)]"}
                                    `}
                                
                            />
                        </div>
                        {error.name && (
                            <p className="text-xs text-red-500">
                                {error.name}
                            </p>
                        )}

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
                                className={`
                                    h-11 w-full rounded-lg
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
                                `}
                            />
                        </div>
                        {error.email && (
                            <p className="text-xs text-red-500">
                                {error.email}
                            </p>
                        )}

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`
                                    h-11 w-full rounded-lg
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
                                `}
                                />
                            <button
                                type="button"
                                onClick={(e) => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-[var(--muted-foreground)] hover:text-[-var(--foreground)]"
                            >
                                {showPassword ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                            </div>
                        </div>
                        {error.password && (
                            <p className="text-xs text-red-500">
                                {error.password}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="
                                h-11 w-full rounded-lg
                                bg-[var(--primary)]
                                text-sm font-medium
                                text-[var(--primary-foreground)]
                                transition
                                hover:opacity-90
                                cursor-pointer
                            "
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    {/* Login */}
                    <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-[var(--foreground)] hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}