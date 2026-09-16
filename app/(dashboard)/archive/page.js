import ArchiveList from "@/components/archives/ArchiveList"
import api from "@/lib/api"
import { cookies } from "next/headers"

async function getArchiveNotes(token) {
    try {
        const res = await api.get("/notes/get-archive-note", {
            headers: {
                Cookie: `token=${token}`
            }
        })
        return res.data;
    } catch (error) {
        console.error("Failed to fetch archive notes", error);
        return null;
    }
}

export default async function Archive() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const notes = await getArchiveNotes(token);
    return <ArchiveList notes={notes} />
}