import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();

        const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        )

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, {
                status: response.status
            })
        }

        const nextResponse = NextResponse.json({
            success: true,
            message: data.message,
            user: data.user
        })

        nextResponse.cookies.set("token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
            path: "/"
        })

        return nextResponse;
    } catch (error) {
        console.error("Login proxy error: ", error);

        return NextResponse.json(
            {
                success: false,
                error: "Login failed"
            },
            {
                status: 500
            }
        )
    }
}