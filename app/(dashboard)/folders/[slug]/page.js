import SingleFolder from "@/components/folders/SingleFolder"
import api from "@/lib/api"
import { cookies } from "next/headers";

async function getFolderById(id, token) {
    try {
        const response = await api.get(`/folders/get-folder-notes?id=${id}`, {
            headers: {
                Cookie: `token=${token}`
            }
        })
        return response.data.folder
    } catch (error) {
        console.error("Failed to get folder notes", error);
        return null;
    }
}

export default async function GetFolderId({ params }) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const folder = await getFolderById(slug, token);
    console.log({folder})

    return <SingleFolder folder={folder} />
}