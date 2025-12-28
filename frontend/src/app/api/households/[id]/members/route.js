import { NextResponse } from "next/server";

// Handle GET requests to fetch household's member data
export async function GET(req, { params }) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

    if (!req.cookies.get("access_token")) {
        return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const token = req.cookies.get("access_token")?.value || "";

    if (!req.cookies.get("permissions")) {
        return NextResponse.json({ error: "No permissions found" }, { status: 401 });
    }

    const { id } = params;

    try {
        const response = await fetch(`${SERVER_URL}/api/households/${id}/members`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to get household's member data" }, { status: response.status });
        }

        const data = await response.json();
        
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle POST requests to add member to household
export async function POST(req, { params }) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

    if (!req.cookies.get("access_token")) {
        return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const token = req.cookies.get("access_token")?.value || "";

    const { id } = params;
    const data = await req.json();

    try {
        const response = await fetch(`${SERVER_URL}/api/households/${id}/members`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to add member" }, { status: response.status });
        }

        const result = await response.json();
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}