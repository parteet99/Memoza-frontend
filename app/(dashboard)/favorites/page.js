import FavoriteList from "@/components/favorites/FavoriteList"
import api from "@/lib/api"
import { cookies } from "next/headers"

async function getFavorites(token) {
    try {
        const res = await api.get("/favorite/starred-note", {
            headers: {
                Cookie: `token=${token}`
            }
        })
        return res.data;
    } catch (error) {
        console.error("Error fetching favorites", error);
        return null
    }
}

export default async function Favorite() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const notes = await getFavorites(token);
    return (
        <FavoriteList notes={notes} />
    )
}