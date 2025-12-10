"use client";

import React from "react";
import { Button, Table, Space, Typography, Tag, Tabs, Card, Statistic, message } from "antd";
import {
  PlusOutlined,
  WalletOutlined,
  TransactionOutlined,
  ShoppingOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { fundManagementAPI } from "@/services/api";

const { Title } = Typography;

export default function QuanLyQuyPage() {
  const [fundsData, setFundsData] = React.useState([]);
  const [transactionsData, setTransactionsData] = React.useState([]);
  const [expensesData, setExpensesData] = React.useState([]);
  const [transfersData, setTransfersData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [funds, transactions, expenses, transfers] = await Promise.all([
        fundManagementAPI.getFunds(),
        fundManagementAPI.getTransactions(),
        fundManagementAPI.getExpenses(),
        fundManagementAPI.getTransfers(),
      ]);
      setFundsData(funds);
      setTransactionsData(transactions);
      setExpensesData(expenses);
      setTransfersData(transfers);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Columns cho bảng Quỹ
  const fundsColumns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên quỹ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type) => {
        const typeMap = {
          GENERAL: "Quỹ chung",
          SPECIFIC: "Quỹ chuyên dụng",
        };
        return typeMap[type] || type;
      },
    },
    {
      title: "Số dư (VNĐ)",
      dataIndex: "balance",
      key: "balance",
      width: 150,
      render: (value) => (
        <span style={{ color: value >= 0 ? "#3f8600" : "#cf1322", fontWeight: "bold" }}>
          {value?.toLocaleString("vi-VN") || "0"}
        </span>
      ),
    },
    {
      title: "Tiền tệ",
      dataIndex: "currency",
      key: "currency",
      width: 100,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
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

  // Columns cho bảng Giao dịch
  const transactionsColumns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Quỹ",
      dataIndex: "fund",
      key: "fund",
      render: (_, record) => record.fundName || "—",
    },
    {
      title: "Loại giao dịch",
      dataIndex: "transactionType",
      key: "transactionType",
      width: 150,
      render: (type) => {
        const typeMap = {
          INFLOW: { color: "green", text: "Thu" },
          OUTFLOW: { color: "red", text: "Chi" },
          TRANSFER_IN: { color: "blue", text: "Chuyển đến" },
          TRANSFER_OUT: { color: "orange", text: "Chuyển đi" },
        };
        const config = typeMap[type] || { color: "default", text: type };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Số tiền (VNĐ)",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (value, record) => {
        const color = (record.transactionType === "INFLOW" || record.transactionType === "TRANSFER_IN") ? "#3f8600" : "#cf1322";
        return (
          <span style={{ color, fontWeight: "bold" }}>
            {value?.toLocaleString("vi-VN") || "0"}
          </span>
        );
      },
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "transactionDate",
      key: "transactionDate",
      width: 120,
    },
    {
      title: "Người thực hiện",
      dataIndex: "user",
      key: "user",
      render: (_, record) => record.username || "—",
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: () => (
        <Button type="link" size="small">
          Xem
        </Button>
      ),
    },
  ];

  // Columns cho bảng Chi tiêu
  const expensesColumns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Quỹ",
      dataIndex: "fund",
      key: "fund",
      render: (_, record) => record.fundName || "—",
    },
    {
      title: "Số tiền (VNĐ)",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (value) => (
        <span style={{ color: "#cf1322", fontWeight: "bold" }}>
          {value?.toLocaleString("vi-VN") || "0"}
        </span>
      ),
    },
    {
      title: "Ngày chi",
      dataIndex: "expenseDate",
      key: "expenseDate",
      width: 120,
    },
    {
      title: "Người nhận",
      dataIndex: "recipient",
      key: "recipient",
      width: 150,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const statusMap = {
          PENDING: { color: "warning", text: "Chờ duyệt" },
          COMPLETED: { color: "success", text: "Đã hoàn thành" },
          CANCELLED: { color: "error", text: "Đã hủy" },
        };
        const config = statusMap[status] || { color: "default", text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: () => (
        <Button type="link" size="small">
          Xem
        </Button>
      ),
    },
  ];

  // Columns cho bảng Chuyển quỹ
  const transfersColumns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Từ quỹ",
      dataIndex: "sourceFund",
      key: "sourceFund",
      render: (_, record) => record.sourceFundName || "—",
    },
    {
      title: "Đến quỹ",
      dataIndex: "destFund",
      key: "destFund",
      render: (_, record) => record.destFundName || "—",
    },
    {
      title: "Số tiền (VNĐ)",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (value) => (
        <span style={{ fontWeight: "bold" }}>
          {value?.toLocaleString("vi-VN") || "0"}
        </span>
      ),
    },
    {
      title: "Ngày chuyển",
      dataIndex: "transferDate",
      key: "transferDate",
      width: 120,
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const statusMap = {
          PENDING: { color: "warning", text: "Chờ duyệt" },
          COMPLETED: { color: "success", text: "Đã hoàn thành" },
          CANCELLED: { color: "error", text: "Đã hủy" },
        };
        const config = statusMap[status] || { color: "default", text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: () => (
        <Button type="link" size="small">
          Xem
        </Button>
      ),
    },
  ];

  // Statistics
  const stats = {
    totalFunds: fundsData.length || 0,
    totalBalance: fundsData.reduce((sum, f) => sum + (f.balance || 0), 0),
    totalIncome: transactionsData
        .filter((t) => t.transactionType === "INFLOW" || t.transactionType === "TRANSFER_IN")
        .reduce((sum, t) => sum + (t.amount || 0), 0),
    totalExpense: transactionsData
        .filter((t) => t.transactionType === "OUTFLOW" || t.transactionType === "TRANSFER_OUT")
        .reduce((sum, t) => sum + (t.amount || 0), 0),
  };

  const tabItems = [
    {
      key: "funds",
      label: "Quỹ",
      children: (
        <div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <Statistic
                title="Tổng số quỹ"
                value={stats.totalFunds}
                prefix={<WalletOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Tổng số dư (VNĐ)"
                value={stats.totalBalance}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
            <Card>
              <Statistic
                title="Tổng thu (VNĐ)"
                value={stats.totalIncome}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
            <Card>
              <Statistic
                title="Tổng chi (VNĐ)"
                value={stats.totalExpense}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Button icon={<PlusOutlined />} type="primary">
              Tạo quỹ mới
            </Button>
          </div>

          <Table
            columns={fundsColumns}
            dataSource={fundsData}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} quỹ`,
            }}
          />
        </div>
      ),
    },
    {
      key: "transactions",
      label: "Giao dịch",
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button icon={<TransactionOutlined />} type="primary">
              Tạo giao dịch mới
            </Button>
          </div>

          <Table
            columns={transactionsColumns}
            dataSource={transactionsData}
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
      key: "expenses",
      label: "Chi tiêu",
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button icon={<ShoppingOutlined />} type="primary">
              Tạo phiếu chi mới
            </Button>
          </div>

          <Table
            columns={expensesColumns}
            dataSource={expensesData}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} phiếu chi`,
            }}
          />
        </div>
      ),
    },
    {
      key: "transfers",
      label: "Chuyển quỹ",
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button icon={<SwapOutlined />} type="primary">
              Tạo chuyển quỹ mới
            </Button>
          </div>

          <Table
            columns={transfersColumns}
            dataSource={transfersData}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} lần chuyển`,
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
          <Card title="Tổng quan tài chính">
            <div className="grid grid-cols-3 gap-4">
              <Statistic
                title="Tổng thu (VNĐ)"
                value={stats.totalIncome}
                valueStyle={{ color: "#3f8600" }}
              />
              <Statistic
                title="Tổng chi (VNĐ)"
                value={stats.totalExpense}
                valueStyle={{ color: "#cf1322" }}
              />
              <Statistic
                title="Chênh lệch (VNĐ)"
                value={stats.totalIncome - stats.totalExpense}
                valueStyle={{
                  color: stats.totalIncome - stats.totalExpense >= 0 ? "#3f8600" : "#cf1322",
                }}
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
          Quản lý Quỹ
        </Title>
      </div>

      <Tabs items={tabItems} />
    </div>
  );
}