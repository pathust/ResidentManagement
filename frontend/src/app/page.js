"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Space, Typography, Card } from "antd";

const { Title } = Typography;

export default function HomePage() {
  const router = useRouter();

  // Các role mock
  const roles = [
    { label: "Admin", path: "/admin" },
    { label: "Tổ trưởng", path: "/totruong" },
    // { label: "User", path: "/user" },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
        padding: 20,
      }}
    >
      <Card style={{ padding: 40, textAlign: "center", width: 300 }}>
        <Title level={3}>Chọn vai trò để vào hệ thống</Title>
        <Space direction="vertical" size="large" style={{ marginTop: 20, width: "100%" }}>
          {roles.map((role) => (
            <Button
              key={role.label}
              type="primary"
              size="large"
              block
              onClick={() => router.push(role.path)}
            >
              {role.label}
            </Button>
          ))}
        </Space>
      </Card>
    </div>
  );
}
