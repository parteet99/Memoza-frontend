import Image from "next/image";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Logout from "@/components/auth/Logout";
import AllNotes from "@/components/notes/AllNotes";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6">

        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Memoza
          </h1>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Logout />
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">

            <h2 className="text-2xl font-bold">
              Your thoughts,
              <br />
              organized
            </h2>

            <p className="mt-4 text-[var(--muted-foreground)]">
              Capture, organize and access your notes
              from anywhere.
            </p>

            <button
              className="
                mt-6
                rounded-lg
                bg-[var(--primary)]
                px-5
                py-3
                font-medium
                text-[var(--primary-foreground)]
                transition
                hover:opacity-90
              "
            >
              Get Started
            </button>
          </div>
        </section>
      </div> */}

      <AllNotes />

    </main>
  );
}
