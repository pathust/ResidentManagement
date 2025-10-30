import { NextResponse } from "next/server";

export function middleware(request) {
  	const accessToken = request.cookies.get("access_token");
	const permissions = request.cookies.get("permissions")?.value;
	const { pathname } = request.nextUrl;
	console.log(accessToken, permissions, pathname);
	if (!accessToken || !permissions){
		const response = NextResponse.redirect(new URL("/login", request.url))
		response.cookies.delete("access_token");
		response.cookies.delete("permissions");
		return response;
	}

	return NextResponse.next(); // Tạm thời cứ đăng nhập là vào được hết

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