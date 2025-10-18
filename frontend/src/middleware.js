import { NextResponse } from "next/server";

export function middleware(request) {
  const accessToken = request.cookies.get("access_token");
	const permissions = request.cookies.get("permissions")?.value;
	const { pathname } = request.nextUrl;
	if (!accessToken || !permissions){
		request.cookies.delete("access_token");
		request.cookies.delete("permissions");
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (pathname.startsWith("/dashboard/nhankhau") && !permissions.includes("PERSON_MANAGE")) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	if (pathname.startsWith("/dashboard/hokhau") && !permissions.includes("HOUSEHOLD_MANAGE")) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	if (pathname.startsWith("/dashboard/tamtru") && !permissions.includes("TEMPORARY_RESIDENCE_MANAGE")) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	if (pathname.startsWith("/dashboard/thongke") && !permissions.includes("STATISTICS_VIEW")) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*"],
}