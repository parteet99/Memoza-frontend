"use client"
import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";
import MobileHeader from "@/components/layout/MobileHeader";

export default function DashboardLayout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
        <div className="flex h-dvh w-full overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
            <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
            
            <div className="flex min-w-0 flex-1 flex-col">
                <MobileHeader onMenuClick={() => setMobileOpen(true)} />
                <main className="min-w-0 min-h-0 flex-1 overflow-y-auto">
                        {children}
                </main>
            </div>

        </div>
    );
}