import { NextResponse } from "next/server";

// Handle GET requests to fetch overview of households stats data
export async function GET(req) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

    if (!req.cookies.get("access_token")) {
        return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const token = req.cookies.get("access_token")?.value || "";

    if (!req.cookies.get("permissions")) {
        return NextResponse.json({ error: "No permissions found" }, { status: 401 });
    }

    try {
        const response = await fetch(`${SERVER_URL}/api/stats/overview/households`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
                console.log("Fetching overview households data");

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to get household data" }, { status: response.status });
        }
        console.log("Fetching overview households data");

        const data = await response.json();
        
        return NextResponse.json(data);
    }	catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}