import React from "react";
import { Space, Typography, Avatar, Button } from "antd";
import { BellOutlined, HomeOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function AppHeader() {
  return (
    <div
      style={{
        height: 60,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <Space
          style={{ display: "flex", justifyContent: "space-between", width: "100%" }}
          align="center"
        >
          {/* Logo + Title */}
          <Space>
            <HomeOutlined style={{ fontSize: 28, color: "#3b82f6" }} />
            <Text strong>Quản lý Khu dân cư</Text>
          </Space>

          {/* Menu */}
          <Space size="large">
            <Button type="text">Trang chủ</Button>
            <Button type="text">Báo cáo</Button>
            <Button type="text">Thông báo</Button>
            <Button type="text">Cài đặt</Button>
          </Space>

          {/* Notification + User */}
          <Space size="middle">
            <BellOutlined style={{ fontSize: 20 }} />
            <Space size="small" align="center">
              <Avatar src="https://i.pravatar.cc/40" />
              <Text>Nguyễn Văn A</Text>
            </Space>
          </Space>
        </Space>
      </div>
    </div>
  );
}
