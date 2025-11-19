import { NextResponse } from "next/server";

// Handle GET requests to fetch persons data
export async function GET(req) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

    if (!req.cookies.get("access_token")) {
        return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const token = req.cookies.get("access_token")?.value || "";

    if (!req.cookies.get("permissions")) {
        return NextResponse.json({ error: "No permissions found" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    
    const pageSize = Number(searchParams.get("pageSize") ?? 10);
    const pageIndex = Number(searchParams.get("pageIndex") ?? 0);
    console.log("Page Index:", pageIndex);
    console.log("Page Size:", pageSize);

    if (pageIndex === null || pageIndex === undefined){
        return NextResponse.json({ error: "Invalid request: Missing paging index" }, { status: 400 });
    }

    try {
        const params = new URLSearchParams({
            page: pageIndex,
            size: pageSize,
            sort: "id"
        });
kksdafjlk
        const response = await fetch(`${SERVER_URL}/api/households?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to get household data" }, { status: response.status });
        }

        const data = await response.json();
        
        return NextResponse.json(data);
    }	catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}