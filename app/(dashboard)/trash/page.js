import TrashFile from "@/components/Trash"
import api from "@/lib/api"
import { cookies } from "next/headers"

async function getTrash(token) {
    try {
        const res = await api.get("/notes/trash-notes", {
            headers: {
                Cookie: `token=${token}`
            }
        })

        return res.data;
    } catch (error) {
        console.error("Error fetching trash notes", error);
        return null;
    }
}

export default async function Trash() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value
    const trashNotes = await getTrash(token);
    return (
        <TrashFile notes={trashNotes} />
    )
}