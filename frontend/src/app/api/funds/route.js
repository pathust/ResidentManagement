import { NextResponse } from "next/server";

export async function GET(req) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

    if (!req.cookies.get("access_token")) {
        return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const token = req.cookies.get("access_token")?.value || "";

    try {
        const response = await fetch(`${SERVER_URL}/api/funds`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to get funds" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

    if (!req.cookies.get("access_token")) {
        return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const token = req.cookies.get("access_token")?.value || "";
    const body = await req.json();

    try {
        const response = await fetch(`${SERVER_URL}/api/funds`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to create fund" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}