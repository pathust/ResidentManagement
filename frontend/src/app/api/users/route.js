import { NextResponse } from "next/server";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

const USER_API_URL = `${SERVER_URL}/api/users`;

export async function GET(req) {
  // 1. Lấy tất cả query params từ request của Client gửi lên
  const searchParams = req.nextUrl.searchParams;
  const queryString = searchParams.toString();

  if (!req.cookies.get("access_token")) {
    return NextResponse.json(
      { error: "No access token found" },
      { status: 401 }
    );
  }

  const token = req.cookies.get("access_token")?.value || "";

  try {
    // 2. Nối chuỗi query string vào URL của Backend
    // Lưu ý: Mình đang để endpoint là /api/users cho khớp với logic 'getUsers'.
    // Nếu backend của bạn là /api/funds thì sửa lại nhé.
    const response = await fetch(`${USER_API_URL}?${queryString}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Phòng trường hợp body rỗng
      return NextResponse.json(
        { error: errorData.detail || "Failed to get data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error during fetch:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  if (!req.cookies.get("access_token")) {
    return NextResponse.json(
      { error: "No access token found" },
      { status: 401 }
    );
  }

  const token = req.cookies.get("access_token")?.value || "";
  const body = await req.json();

  try {
    const response = await fetch(USER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "Failed to create fund" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error during fetch:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
