import { NextResponse } from "next/server";

// Handle DELETE requests to remove member from household
export async function DELETE(req, { params }) {
    const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

    if (!req.cookies.get("access_token")) {
        return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const token = req.cookies.get("access_token")?.value || "";

    const { id, membershipId } = params;

    try {
        const response = await fetch(`${SERVER_URL}/api/households/${id}/members/${membershipId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || "Failed to remove member" }, { status: response.status });
        }

        return NextResponse.json({ message: "Member removed successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}