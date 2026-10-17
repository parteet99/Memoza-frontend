"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "./api";

export default function AuthGuard({children}) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        api.get("/auth/me").then(() => setChecking(false)).catch(() => router.replace("/login"))
    }, [router]);

    if (checking) return null;
    return children;
}