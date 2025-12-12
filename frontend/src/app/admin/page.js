"use client";

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
  Tag,
  Layout,
  Row,
  Col,
  Statistic,
  Tooltip,
  message,
} from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
  SaveOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { authAPI } from "@/services/api";
import Link from "next/link";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function AdminPage() {
  const router = useRouter();

  // ---------------- MOCK DATA ----------------
  const mockRoles = [
    { id: 1, name: "ADMIN", color: "geekblue" },
    { id: 2, name: "MANAGER", color: "purple" },
    { id: 3, name: "COLLECTOR", color: "green" },
    { id: 4, name: "RESIDENT", color: "default" },
  ];

  const mockPerms = [
    { id: 1, name: "VIEW_DASHBOARD", desc: "Xem thống kê chung" },
    { id: 2, name: "MANAGE_USERS", desc: "Thêm/Sửa/Xóa user" },
    { id: 3, name: "VIEW_REPORTS", desc: "Xem báo cáo tài chính" },
    { id: 4, name: "COLLECT_FEES", desc: "Thu phí cư dân" },
    { id: 5, name: "MANAGE_FUNDS", desc: "Quản lý quỹ" },
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

  const mockAccounts = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      username: "an.nguyen",
      role: "Admin",
      status: "active",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      username: "binh.tran",
      role: "Tổ trưởng",
      status: "active",
    },
    {
      id: 3,
      name: "Phạm Quốc Cường",
      username: "cuong.pham",
      role: "Cộng tác viên",
      status: "inactive",
    },
    {
      id: 4,
      name: "Lê Thị Dung",
      username: "dung.le",
      role: "Cư dân",
      status: "active",
    },
  ];

  // ---------------- STATES ----------------
  const [roleList, setRoleList] = useState([]);
  const [permList, setPermList] = useState([]);
  const [rolePermList, setRolePermList] = useState([]);
  const [safeRPList, setSafeRPList] = useState([]);
  const [changed, setChanged] = useState(false);
  const [accList, setAccList] = useState([]);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    setRoleList(mockRoles);
    setPermList(mockPerms);
    setRolePermList(mockRP);
    setSafeRPList(JSON.parse(JSON.stringify(mockRP)));
    setAccList(mockAccounts);
  }, []);

  const logout = async () => {
    try {
      await authAPI.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      message.error("Đăng xuất thất bại");
    }
  };

  // ---------------- HANDLERS ----------------
  const toggleCell = (roleId, permId) => {
    const exists = rolePermList.some(
      (x) => x.roleId === roleId && x.permId === permId
    );

    const updated = exists
      ? rolePermList.filter(
          (x) => !(x.roleId === roleId && x.permId === permId)
        )
      : [...rolePermList, { roleId, permId }];

    setRolePermList(updated);
    setChanged(JSON.stringify(updated) !== JSON.stringify(safeRPList));
  };

  const saveChanges = () => {
    setSafeRPList(JSON.parse(JSON.stringify(rolePermList)));
    setChanged(false);
    message.success("Cập nhật quyền thành công!");
  };

  const revertChanges = () => {
    setRolePermList(JSON.parse(JSON.stringify(safeRPList)));
    setChanged(false);
  };

  // ---------------- RENDER HELPERS ----------------
  // Matrix Columns
  const columns = [
    {
      title: "Vai trò / Quyền hạn",
      dataIndex: "name",
      fixed: "left",
      width: 180,
      render: (t, r) => (
        <Tag color={r.color} style={{ fontSize: 14, padding: "4px 10px" }}>
          {t}
        </Tag>
      ),
    },
    ...permList.map((perm) => ({
      title: (
        <Tooltip title={perm.desc}>
          <span style={{ cursor: "help" }}>{perm.name}</span>
        </Tooltip>
      ),
      width: 140,
      align: "center",
      render: (_, role) => {
        const checked = rolePermList.some(
          (x) => x.roleId === role.id && x.permId === perm.id
        );
        return (
          <div
            onClick={() => toggleCell(role.id, perm.id)}
            className={`cursor-pointer transition-all duration-200 flex justify-center items-center h-10 rounded-md ${
              checked
                ? "bg-green-50 hover:bg-green-100"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
            style={{
              // Inline styles for non-Tailwind environments
              background: checked ? "#f6ffed" : "#fff1f0",
              cursor: "pointer",
              borderRadius: 6,
              padding: 8,
              transition: "all 0.3s",
            }}
          >
            {checked ? (
              <CheckCircleFilled style={{ color: "#52c41a", fontSize: 20 }} />
            ) : (
              <CloseCircleFilled style={{ color: "#ffccc7", fontSize: 20 }} />
            )}
          </div>
        );
      },
    })),
  ];

  // Account Columns
  const accountColumns = [
    {
      title: "Người dùng",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <Avatar style={{ backgroundColor: "#1890ff" }}>{text[0]}</Avatar>
          <div>
            <Text strong>{text}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      render: (t) => <Text type="secondary">{t}</Text>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        let color = "blue";
        if (role === "Admin") color = "geekblue";
        if (role === "Cộng tác viên") color = "green";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status === "active" ? "success" : "error"}
          text={status === "active" ? "Đang hoạt động" : "Đã khóa"}
        />
      ),
    },
  ];

  // ---------------- MAIN UI ----------------
  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* HEADER */}
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <SafetyCertificateOutlined
            style={{ fontSize: 24, color: "#1890ff", marginRight: 10 }}
          />
          <Title level={4} style={{ margin: 0, color: "#001529" }}>
            Hệ thống Quản trị
          </Title>
        </div>

        <Space size="large">
          <Link href="/dashboard">
            <Button type="text" icon={<DashboardOutlined />}>
              Trang chủ
            </Button>
          </Link>

          <Space style={{ borderLeft: "1px solid #f0f0f0", paddingLeft: 16 }}>
            <Avatar
              style={{ backgroundColor: "#87d068" }}
              icon={<UserOutlined />}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: "1.2",
              }}
            >
              <Text strong style={{ fontSize: 13 }}>
                Admin User
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                Super Admin
              </Text>
            </div>
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={logout}
            />
          </Space>
        </Space>
      </Header>

      <Content
        style={{
          padding: "24px",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* STATISTICS CARDS */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card bordered={false} hoverable>
              <Statistic
                title="Tổng tài khoản"
                value={accList.length}
                prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} hoverable>
              <Statistic
                title="Vai trò hệ thống"
                value={roleList.length}
                prefix={
                  <SafetyCertificateOutlined style={{ color: "#722ed1" }} />
                }
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} hoverable>
              <Statistic
                title="Quyền hạn định nghĩa"
                value={permList.length}
                prefix={<CheckCircleFilled style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
        </Row>

        {/* MAIN TABS AREA */}
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <Tabs
            defaultActiveKey="accounts"
            type="card"
            size="large"
            items={[
              {
                key: "accounts",
                label: (
                  <span>
                    <TeamOutlined /> Quản lý tài khoản
                  </span>
                ),
                children: (
                  <div style={{ marginTop: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                      }}
                    >
                      <Title level={5} style={{ margin: 0 }}>
                        Danh sách người dùng
                      </Title>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => console.log("add")}
                      >
                        Thêm mới
                      </Button>
                    </div>

                    <Table
                      rowKey="id"
                      dataSource={accList}
                      columns={[
                        ...accountColumns,
                        {
                          title: "Thao tác",
                          key: "action",
                          width: 150,
                          render: (_, record) => (
                            <Space>
                              <Tooltip title="Chỉnh sửa">
                                <Button
                                  type="default"
                                  size="small"
                                  icon={<EditOutlined />}
                                />
                              </Tooltip>
                              <Tooltip title="Xóa">
                                <Button
                                  type="primary"
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                />
                              </Tooltip>
                            </Space>
                          ),
                        },
                      ]}
                      pagination={{ pageSize: 5 }}
                    />
                  </div>
                ),
              },
              {
                key: "roles",
                label: (
                  <span>
                    <SafetyCertificateOutlined /> Phân quyền
                  </span>
                ),
                children: (
                  <div style={{ marginTop: 16 }}>
                    <div
                      style={{
                        marginBottom: 16,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Title level={5} style={{ margin: 0 }}>
                        Phân quyền
                      </Title>
                    </div>

                    <Table
                      rowKey="id"
                      dataSource={roleList}
                      columns={columns}
                      pagination={false}
                      scroll={{ x: "max-content" }}
                      bordered
                      size="middle"
                    />

                    <div
                      style={{
                        marginTop: 16,
                        background: "#fafafa",
                        padding: 12,
                        borderRadius: 6,
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        * Nhấp vào ô để cấp (màu xanh) hoặc thu hồi (màu đỏ)
                        quyền hạn tương ứng cho từng vai trò.
                      </Text>
                    </div>

                    {changed && (
                      <div className="flex justify-end items-center mt-4">
                        <Space>
                          <Text type="warning">Bạn có thay đổi chưa lưu!</Text>
                          <Button
                            icon={<UndoOutlined />}
                            onClick={revertChanges}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={saveChanges}
                          >
                            Lưu lại
                          </Button>
                        </Space>
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Content>
    </Layout>
  );
}
