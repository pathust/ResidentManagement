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

    try {
        const params = new URLSearchParams({
            page: pageIndex,
            size: pageSize,
            sort: "expenseDate,desc"
        });

        const response = await fetch(`${SERVER_URL}/api/funds/expenses?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to get expenses" }, { status: response.status });
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
        const response = await fetch(`${SERVER_URL}/api/funds/expenses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to create expense" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}