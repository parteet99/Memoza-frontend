import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-dvh w-full overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
            <Sidebar />

            <main className="min-w-0 min-h-0 flex-1 overflow-y-auto">
                    {children}
            </main>
        </div>
    );
}