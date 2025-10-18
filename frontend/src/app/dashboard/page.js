"use client";

import React from "react";
import { Button, Table, Space, Typography, Tag } from "antd";
import { PlusOutlined, EditOutlined, ScissorOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function HoKhauPage() {
  const columns = [
    {
      title: "Mã hộ khẩu",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "Chủ hộ",
      dataIndex: "chuHo",
      key: "chuHo",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số thành viên",
      dataIndex: "members",
      key: "members",
      width: 120,
      align: "center",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
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

  const data = [
    {
      key: "1",
      id: "HK001",
      chuHo: "Nguyễn Văn A",
      address: "123 Đường ABC, Phường 1, Quận 1",
      members: 4,
    },
    {
      key: "2",
      id: "HK002",
      chuHo: "Trần Thị B",
      address: "456 Đường DEF, Phường 2, Quận 3",
      members: 3,
    },
    {
      key: "3",
      id: "HK003",
      chuHo: "Lê Văn C",
      address: "789 Đường GHI, Phường 5, Quận 5",
      members: 5,
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
          Danh sách Hộ khẩu
        </Title>
        <Space>
          <Button icon={<PlusOutlined />} type="primary">
            Thêm hộ khẩu
          </Button>
          <Button icon={<EditOutlined />}>Sửa hộ khẩu</Button>
          <Button icon={<ScissorOutlined />}>Tách hộ khẩu</Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} hộ khẩu`,
        }}
      />
    </div>
  );
}