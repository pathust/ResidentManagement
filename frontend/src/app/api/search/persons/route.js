import { NextResponse } from "next/server";

//person search API
export async function GET(req) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

    if (!req.cookies.get("access_token")) {
        return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const token = req.cookies.get("access_token")?.value || "";

    if (!req.cookies.get("permissions")) {
        return NextResponse.json({ error: "No permissions found" }, { status: 401 });
    }

    const permissions = req.cookies.get("permissions")?.value || "";

    try {
        const response = await fetch(`${SERVER_URL}/api/persons`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to get persons data" }, { status: response.status });
        }

        const data = await response.json();

        const query = decodeURIComponent(req.nextUrl.searchParams.get("q") || "");
        if (query) {
            const lowerQuery = query.toLowerCase();
            const filtered = data.filter(
                (p) => p.fullName.toLowerCase().startsWith((lowerQuery)) || p.idNumber.startsWith(query)
            );
            return NextResponse.json(filtered);
        }
        
        return NextResponse.json(data);
    }	catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}