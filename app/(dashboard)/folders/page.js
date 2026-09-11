import AllFolders from "@/components/folders/AllFolders"
import api from "@/lib/api"
import { cookies } from "next/headers";

async function getFolders(token) {
    try {
        const response = await api.get("/folders/get-folders", {
            headers: {
                Cookie: `token=${token}`
            }
        })

        return response.data;
    } catch (error) {
        console.error("Failed to fetch folders", error);
        return null;
    }
    
}

export default async function Folders() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const folders = await getFolders(token);
    return (
        <AllFolders folder={folders} />
    )
}