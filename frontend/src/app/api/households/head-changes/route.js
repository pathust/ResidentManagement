import { NextResponse } from "next/server";

// Handle POST requests to add new households data
export async function POST(req) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

    if (!req.cookies.get("access_token")) {
        return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const token = req.cookies.get("access_token")?.value || "";

    if (!req.cookies.get("permissions")) {
        return NextResponse.json({ error: "No permissions found" }, { status: 401 });
    }

    const data = await req.json();

    try {
        const response = await fetch(`${SERVER_URL}/api/households/head-changes`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Error data:", errorData);
            return NextResponse.json({ error: errorData.detail || "Failed to get household data" }, { status: response.status });
        }

        return NextResponse.json({ message: "Added" }, { status: 201 });
    }	catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}