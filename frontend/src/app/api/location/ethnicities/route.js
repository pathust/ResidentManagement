import { NextResponse } from "next/server";

export async function GET(req) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const response = await fetch(`${SERVER_URL}/api/location/ethnicities`, {
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json({ error: error.message }, { status: response.status });
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}