import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();

        const response = await fetch(
            `${process.env.BACKEND_URL}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || data.error || "Login failed",
                },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: data.message || "Login successful",
            user: data.user,
        });
    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Unable to connect to authentication server",
            },
            { status: 500 }
        );
    }
}