import AllNotes from "@/components/notes/AllNotes"
import api from "@/lib/api"
import { cookies } from "next/headers";

async function getNotes(token, page = 1) {
    if (!token) {
        console.error("SSR: Token cookie is missing");
        return null;
    }
    try {
        const response = await api.get(`/notes/get-notes`, {
            params: {
                page,
                limit: 10
            },
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

export default async function Notes({searchParams}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value

    const params = await searchParams;
    const page = Number(params?.page) || 1;
    const notes = await getNotes(token, page);
    return (
        <AllNotes notes={notes} />
    )
}