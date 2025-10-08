"use client";

import React, { useState } from "react";
import { Layout, Menu, Input, Badge, Avatar, Space, Typography } from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  SwapOutlined,
  BarChartOutlined,
  BellOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function ToTruongLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      key: "/totruong",
      icon: <HomeOutlined />,
      label: "Quản lý Hộ khẩu",
    },
    {
      key: "/totruong/nhankhau",
      icon: <UserOutlined />,
      label: "Quản lý Nhân khẩu",
    },
    {
      key: "/totruong/tamtru",
      icon: <SwapOutlined />,
      label: "Tạm trú - Tạm vắng",
    },
    {
      key: "/totruong/thongke",
      icon: <BarChartOutlined />,
      label: "Thống kê & Tìm kiếm",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
            fontSize: collapsed ? 18 : 16,
            fontWeight: 600,
            color: "#1890ff",
          }}
        >
          {collapsed ? "QLD" : "Quản lý Dân cư"}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Search bar */}
          <Input
            placeholder="Tìm kiếm theo tên, mã hộ khẩu, CMND..."
            prefix={<SearchOutlined />}
            style={{ width: 400 }}
          />

          {/* Right side */}
          <Space size="large" align="center">
						<Badge count={5}>
							<BellOutlined style={{ fontSize: 20, color: "#595959" }} />
						</Badge>
						
						<Space size="middle" align="center">
							<Avatar size={40} src="https://i.pravatar.cc/40" />
							<div style={{ lineHeight: 1.2 }}>
								<div>
									<Text strong style={{ fontSize: 14 }}>
										Nguyễn Văn A
									</Text>
								</div>
								<div>
									<Text type="secondary" style={{ fontSize: 12 }}>
										Tổ trưởng
									</Text>
								</div>
							</div>
						</Space>
					</Space>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: "#fff",
            borderRadius: 8,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}