import UserProfile from "@/components/profile/UserProfile"
import api from "@/lib/api"
import { cookies } from "next/headers";

async function getUser(id, token) {
    try {
        const response = await api.get(`/users/${id}`, {
            headers: {
                Cookie: `token=${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Failed to fetch user:", error);

        return null;
    }
}

export default async function Profile() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value
    const userId = cookieStore.get("userId")?.value;
    const user = await getUser(userId, token);

    return (
        <UserProfile user={user} />
    )
}