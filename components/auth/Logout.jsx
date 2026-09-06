"use client";

import { LogOut } from "lucide-react";
import api from "@/lib/api";
import { notify } from "@/lib/notification";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Logout({ collapsed }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            setLoading(true);

            const res = await api.post("/auth/logout");

            if (res?.data?.success) {
                notify.success(
                    res?.data?.message || "Logout successful"
                );

                router.push("/login");
            }
        } catch (err) {
            console.error("Logout failed", err);
            notify.error(
                err?.message || "Logout failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            title={collapsed ? "Logout" : undefined}
            aria-label="Logout"
            className={`
                group flex h-11 w-full
                items-center rounded-xl
                text-[var(--muted-foreground)]
                transition-all duration-200
                hover:bg-[var(--muted)]
                hover:text-[var(--foreground)]
                disabled:cursor-not-allowed
                disabled:opacity-50
                cursor-pointer
                ${collapsed
                    ? "justify-center px-2"
                    : "gap-3 px-3"
                }
            `}
        >
            <LogOut
                size={20}
                strokeWidth={1.8}
                className="shrink-0"
            />

            {!collapsed && (
                <span className="text-sm font-medium">
                    {loading ? "Logging out..." : "Logout"}
                </span>
            )}
        </button>
    );
}