import AllNotes from "@/components/notes/AllNotes"
import api from "@/lib/api"
import { cookies } from "next/headers";

async function getNotes(token) {
    try {
        const response = await api.get(`/notes/get-notes`, {
            headers: {
                Cookie: `token=${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Failed to fetch user notes:", error);

        return null;
    }
}

export default async function Notes() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value
    const notes = await getNotes(token);
    return (
        <AllNotes notes={notes} />
    )
}