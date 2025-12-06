"use client";

import React from "react";
import { Button, Table, Space, Typography, Tag, Tabs, Card, Statistic, message } from "antd";
import {
  PlusOutlined,
  GiftOutlined,
  TrophyOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { rewardAPI } from "@/services/api";

const { Title } = Typography;

export default function CapPhatThuongPage() {
  const [rewardData, setRewardData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await rewardAPI.getAll();
      setRewardData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu phần thưởng");
    } finally {
      setLoading(false);
    }
  };

  // Columns cho bảng Đợt phát thưởng
  const distributionsColumns = [
    {
      title: "Mã đợt",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Tên đợt phát thưởng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại hình",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type) => {
        const colors = {
          "Quà dịp lễ": "blue",
          "Thưởng thành tích": "gold",
        };
        const icons = {
          "Quà dịp lễ": <GiftOutlined />,
          "Thưởng thành tích": <TrophyOutlined />,
        };
        return (
          <Tag icon={icons[type]} color={colors[type] || "default"}>
            {type}
          </Tag>
        );
      },
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
      title: "Số phần",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "center",
    },
    {
      title: "Tổng giá trị (VNĐ)",
      dataIndex: "totalValue",
      key: "totalValue",
      width: 150,
      render: (value) => value?.toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const color = status === "Đang phát" ? "processing" : "success";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: () => (
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

  // Columns cho bảng Quà dịp lễ
  const holidayGiftsColumns = [
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
      title: "Số trẻ em (0-18)",
      dataIndex: "childrenCount",
      key: "childrenCount",
      width: 130,
      align: "center",
    },
    {
      title: "Số phần quà",
      dataIndex: "giftCount",
      key: "giftCount",
      width: 110,
      align: "center",
    },
    {
      title: "Giá trị/phần (VNĐ)",
      dataIndex: "valuePerGift",
      key: "valuePerGift",
      width: 150,
      render: (value) => value?.toLocaleString("vi-VN"),
    },
    {
      title: "Tổng giá trị (VNĐ)",
      dataIndex: "totalValue",
      key: "totalValue",
      width: 150,
      render: (value) => value?.toLocaleString("vi-VN"),
    },
    {
      title: "Ngày phát",
      dataIndex: "distributionDate",
      key: "distributionDate",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const color = status === "Đã nhận" ? "success" : "warning";
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

  // Columns cho bảng Thưởng thành tích
  const achievementRewardsColumns = [
    {
      title: "Họ tên học sinh",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Mã hộ khẩu",
      dataIndex: "householdCode",
      key: "householdCode",
      width: 120,
    },
    {
      title: "Trường",
      dataIndex: "school",
      key: "school",
    },
    {
      title: "Lớp",
      dataIndex: "grade",
      key: "grade",
      width: 80,
      align: "center",
    },
    {
      title: "Thành tích",
      dataIndex: "achievement",
      key: "achievement",
      width: 150,
      render: (achievement) => {
        const colors = {
          "Giỏi": "gold",
          "Khá": "blue",
          "Tiên tiến": "green",
        };
        return <Tag color={colors[achievement]}>{achievement}</Tag>;
      },
    },
    {
      title: "Số vở",
      dataIndex: "notebookCount",
      key: "notebookCount",
      width: 90,
      align: "center",
    },
    {
      title: "Giá trị (VNĐ)",
      dataIndex: "value",
      key: "value",
      width: 130,
      render: (value) => value?.toLocaleString("vi-VN"),
    },
    {
      title: "Minh chứng",
      dataIndex: "hasProof",
      key: "hasProof",
      width: 110,
      align: "center",
      render: (hasProof) => (
        <Tag color={hasProof ? "success" : "default"}>
          {hasProof ? "Có" : "Chưa có"}
        </Tag>
      ),
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

  // Mock statistics
  const stats = {
    totalDistributions: rewardData.length || 0,
    activeDistributions: rewardData.filter(r => r.status === "Đang phát").length || 0,
    totalGifts: 0,
    totalValue: rewardData.reduce((sum, r) => sum + (r.totalValue || 0), 0),
  };

  const tabItems = [
    {
      key: "distributions",
      label: "Đợt phát thưởng",
      children: (
        <div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <Statistic
                title="Tổng số đợt"
                value={stats.totalDistributions}
                prefix={<GiftOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Đang phát"
                value={stats.activeDistributions}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
            <Card>
              <Statistic
                title="Tổng số phần"
                value={stats.totalGifts}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
            <Card>
              <Statistic
                title="Tổng giá trị (VNĐ)"
                value={stats.totalValue}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Button icon={<PlusOutlined />} type="primary">
              Tạo đợt phát thưởng mới
            </Button>
          </div>

          <Table
            columns={distributionsColumns}
            dataSource={rewardData}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} đợt phát`,
            }}
          />
        </div>
      ),
    },
    {
      key: "holiday-gifts",
      label: "Quà dịp lễ",
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button icon={<GiftOutlined />} type="primary">
                Ghi nhận phát quà
              </Button>
              <Button icon={<FileSearchOutlined />}>
                Tra cứu
              </Button>
            </Space>
          </div>

          <Table
            columns={holidayGiftsColumns}
            dataSource={[]} // Sẽ load từ API
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} hộ`,
            }}
          />
        </div>
      ),
    },
    {
      key: "achievement-rewards",
      label: "Thưởng thành tích",
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button icon={<TrophyOutlined />} type="primary">
                Ghi nhận thưởng
              </Button>
              <Button icon={<FileSearchOutlined />}>
                Tra cứu
              </Button>
            </Space>
          </div>

          <Table
            columns={achievementRewardsColumns}
            dataSource={[]} // Sẽ load từ API
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} học sinh`,
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
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card title="Thống kê Quà dịp lễ">
              <div className="space-y-4">
                <Statistic
                  title="Tổng số hộ nhận"
                  value={0}
                />
                <Statistic
                  title="Tổng số phần quà"
                  value={0}
                />
                <Statistic
                  title="Tổng giá trị (VNĐ)"
                  value={0}
                  valueStyle={{ color: "#3f8600" }}
                />
              </div>
            </Card>

            <Card title="Thống kê Thưởng thành tích">
              <div className="space-y-4">
                <Statistic
                  title="Tổng số học sinh"
                  value={0}
                />
                <Statistic
                  title="Tổng số vở"
                  value={0}
                />
                <Statistic
                  title="Tổng giá trị (VNĐ)"
                  value={0}
                  valueStyle={{ color: "#faad14" }}
                />
              </div>
            </Card>
          </div>

          <Card title="Thống kê theo đợt phát">
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
          Quản lý Cấp phát Phần thưởng
        </Title>
      </div>

      <Tabs items={tabItems} />
    </div>
  );
}