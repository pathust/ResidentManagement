import { NextResponse } from "next/server";

export async function GET(req) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

    if (!req.cookies.get("access_token")) {
        return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const token = req.cookies.get("access_token")?.value || "";
    const { searchParams } = new URL(req.url);

    const pageSize = Number(searchParams.get("pageSize") ?? 10);
    const pageIndex = Number(searchParams.get("pageIndex") ?? 0);
    const name = searchParams.get("name");
    const idNumber = searchParams.get("idNumber");
    const householdNumber = searchParams.get("householdNumber");
    const wardId = searchParams.get("wardId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    try {
        const params = new URLSearchParams({
            page: pageIndex,
            size: pageSize,
            sort: "startDate,desc"
        });

        if (name) params.append("name", name);
        if (idNumber) params.append("idNumber", idNumber);
        if (householdNumber) params.append("householdNumber", householdNumber);
        if (wardId) params.append("wardId", wardId);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const response = await fetch(`${SERVER_URL}/api/persons/temporary-residences/page?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to get temporary residences" }, { status: response.status });
        }

        const data = await response.json();

        if (!data.content) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 500 });
        }

        return NextResponse.json(data.content);
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
        const response = await fetch(`${SERVER_URL}/api/persons/temporary-residences`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to create temporary residence" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}