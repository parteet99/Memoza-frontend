import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const response = await fetch(
            `${process.env.BACKEND_URL}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
                cache: "no-store"
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || data.error || "Login failed"
                },
                {status: response.status}
            )
        }

        if (!data.token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication token was not returned",
                },
                { status: 500 }
            );
        }

        // keep jwt in http only cookie
        const nextResponse = NextResponse.json({
            success: true,
            message: data.message || "Login successful",
            user: data.user
        });

        nextResponse.cookies.set({
            name: "token",
            value: data.token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        return nextResponse;
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: "Unable to connect to authentication server"
            }, {
                status: 500
            }
        )
    }
}