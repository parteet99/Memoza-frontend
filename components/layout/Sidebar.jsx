"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    NotebookPen,
    Star,
    Trash2,
    Folder,
    Tags,
    Settings,
    User,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";

const navigation = [
    {
        title: "Notes",
        href: "/notes",
        icon: NotebookPen,
    },
    {
        title: "Favorites",
        href: "/favorites",
        icon: Star,
    },
    {
        title: "Trash",
        href: "/trash",
        icon: Trash2,
    },
];

const workspaceNavigation = [
    {
        title: "Folders",
        href: "/folders",
        icon: Folder,
    },
    {
        title: "Tags",
        href: "/tags",
        icon: Tags,
    },
];

const bottomNavigation = [
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
    {
        title: "Profile",
        href: "/profile",
        icon: User,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (href) => {
        if (href === "/notes") {
            return pathname === "/notes" || pathname.startsWith("/notes/");
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <aside
            className={`
                relative flex h-screen flex-col
                border-r border-[var(--border)]
                bg-[var(--background)]
                text-[var(--foreground)]
                transition-all duration-300 ease-in-out
                ${collapsed ? "w-[72px]" : "w-[260px]"}
            `}
        >
            {/* Header */}
            <div
                className={`
                    flex h-16 shrink-0 items-center
                    border-b border-[var(--border)]
                    ${collapsed
                        ? "justify-center px-3"
                        : "justify-between px-4"
                    }
                `}
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="flex min-w-0 items-center gap-3"
                >
                    <div
                        className="
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-xl
                            bg-[var(--primary)]
                            text-sm font-bold
                            text-[var(--primary-foreground)]
                        "
                    >
                        M
                    </div>

                    {!collapsed && (
                        <span className="truncate text-lg font-semibold tracking-tight">
                            Memoza
                        </span>
                    )}
                </Link>

                {/* Collapse button */}
                {!collapsed && (
                    <button
                        type="button"
                        onClick={() => setCollapsed(true)}
                        aria-label="Collapse sidebar"
                        className="
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-lg
                            text-[var(--muted-foreground)]
                            transition-colors
                            hover:bg-[var(--muted)]
                            hover:text-[var(--foreground)]
                        "
                    >
                        <PanelLeftClose
                            size={19}
                            strokeWidth={1.8}
                        />
                    </button>
                )}
            </div>

            {/* Expand button */}
            {collapsed && (
                <div className="flex justify-center px-3 py-3">
                    <button
                        type="button"
                        onClick={() => setCollapsed(false)}
                        aria-label="Expand sidebar"
                        className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-lg
                            text-[var(--muted-foreground)]
                            transition-colors
                            hover:bg-[var(--muted)]
                            hover:text-[var(--foreground)]
                        "
                    >
                        <PanelLeftOpen
                            size={19}
                            strokeWidth={1.8}
                        />
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                {/* Main navigation */}
                <div className="space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={
                                    collapsed
                                        ? item.title
                                        : undefined
                                }
                                className={`
                                    group flex h-11
                                    items-center rounded-xl
                                    transition-all duration-200
                                    ${
                                        collapsed
                                            ? "justify-center px-2"
                                            : "gap-3 px-3"
                                    }
                                    ${
                                        active
                                            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                            : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                    }
                                `}
                            >
                                <Icon
                                    size={20}
                                    strokeWidth={active ? 2 : 1.8}
                                    className="shrink-0"
                                />

                                {!collapsed && (
                                    <span className="truncate text-sm font-medium">
                                        {item.title}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Workspace */}
                <div className="mt-8">
                    {!collapsed && (
                        <p
                            className="
                                mb-2 px-3
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-wider
                                text-[var(--muted-foreground)]
                            "
                        >
                            Workspace
                        </p>
                    )}

                    <div className="space-y-1">
                        {workspaceNavigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    title={
                                        collapsed
                                            ? item.title
                                            : undefined
                                    }
                                    className={`
                                        group flex h-11
                                        items-center rounded-xl
                                        transition-all duration-200
                                        ${
                                            collapsed
                                                ? "justify-center px-2"
                                                : "gap-3 px-3"
                                        }
                                        ${
                                            active
                                                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                        }
                                    `}
                                >
                                    <Icon
                                        size={20}
                                        strokeWidth={active ? 2 : 1.8}
                                        className="shrink-0"
                                    />

                                    {!collapsed && (
                                        <span className="truncate text-sm font-medium">
                                            {item.title}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Bottom navigation */}
            <div
                className="
                    shrink-0
                    border-t
                    border-[var(--border)]
                    p-3
                "
            >
                <div className="space-y-1">
                    {bottomNavigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={
                                    collapsed
                                        ? item.title
                                        : undefined
                                }
                                className={`
                                    group flex h-11
                                    items-center rounded-xl
                                    transition-all duration-200
                                    ${
                                        collapsed
                                            ? "justify-center px-2"
                                            : "gap-3 px-3"
                                    }
                                    ${
                                        active
                                            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                            : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                    }
                                `}
                            >
                                <Icon
                                    size={20}
                                    strokeWidth={active ? 2 : 1.8}
                                    className="shrink-0"
                                />

                                {!collapsed && (
                                    <span className="truncate text-sm font-medium">
                                        {item.title}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}