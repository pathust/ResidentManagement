"use client";

import React from "react";
import { Button, Table, Space, Typography, Tag, Tabs, Card, Statistic, message } from "antd";
import {
  PlusOutlined,
  DollarOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { feeAPI } from "@/services/api";

const { Title } = Typography;

export default function ThuPhiDongGopPage() {
  const [feeData, setFeeData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await feeAPI.getAll();
      setFeeData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu thu phí");
    } finally {
      setLoading(false);
    }
  };

  // Columns cho bảng Đợt thu
  const collectionsColumns = [
    {
      title: "Mã đợt thu",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Tên đợt thu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại phí",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type) => {
        const colors = {
          "Phí quản lý": "blue",
          "Phí vệ sinh": "green",
          "Đóng góp": "orange",
        };
        return <Tag color={colors[type] || "default"}>{type}</Tag>;
      },
    },
    {
      title: "Số tiền (VNĐ)",
      dataIndex: "amount",
      key: "amount",
      width: 130,
      render: (amount) => amount?.toLocaleString("vi-VN"),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const statusConfig = {
          "Đang thu": { color: "processing", icon: <ClockCircleOutlined /> },
          "Đã kết thúc": { color: "success", icon: <CheckCircleOutlined /> },
        };
        const config = statusConfig[status] || { color: "default" };
        return (
          <Tag icon={config.icon} color={config.color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small">
            Xem chi tiết
          </Button>
          <Button type="link" size="small">
            Ghi nhận
          </Button>
        </Space>
      ),
    },
  ];

  // Columns cho bảng Ghi nhận thu tiền
  const paymentsColumns = [
    {
      title: "Mã hộ khẩu",
      dataIndex: "householdCode",
      key: "householdCode",
      width: 120,
    },
    {
      title: "Chủ hộ",
      dataIndex: "householdHead",
      key: "householdHead",
    },
    {
      title: "Đợt thu",
      dataIndex: "collectionName",
      key: "collectionName",
    },
    {
      title: "Số tiền (VNĐ)",
      dataIndex: "amount",
      key: "amount",
      width: 130,
      render: (amount) => amount?.toLocaleString("vi-VN"),
    },
    {
      title: "Ngày nộp",
      dataIndex: "paymentDate",
      key: "paymentDate",
      width: 120,
    },
    {
      title: "Người thu",
      dataIndex: "collector",
      key: "collector",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const color = status === "Đã nộp" ? "success" : "warning";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: () => (
        <Space>
          <Button type="link" size="small">
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  // Mock data statistics (sẽ được tính từ API thực tế)
  const stats = {
    totalCollections: feeData.length || 0,
    activeCollections: feeData.filter(f => f.status === "Đang thu").length || 0,
    totalAmount: feeData.reduce((sum, f) => sum + (f.amount || 0), 0),
    collectedAmount: 0, // Sẽ tính từ payments data
  };

  const tabItems = [
    {
      key: "collections",
      label: "Đợt thu",
      children: (
        <div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <Statistic
                title="Tổng số đợt"
                value={stats.totalCollections}
                prefix={<DollarOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Đang thu"
                value={stats.activeCollections}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
            <Card>
              <Statistic
                title="Tổng dự kiến (VNĐ)"
                value={stats.totalAmount}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
            <Card>
              <Statistic
                title="Đã thu (VNĐ)"
                value={stats.collectedAmount}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Button icon={<PlusOutlined />} type="primary">
              Tạo đợt thu mới
            </Button>
          </div>

          <Table
            columns={collectionsColumns}
            dataSource={feeData}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} đợt thu`,
            }}
          />
        </div>
      ),
    },
    {
      key: "payments",
      label: "Ghi nhận thu tiền",
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button icon={<DollarOutlined />} type="primary">
                Ghi nhận thu tiền
              </Button>
              <Button icon={<FileSearchOutlined />}>
                Tra cứu
              </Button>
            </Space>
          </div>

          <Table
            columns={paymentsColumns}
            dataSource={[]} // Sẽ load từ API
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} giao dịch`,
            }}
          />
        </div>
      ),
    },
    {
      key: "statistics",
      label: "Thống kê",
      children: (
        <div>
          <Card title="Thống kê chi tiết" style={{ marginBottom: 16 }}>
            <div className="grid grid-cols-3 gap-4">
              <Statistic
                title="Số hộ đã nộp"
                value={0}
                suffix="/ 0"
              />
              <Statistic
                title="Tỷ lệ hoàn thành"
                value={0}
                precision={2}
                suffix="%"
                valueStyle={{ color: "#3f8600" }}
              />
              <Statistic
                title="Còn thiếu (VNĐ)"
                value={0}
                valueStyle={{ color: "#cf1322" }}
              />
            </div>
          </Card>

          <Card title="Thống kê theo đợt thu">
            <p className="text-gray-500">Biểu đồ thống kê sẽ được hiển thị ở đây</p>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Quản lý Thu phí & Đóng góp
        </Title>
      </div>

      <Tabs items={tabItems} />
    </div>
  );
}