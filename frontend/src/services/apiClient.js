// src/services/apiClient.js

async function apiClient(
  endpoint,
  {
    method = "GET",
    headers = {},
    body,
    ...customConfig
  } = {}
) {

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...customConfig,
  };

  const response = await fetch(endpoint, config);

  // 🔴 Xử lý 401 (giống interceptor response)
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  // ❌ lỗi HTTP khác
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: errorData.message || "Request failed",
      data: errorData,
    };
  }

  // ✅ parse JSON
  const result = await response.json();
  return result;
}

export default apiClient;