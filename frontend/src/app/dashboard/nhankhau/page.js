"use client";

import React from "react";
import { Button, Table, Space, Typography, Tag, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  ExportOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { personAPI } from "@/services/api";
import PersonDetailModal from "@/components/PersonDetailModal";
import PersonAddModal from "@/components/PersonAddModal";  // ← Import mới

const { Title } = Typography;

export default function NhanKhauPage() {
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);  // ← State mới
  const [currentPerson, setCurrentPerson] = React.useState(0);
  const [personData, setPersonData] = React.useState([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await personAPI.getAll();
      setPersonData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu");
    }
  };

  const handleAddPerson = async (values) => {
    try {
      await personAPI.addOne(values);
      await fetchData();  // Refresh data
    } catch (error) {
      throw new Error(error.message || "Không thể thêm nhân khẩu");
    }
  };

  const updatePersonData = async (values) => {
    try {
      await personAPI.updateOne(values);
      await fetchData();
    } catch (error) {
      throw new Error(error.message || "Không thể cập nhật thông tin");
    }
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 120,
    },
    {
      title: "CMND/CCCD",
      dataIndex: "idNumber",
      key: "idNumber",
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
              setIsDetailOpen(true);
            }}
          >
            Xem
          </Button>
        </Space>
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
          Danh sách Nhân khẩu
        </Title>
        <Space>
          <Button 
            icon={<PlusOutlined />} 
            type="primary"
            onClick={() => setIsAddOpen(true)}
          >
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
      
      {/* Modal xem/sửa */}
      <PersonDetailModal
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        person={personData[currentPerson] || {}}
        onSubmit={updatePersonData}
      />

      {/* ✅ Modal thêm mới */}
      <PersonAddModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddPerson}
      />
    </div>
  );
}