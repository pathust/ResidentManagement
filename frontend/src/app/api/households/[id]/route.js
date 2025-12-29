import { NextResponse } from "next/server";

// Handle PUT requests to update household data
export async function PUT(req, { params }) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

    if (!req.cookies.get("access_token")) {
        return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const token = req.cookies.get("access_token")?.value || "";

    if (!req.cookies.get("permissions")) {
        return NextResponse.json({ error: "No permissions found" }, { status: 401 });
    }

    const { id } = params;
    const data = await req.json();

    try {
        const response = await fetch(`${SERVER_URL}/api/households/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to update household's infor data" }, { status: response.status });
        }
        
        const result = await response.json();
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle GET requests to get household data by ID
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
        const response = await fetch(`${SERVER_URL}/api/households/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to update household's infor data" }, { status: response.status });
        }
        
        const result = await response.json();
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}