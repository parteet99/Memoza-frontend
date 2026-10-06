import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    if (pathname === "/") {
        if (token) {
            return NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/",
        "/profile",
        "/notes",
        "/folders",
        "/folders/:id",
        "/trash",
        "/change-password",
        "/favorites",
        "/archive"
    ]
}