import { NextResponse } from "next/server";

export async function POST(req) {
	const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

	if (!req.cookies.get("access_token")) {
		return NextResponse.json({ error: "No access token found" }, { status: 401 });
	}

	const token = req.cookies.get("access_token")?.value || "";

	try {
		const response = await fetch(`${SERVER_URL}/api/auth/logout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			return NextResponse.json({ error: errorData.detail || "Login failed" }, { status: response.status });
		}
	}	catch (error) {
		console.error("Error during fetch:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}

	const res = NextResponse.json({ message: "Logout successful" });
	res.cookies.delete("access_token");
	res.cookies.delete("permissions");

	return res;
}