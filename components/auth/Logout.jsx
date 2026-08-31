"use client"

import { LogOut } from "lucide-react";
import api from "@/lib/api";
import { notify } from "@/lib/notification";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Logout() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    const handleLogout = async () => {
        try {
            const res = await api.post("/auth/logout")
            if (res?.data?.success) {
                notify.success(res?.message || "Logout successfull");
                router.push("/login");
            }
        } catch (err) {
            console.error("Logout failed", err);
            notify.error(err.message || "Logout failed");
        } finally {
            setLoading(false);
        }
    }
    return (
        <button
            type="button"
            onClick={handleLogout}
            className="
                flex h-10 w-10 items-center justify-center
                rounded-lg
                border border-[var(--border)]
                bg-[var(--card)]
                text-[var(--foreground)]
                transition
                hover:bg-[var(--muted)]
            "
            aria-label = "Logout"
        >
            <LogOut size={18} />
        </button>
    )
}