import Resetpass from "@/components/auth/Resetpassword"

export default async function ResetPassword({ params }) {
    const { token } = await params;
    return <Resetpass token={token} />
}