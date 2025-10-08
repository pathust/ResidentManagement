"use client";

import React from "react";
import { Button, Table, Space, Typography, Tag } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  ExportOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export default function NhanKhauPage() {
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      width: 120,
    },
    {
      title: "CMND/CCCD",
      dataIndex: "idCard",
      key: "idCard",
      width: 140,
    },
    {
      title: "Quan hệ với chủ hộ",
      dataIndex: "relation",
      key: "relation",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const color = status === "Đang sinh sống" ? "green" : "orange";
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
      name: "Nguyễn Văn A",
      dob: "15/03/1985",
      idCard: "001085012345",
      relation: "Chủ hộ",
      status: "Đang sinh sống",
    },
    {
      key: "2",
      name: "Trần Thị B",
      dob: "20/07/1987",
      idCard: "001087054321",
      relation: "Vợ",
      status: "Đang sinh sống",
    },
    {
      key: "3",
      name: "Nguyễn Văn C",
      dob: "10/11/2010",
      idCard: "001010067890",
      relation: "Con",
      status: "Đang sinh sống",
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
          Danh sách Nhân khẩu
        </Title>
        <Space>
          <Button icon={<PlusOutlined />} type="primary">
            Thêm nhân khẩu
          </Button>
          <Button icon={<EditOutlined />}>Sửa thông tin</Button>
          <Button icon={<ExportOutlined />}>Chuyển đi</Button>
          <Button icon={<CloseCircleOutlined />} danger>
            Khai tử
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} nhân khẩu`,
        }}
      />
    </div>
  );
}