import { NextResponse } from "next/server";

// Handle GET requests to get specific household membership data by ID
export async function GET(req, { params }) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

    if (!req.cookies.get("access_token")) {
        return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const token = req.cookies.get("access_token")?.value || "";

    if (!req.cookies.get("permissions")) {
        return NextResponse.json({ error: "No permissions found" }, { status: 401 });
    }

    const {id} = params;

    const { searchParams } = new URL(req.url);

    const pageSize = Number(searchParams.get("pageSize") ?? 10);
    const pageIndex = Number(searchParams.get("pageIndex") ?? 0);

    if (pageIndex === null || pageIndex === undefined){
        return NextResponse.json({ error: "Invalid request: Missing paging index" }, { status: 400 });
    }

    try {
        const params = new URLSearchParams({
            page: pageIndex,
            size: pageSize,
            sort: "id"
        });

        const response = await fetch(`${SERVER_URL}/api/households/${id}/memberships/page?${params.toString()}`, {
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