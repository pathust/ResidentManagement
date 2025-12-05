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

    const permissions = req.cookies.get("permissions")?.value || "";
    //paging
    if (req.body?.pageSize){
        const pageSize = req.body.pageSize;
        const pageIndex = req.body?.pageIndex;

        if (pageIndex === null || pageIndex === undefined){
            return NextResponse.json({ error: "Invalid request: Missing paging index" }, { status: 400 });
        }

        try {
            const response = await fetch(`${SERVER_URL}/api/persons/page`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    page: pageIndex,
                    size: pageSize,
                    sort:"id"
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return NextResponse.json({ error: errorData.detail || "Failed to get persons data" }, { status: response.status });
            }

            const data = await response.json();
            console.log("Fetched persons data:", data);
            return NextResponse.json(data);
        }	catch (error) {
            console.error("Error during fetch:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }

    //non-paging
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
        
        return NextResponse.json(data);
    }	catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle POST requests creating a new person
export async function POST(req) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

    if (!req.cookies.get("access_token")) {
        return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const token = req.cookies.get("access_token")?.value || "";

    if (!req.cookies.get("permissions")) {
        return NextResponse.json({ error: "No permissions found" }, { status: 401 });
    }

    const permissions = req.cookies.get("permissions")?.value || "";

    // temporarily disable permission check
    // if (!permissions.includes("PERSON_MANAGE")) {
    //     return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    // }

    const data = await req.json();

    try {
        const response = await fetch(`${SERVER_URL}/api/persons`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to add new person" }, { status: response.status });
        }

        return NextResponse.json({ message: "Created" }, { status: 201 });
    }	catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}