"use client";

import React from "react";
import { Button, Table, Space, Typography, Tag, Tabs } from "antd";
import { PlusOutlined, HomeOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function TamTruPage() {
  const columnsTamTru = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "CMND/CCCD",
      dataIndex: "idCard",
      key: "idCard",
      width: 140,
    },
    {
      title: "Địa chỉ tạm trú",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Từ ngày",
      dataIndex: "fromDate",
      key: "fromDate",
      width: 120,
    },
    {
      title: "Đến ngày",
      dataIndex: "toDate",
      key: "toDate",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => <Tag color="blue">{status}</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
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

  const columnsTamVang = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "CMND/CCCD",
      dataIndex: "idCard",
      key: "idCard",
      width: 140,
    },
    {
      title: "Nơi đến",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Từ ngày",
      dataIndex: "fromDate",
      key: "fromDate",
      width: 120,
    },
    {
      title: "Đến ngày",
      dataIndex: "toDate",
      key: "toDate",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => <Tag color="orange">{status}</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
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

  const dataTamTru = [
    {
      key: "1",
      name: "Phạm Văn D",
      idCard: "001090045678",
      address: "123 Đường ABC, Phường 1",
      fromDate: "01/01/2024",
      toDate: "31/12/2024",
      status: "Đang tạm trú",
    },
  ];

  const dataTamVang = [
    {
      key: "1",
      name: "Nguyễn Thị E",
      idCard: "001088012345",
      destination: "Hà Nội",
      fromDate: "15/02/2024",
      toDate: "15/08/2024",
      status: "Đang tạm vắng",
    },
  ];

  const tabItems = [
    {
      key: "tamtru",
      label: "Tạm trú",
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button icon={<EnvironmentOutlined />} type="primary">
              Đăng ký tạm trú
            </Button>
          </div>
          <Table
            columns={columnsTamTru}
            dataSource={dataTamTru}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng ${total} người tạm trú`,
            }}
          />
        </div>
      ),
    },
    {
      key: "tamvang",
      label: "Tạm vắng",
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button icon={<HomeOutlined />} type="primary">
              Đăng ký tạm vắng
            </Button>
          </div>
          <Table
            columns={columnsTamVang}
            dataSource={dataTamVang}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng ${total} người tạm vắng`,
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Quản lý Tạm trú - Tạm vắng
      </Title>

      <Tabs items={tabItems} />
    </div>
  );
}