"use client";

import React from "react";
import { Button, Table, Space, Typography, Tag } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  ExportOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { personAPI } from "@/services/api";
import PersonDetailModal from "@/components/PersonDetailModal";

const { Title } = Typography;

export default function NhanKhauPage() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentPerson, setCurrentPerson] = React.useState(0);

  const [personData, setPersonData] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await personAPI.getAll();
        setPersonData(data);
      }
      catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 120,
    },
    {
      title: "CMND/CCCD",
      dataIndex: "idNumber",
      key: "idNumber",
      width: 140,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const color = status === "ALIVE" ? "green" : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record, index) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setCurrentPerson(index);
              setIsOpen(true);
            }}
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  const updatePersonData = async (values) => {
    await personAPI.updateOne(values);
  }

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
        dataSource={personData}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} nhân khẩu`,
        }}
      />
      
      <PersonDetailModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        person={personData[currentPerson] || {}}
        onSubmit={updatePersonData}
      />
    </div>
  );
}