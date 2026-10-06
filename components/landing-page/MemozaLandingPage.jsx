import Link from "next/link";
import { ArrowRight, Archive, Check, FileText, Folder, Menu, Pin, Search } from "lucide-react";

export default function MemozaLandingPage() {
    return (
        <main className="min-h-screen bg-white text-slate-950">
            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-slate-900">
                            <FileText size={17} strokeWidth={2.5} />
                        </span>
                        <span className="text-lg font-semibold tracking-tight">Memoza</span>
                    </Link>

                    <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
                        <a href="#features" className="transition hover:text-slate-950">Features</a>
                        <a href="#how-it-works" className="transition hover:text-slate-950">How it works</a>
                        <a href="#about" className="transition hover:text-slate-950">About</a>
                    </nav>

                    <Link href="/signup" className="hidden items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 sm:flex">
                        Get started <ArrowRight size={15} />
                    </Link>

                    <button type="button" aria-label="Open menu" className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden">
                        <Menu size={21} />
                    </button>
                </div>
            </header>

            <section className="overflow-hidden border-b border-slate-100">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-10 lg:py-24">
                    <div className="max-w-xl">
                        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">A simpler way to take notes</p>
                        <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                            Your thoughts,<br /><span className="text-slate-500">organized.</span>
                        </h1>
                        <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                            Memoza helps you capture ideas, keep them organized, and find them easily — so you can focus on what matters.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
                                Get started <ArrowRight size={16} />
                            </Link>
                            <a href="#features" className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50">Learn more</a>
                        </div>
                    </div>

                    <div className="relative lg:pl-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.35)]">
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                <div className="flex h-10 items-center justify-between border-b border-slate-200 px-4">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-900"><FileText size={12} /></span>
                                        <span className="text-xs font-semibold">Memoza</span>
                                    </div>
                                    <div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /></div>
                                </div>

                                <div className="grid min-h-[330px] grid-cols-[130px_1fr]">
                                    <aside className="border-r border-slate-200 bg-slate-50 p-3">
                                        <div className="space-y-1 text-[11px] text-slate-600">
                                            <div className="rounded-lg bg-white px-2.5 py-2 font-medium text-slate-950 shadow-sm">Notes</div>
                                            <div className="px-2.5 py-2">Favorites</div>
                                            <div className="px-2.5 py-2">Archive</div>
                                            <div className="px-2.5 py-2">Trash</div>
                                        </div>
                                        <p className="mb-1 mt-6 px-2.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">Folders</p>
                                        <div className="space-y-1 text-[11px] text-slate-600">
                                            <div className="flex items-center gap-2 px-2.5 py-1.5"><Folder size={12} /> Personal</div>
                                            <div className="flex items-center gap-2 px-2.5 py-1.5"><Folder size={12} /> Work</div>
                                            <div className="flex items-center gap-2 px-2.5 py-1.5"><Folder size={12} /> Learning</div>
                                        </div>
                                    </aside>

                                    <div className="p-5">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold tracking-tight">Notes</h2>
                                            <button className="rounded-lg bg-slate-950 px-3 py-1.5 text-[10px] font-medium text-white">New note</button>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-400"><Search size={13} /> Search notes...</div>
                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            <PreviewNote title="Project ideas" text="Build a habit tracking app and explore new design ideas." pinned />
                                            <PreviewNote title="Books to read" text="The Design of Everyday Things, Clean Code..." />
                                            <PreviewNote title="Meeting notes" text="Discussed the new feature roadmap and next steps." />
                                            <PreviewNote title="Weekend plan" text="Go for a walk, grocery shopping, read a book." pinned />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="border-b border-slate-100">
                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Features</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Everything you need,<br className="hidden sm:block" /> nothing extra.</h2>
                        <p className="mt-4 text-base leading-7 text-slate-600">Essential tools to keep your notes organized and accessible, without adding unnecessary clutter.</p>
                    </div>
                    <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        <Feature icon={<FileText size={20} />} title="Rich notes" text="Write, edit, and format your notes with a clean editor." />
                        <Feature icon={<Folder size={20} />} title="Organize with folders" text="Keep your notes structured and easy to find." />
                        <Feature icon={<Pin size={20} />} title="Pin & favorite" text="Keep important notes close when you need them." />
                        <Feature icon={<Archive size={20} />} title="Archive & trash" text="Keep your workspace clean without losing your notes." />
                    </div>
                </div>
            </section>

            <section id="about" className="bg-slate-50">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-24">
                    <div className="order-2 lg:order-1">
                        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <div className="border-b border-slate-200 px-5 py-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-400"><span>Notes</span><span>/</span><span>Project ideas</span></div>
                                    <h3 className="mt-2 text-xl font-semibold">Project ideas</h3>
                                </div>
                                <div className="border-b border-slate-200 px-5 py-3">
                                    <div className="flex flex-wrap gap-1 text-slate-500">{["B", "I", "U", "H1", "•", "1.", "↗", "☷"].map(item => <button key={item} type="button" className="flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-xs hover:bg-slate-100">{item}</button>)}</div>
                                </div>
                                <div className="min-h-[260px] px-5 py-6 text-sm leading-7 text-slate-700">
                                    <p className="font-medium text-slate-950">Ideas for the next project</p>
                                    <ul className="mt-3 list-disc space-y-1 pl-5"><li>Build a habit tracking app</li><li>Explore new design ideas</li><li>Improve performance</li></ul>
                                    <div className="mt-6 h-24 rounded-xl bg-slate-100" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 max-w-lg lg:order-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">A clean writing experience</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Focus on your ideas, not the tools.</h2>
                        <p className="mt-5 text-base leading-7 text-slate-600">Memoza gives you a distraction-free editor so you can write naturally, format your notes, and keep everything in one place.</p>
                        <div className="mt-7 space-y-3 text-sm text-slate-700">
                            <div className="flex items-center gap-3"><Check size={17} /> Simple and familiar writing experience</div>
                            <div className="flex items-center gap-3"><Check size={17} /> Images and rich text formatting</div>
                            <div className="flex items-center gap-3"><Check size={17} /> Notes stay organized as you grow</div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="border-b border-slate-100">
                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">How it works</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Get started in minutes.</h2>
                    </div>
                    <div className="mt-14 grid gap-10 md:grid-cols-3">
                        <Step number="1" title="Create your account" text="Sign up and get started in seconds." />
                        <Step number="2" title="Start writing" text="Capture your ideas, thoughts, or to-dos." />
                        <Step number="3" title="Stay organized" text="Use folders, pin important notes, and keep everything tidy." />
                    </div>
                </div>
            </section>

            <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
                <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl border border-slate-200 bg-slate-50 px-7 py-10 sm:px-10 lg:flex-row lg:items-center lg:px-12">
                    <div><h2 className="text-3xl font-semibold tracking-[-0.03em]">Ready to organize<br className="hidden sm:block" /> your thoughts?</h2><p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">Join Memoza and take control of your notes today.</p></div>
                    <Link href="/register" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">Get started <ArrowRight size={16} /></Link>
                </div>
            </section>

            <footer className="border-t border-slate-200">
                <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
                    <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <Link href="/" className="flex items-center gap-2.5"><span className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-slate-900"><FileText size={14} /></span><span className="font-semibold">Memoza</span></Link>
                            <p className="mt-2 text-sm text-slate-500">A simple and focused note-taking app.</p>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500"><a href="#features" className="hover:text-slate-950">Features</a><a href="#how-it-works" className="hover:text-slate-950">How it works</a><a href="#about" className="hover:text-slate-950">About</a><a href="/privacy" className="hover:text-slate-950">Privacy</a><a href="/terms" className="hover:text-slate-950">Terms</a></div>
                    </div>
                    <div className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-400">© 2026 Memoza. All rights reserved.</div>
                </div>
            </footer>
        </main>
    );
}

function Feature({ icon, title, text }) {
    return <div className="text-center sm:text-left"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 sm:mx-0">{icon}</div><h3 className="mt-5 text-base font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>;
}

function Step({ number, title, text }) {
    return <div className="relative text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold">{number}</div><h3 className="mt-5 text-base font-semibold">{title}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">{text}</p></div>;
}

function PreviewNote({ title, text, pinned = false }) {
    return <div className="rounded-xl border border-slate-200 p-3"><div className="flex items-center justify-between gap-2"><span className="text-[9px] font-medium text-slate-400">Today</span>{pinned && <Pin size={11} className="text-slate-500" />}</div><h3 className="mt-2 text-xs font-semibold">{title}</h3><p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">{text}</p></div>;
}
