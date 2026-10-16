import { NextResponse } from "next/server";

export function proxy(request) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

     console.log("Proxy path:", pathname);
    console.log("Token exists:", !!token);

    //allow login and signup without a token
    if (pathname === "/login" || pathname === "/signup") {
        if (token) {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
        return NextResponse.next();
    }

    if (pathname === "/") {
        if (token) {
            return NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
        }
        return NextResponse.next();
    }

    //protect private routes
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/signup",
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