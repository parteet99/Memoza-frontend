"use client"

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function MobileHeader({ onMenuClick }) {
    const pathname = usePathname();
    const base = "/" + pathname.split("/")[1];
    return (
        <header
            className="flex h-24 shrink-0 items-center gap-3 px-4 border-b border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] md:hidden"
        >
            <button
                type="button"
                onClick={onMenuClick}
                aria-label="Open menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted-foreground)]"
            >
                <Menu size={20} strokeWidth={1.8} />
            </button>

            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
                <Image src="/icon.png" width={60} height={60} alt="Memoza" className="rounded-md"/>
            </nav>
        </header>
    )
}