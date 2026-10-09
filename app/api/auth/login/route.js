import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = request.json();
        const response = await fetch(
            `${process.env.BACKEND_URL}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        );

        const data = response.json();

        if (!response.ok) {
            return NextResponse.json(
                data,
                {
                    status: response.status
                }
            )
        }

        const nextResponse = NextResponse.json(data);

        const setCookie = response.headers.get("set-cookie");

        if (setCookie) {
            const tokenMatch = setCookie.match(/token=([^;]+)/)
            if (tokenMatch) {
                nextResponse.cookies.set({
                    name: "token",
                    value: tokenMatch[1],
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60,
                    path: "/"
                })
            }
        }

        return nextResponse;
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: "Login failed"
            }, {
                status: 500
            }
        )
    }
}