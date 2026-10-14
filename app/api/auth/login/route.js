import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
    try {
        const body = await request.json();

        const response = await axios.post(
            `${process.env.BACKEND_URL}/api/auth/login`,
            body
        );

        const data = response.data;
        const backendCookie = response.headers["set-cookie"];

        if (!data.success || !data.token) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || "Login failed",
                },
                { status: 401 }
            );
        }

        const nextResponse = NextResponse.json({
            success: true,
            message: data.message || "Login successful",
            user: data.user,
        });

        nextResponse.cookies.set("token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        if (backendCookie) {
            for (const cookie of backendCookie) {
                nextResponse.headers.append("Set-Cookie", cookie)
            }
        }

        return nextResponse;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);

        return NextResponse.json(
            {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Login failed",
            },
            {
                status: error.response?.status || 500,
            }
        );
    }
}