import { NextResponse } from "next/server";

export function proxy(request) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    if (pathname === "/" || pathname === "/login") {
        if (token) {
            return NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/profile",
        "/notes",
        "/folders",
        "/folders/:id",
        "/trash",
        "/change-password",
        "/favorites",
        "/archive",
        "/dashboard"
    ]
}