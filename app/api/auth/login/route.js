import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();

        const response = await fetch(
            `${process.env.BACKEND_URL}/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                cache: "no-store",
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            return NextResponse.json(data, {
                status: response.status,
            });
        }

        const setCookie = response.headers.get("set-cookie");
        const token = setCookie?.match(/(?:^|,\s*)token=([^;]*)/)?.[1];

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Token cookie missing from backend response" },
                { status: 502 }
            );
        }

        const result = NextResponse.json(data);

        result.cookies.set("token", decodeURIComponent(token), {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return result;
    } catch (error) {
        console.error("Login route error:", error);

        return NextResponse.json(
            { success: false, message: "Login failed" },
            { status: 500 }
        );
    }
}