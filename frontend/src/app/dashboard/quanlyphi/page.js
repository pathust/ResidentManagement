"use client";

import React from "react";
import { Button, Table, Space, Typography, Tag, Tabs, Card, Statistic, message } from "antd";
import {
  PlusOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { feeManagementAPI } from "@/services/api";

const { Title } = Typography;

export default function QuanLyPhiPage() {
  const [eventsData, setEventsData] = React.useState([]);
  const [paymentsData, setPaymentsData] = React.useState([]);
  const [feeTypesData, setFeeTypesData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [events, payments, types] = await Promise.all([
        feeManagementAPI.getEvents(),
        feeManagementAPI.getPayments(),
        feeManagementAPI.getFeeTypes(),
      ]);
      setEventsData(events);
      setPaymentsData(payments);
      setFeeTypesData(types);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Columns cho bảng Đợt thu phí
  const eventsColumns = [
    {
      title: "Mã đợt",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Loại phí",
      dataIndex: "feeType",
      key: "feeType",
      render: (feeType) => feeType?.name || "—",
    },
    {
      title: "Ngày thu",
      dataIndex: "eventDate",
      key: "eventDate",
      width: 120,
    },
    {
      title: "Hạn nộp",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 120,
    },
    {
      title: "Tổng dự kiến (VNĐ)",
      dataIndex: "totalExpected",
      key: "totalExpected",
      width: 150,
      render: (value) => value?.toLocaleString("vi-VN") || "0",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const statusConfig = {
          OPEN: { color: "processing", icon: <ClockCircleOutlined />, text: "Đang thu" },
          CLOSED: { color: "success", icon: <CheckCircleOutlined />, text: "Đã đóng" },
        };
        const config = statusConfig[status] || { color: "default", text: status };
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Người thu",
      dataIndex: "collectorUser",
      key: "collectorUser",
      render: (user) => user?.username || "—",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: () => (
        <Space>
          <Button type="link" size="small">
            Xem
          </Button>
          <Button type="link" size="small">
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  // Columns cho bảng Thanh toán
  const paymentsColumns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Mã hộ",
      dataIndex: "household",
      key: "household",
      render: (household) => household?.code || "—",
    },
    {
      title: "Đợt thu",
      dataIndex: "collectionEvent",
      key: "collectionEvent",
      render: (event) => event?.feeType?.name || "—",
    },
    {
      title: "Số tiền (VNĐ)",
      dataIndex: "expectedAmount",
      key: "expectedAmount",
      width: 130,
      render: (value) => value?.toLocaleString("vi-VN") || "0",
    },
    {
      title: "Đã nộp (VNĐ)",
      dataIndex: "amountPaid",
      key: "amountPaid",
      width: 130,
      render: (value) => value?.toLocaleString("vi-VN") || "0",
    },
    {
      title: "Ngày nộp",
      dataIndex: "paymentDate",
      key: "paymentDate",
      width: 120,
    },
    {
      title: "Phương thức",
      dataIndex: "method",
      key: "method",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const statusConfig = {
          PENDING: { color: "warning", text: "Chưa nộp" },
          PARTIAL: { color: "processing", text: "Nộp một phần" },
          PAID: { color: "success", text: "Đã nộp" },
        };
        const config = statusConfig[status] || { color: "default", text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
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

  // Columns cho bảng Loại phí
  const feeTypesColumns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên loại phí",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      width: 100,
    },
    {
      title: "Số tiền mặc định (VNĐ)",
      dataIndex: "defaultAmount",
      key: "defaultAmount",
      width: 180,
      render: (value) => value?.toLocaleString("vi-VN") || "0",
    },
    {
      title: "Tần suất",
      dataIndex: "frequency",
      key: "frequency",
      width: 120,
      render: (freq) => {
        const freqMap = {
          ONE_TIME: "Một lần",
          MONTHLY: "Hàng tháng",
          QUARTERLY: "Hàng quý",
          YEARLY: "Hàng năm",
        };
        return freqMap[freq] || freq;
      },
    },
    {
      title: "Bắt buộc",
      dataIndex: "isMandatory",
      key: "isMandatory",
      width: 100,
      render: (mandatory) => (
        <Tag color={mandatory ? "blue" : "default"}>
          {mandatory ? "Có" : "Không"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: () => (
        <Space>
          <Button type="link" size="small">
            Sửa
          </Button>
          <Button type="link" size="small" danger>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Statistics
  const stats = {
    totalEvents: eventsData.length || 0,
    activeEvents: eventsData.filter((e) => e.status === "OPEN").length || 0,
    totalExpected: eventsData.reduce((sum, e) => sum + (e.totalExpected || 0), 0),
    totalPaid: paymentsData.reduce((sum, p) => sum + (p.amountPaid || 0), 0),
  };

  const tabItems = [
    {
      key: "events",
      label: "Đợt thu phí",
      children: (
        <div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <Statistic
                title="Tổng số đợt"
                value={stats.totalEvents}
                prefix={<FileTextOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Đang thu"
                value={stats.activeEvents}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
            <Card>
              <Statistic
                title="Tổng dự kiến (VNĐ)"
                value={stats.totalExpected}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
            <Card>
              <Statistic
                title="Đã thu (VNĐ)"
                value={stats.totalPaid}
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
            columns={eventsColumns}
            dataSource={eventsData}
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
      label: "Thanh toán",
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button icon={<DollarOutlined />} type="primary">
                Ghi nhận thanh toán
              </Button>
            </Space>
          </div>

          <Table
            columns={paymentsColumns}
            dataSource={paymentsData}
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
      key: "types",
      label: "Loại phí",
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button icon={<PlusOutlined />} type="primary">
              Thêm loại phí mới
            </Button>
          </div>

          <Table
            columns={feeTypesColumns}
            dataSource={feeTypesData}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} loại phí`,
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
          <Card title="Thống kê chi tiết">
            <div className="grid grid-cols-3 gap-4">
              <Statistic
                title="Số hộ đã nộp"
                value={paymentsData.filter((p) => p.status === "PAID").length}
                suffix={`/ ${paymentsData.length}`}
              />
              <Statistic
                title="Tỷ lệ hoàn thành"
                value={
                  stats.totalExpected > 0
                    ? ((stats.totalPaid / stats.totalExpected) * 100).toFixed(2)
                    : 0
                }
                precision={2}
                suffix="%"
                valueStyle={{ color: "#3f8600" }}
              />
              <Statistic
                title="Còn thiếu (VNĐ)"
                value={stats.totalExpected - stats.totalPaid}
                valueStyle={{ color: "#cf1322" }}
              />
            </div>
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
          Quản lý Phí
        </Title>
      </div>

      <Tabs items={tabItems} />
    </div>
  );
}