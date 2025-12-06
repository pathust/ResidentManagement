// Full Admin Page with mock data, header, logout, tabs, navigation

'use client';

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Typography,
  Space,
  Card,
  Tabs,
  Avatar,
  Badge,
} from "antd";
import {
  CheckOutlined,
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { authAPI } from "@/services/api"

export default function AdminPage() {
  const router = useRouter();

  // ---------------- MOCK DATA ----------------
  const mockRoles = [
    { id: 1, name: "ADMIN" },
    { id: 2, name: "MANAGER" },
    { id: 3, name: "COLLECTOR" },
    { id: 4, name: "RESIDENT" },
  ];

  const mockPerms = [
    { id: 1, name: "VIEW_DASHBOARD" },
    { id: 2, name: "MANAGE_USERS" },
    { id: 3, name: "VIEW_REPORTS" },
    { id: 4, name: "COLLECT_FEES" },
    { id: 5, name: "MANAGE_FUNDS" },
  ];

  const mockRP = [
    { roleId: 1, permId: 1 },
    { roleId: 1, permId: 2 },
    { roleId: 1, permId: 3 },
    { roleId: 1, permId: 4 },
    { roleId: 2, permId: 1 },
    { roleId: 2, permId: 3 },
    { roleId: 3, permId: 1 },
  ];

  // ---------------- STATES ----------------
  const [roleList, setRoleList] = useState([]);
  const [permList, setPermList] = useState([]);
  const [rolePermList, setRolePermList] = useState([]);
  const [safeRPList, setSafeRPList] = useState([]);
  const [changed, setChanged] = useState(false);

  const logout = async () => {
    try {
      await authAPI.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ---------------- LOAD MOCK DATA ----------------
  useEffect(() => {
    setRoleList(mockRoles);
    setPermList(mockPerms);
    setRolePermList(mockRP);
    setSafeRPList(JSON.parse(JSON.stringify(mockRP)));
  }, []);

  // ---------------- CELL TOGGLE ----------------
  const toggleCell = (roleId, permId) => {
    const exists = rolePermList.some(
      (x) => x.roleId === roleId && x.permId === permId
    );

    const updated = exists
      ? rolePermList.filter((x) => !(x.roleId === roleId && x.permId === permId))
      : [...rolePermList, { roleId, permId }];

    setRolePermList(updated);
    setChanged(JSON.stringify(updated) !== JSON.stringify(safeRPList));
  };

  const saveChanges = () => {
    setSafeRPList(JSON.parse(JSON.stringify(rolePermList)));
    setChanged(false);
  };

  // ---------------- TABLE COLUMNS ----------------
  const columns = [
    {
      title: "Role",
      dataIndex: "name",
      fixed: "left",
      width: 180,
      render: (t) => <Typography.Text strong>{t}</Typography.Text>,
    },
    ...permList.map((perm) => ({
      title: perm.name,
      width: 120,
      render: (_, role) => {
        const checked = rolePermList.some(
          (x) => x.roleId === role.id && x.permId === perm.id
        );
        return (
          <div
            onClick={() => toggleCell(role.id, perm.id)}
            style={{
              cursor: "pointer",
              width: "100%",
              textAlign: "center",
              padding: 6,
              borderRadius: 6,
              background: checked ? "#e6f7ff" : "#fafafa",
              border: checked ? "1px solid #1890ff" : "1px solid #d9d9d9",
            }}
          >
            {checked && <CheckOutlined style={{ color: "#1890ff" }} />}
          </div>
        );
      },
    })),
  ];

  // ---------------- ACCOUNT MOCK DATA ----------------
  const mockAccounts = [
    { id: 1, name: "Nguyễn Văn An", username: "an.nguyen", role: "Admin" },
    { id: 2, name: "Trần Thị Bình", username: "binh.tran", role: "Tổ trưởng" },
    { id: 3, name: "Phạm Quốc Cường", username: "cuong.pham", role: "Cộng tác viên" },
  ];

  const [accList, setAccList] = useState([]);

  // Load accounts
  useEffect(() => {
    setAccList(mockAccounts);
  }, []);

  const accountColumns = [
    { title: "Họ tên", dataIndex: "name", key: "name" },
    { title: "Tên đăng nhập", dataIndex: "username", key: "username" },
    { title: "Quyền", dataIndex: "role", key: "role" },
  ];

  // ---------------- MAIN RENDER ----------------
  return (
    <div style={{ padding: 24 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Quản lý Tài khoản & Phân quyền
        </Typography.Title>

        <Space size="large">
          <Badge count={3}>
            <BellOutlined style={{ fontSize: 20 }} />
          </Badge>

          <Space>
            <Avatar icon={<UserOutlined />} />
            <Typography.Text strong>Admin</Typography.Text>
          </Space>

          <Button
            icon={<LogoutOutlined />}
            danger
            type="primary"
            onClick={logout}
          >
            Đăng xuất
          </Button>
        </Space>
      </div>

      {/* TABS */}
      <Tabs
        defaultActiveKey="accounts"
        items={[
          {
            key: "accounts",
            label: "Quản lý tài khoản",
            children: (
              <Card style={{ borderRadius: 8 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Danh sách tài khoản
                  </Typography.Title>

                  <Space>
                    <Button type="primary" icon={"+"} onClick={() => console.log("add")}>
                      Thêm tài khoản
                    </Button>
                  </Space>
                </div>

                <Table
                  rowKey="id"
                  dataSource={accList}
                  columns={[
                    ...accountColumns,
                    {
                      title: "Thao tác",
                      key: "action",
                      width: 120,
                      render: (_, record, index) => (
                        <Space>
                          <Button
                            type="link"
                            size="small"
                            onClick={() => {
                              console.log("View", record);
                            }}
                          >
                            Xem
                          </Button>
                          <Button
                            type="link"
                            danger
                            size="small"
                            onClick={() => console.log("Delete", record)}
                          >
                            Xóa
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: "roles",
            label: "Quản lý quyền hạn",
            children: (
              <Card style={{ borderRadius: 8 }}>
                <Table
                  rowKey="id"
                  dataSource={roleList}
                  columns={columns}
                  pagination={false}
                  scroll={{ x: true }}
                />

                <div style={{ textAlign: "right", marginTop: 20 }}>
                  <Button
                    type={changed ? "primary" : "default"}
                    onClick={saveChanges}
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
