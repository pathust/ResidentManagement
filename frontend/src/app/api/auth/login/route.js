import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, password } = await req.json();

	const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

	try {
		const response = await fetch(`${SERVER_URL}/api/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			return NextResponse.json({ error: errorData.detail || "Login failed" }, { status: response.status });
		}

		const data = await response.json();

		if (!data.token || !data.permissions || !data.role)
			throw new Error("Missing information in response");

		const res = NextResponse.json({ message: "Login successful", data: { role: data.role } });
		res.cookies.set("access_token", data.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});

		res.cookies.set("permissions", data.permissions.join(","), {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});

		return res;
	}	catch (error) {
		console.error("Error during fetch:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}