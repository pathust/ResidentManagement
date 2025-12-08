"use client";

import React from "react";
import { Button, Table, Space, Typography, Tag, Tabs, message, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { temporaryResidenceAPI, temporaryAbsenceAPI } from "@/services/api";
import TemporaryResidenceAddModal from "@/components/TemporaryResidenceAddModal";
import TemporaryResidenceDetailModal from "@/components/TemporaryResidenceDetailModal";
import TemporaryAbsenceAddModal from "@/components/TemporaryAbsenceAddModal";
import TemporaryAbsenceDetailModal from "@/components/TemporaryAbsenceDetailModal";

const { Title } = Typography;
const { Search } = Input;

export default function TamTruPage() {
  // States for Temporary Residence
  const [residenceData, setResidenceData] = React.useState([]);
  const [isResidenceAddOpen, setIsResidenceAddOpen] = React.useState(false);
  const [isResidenceDetailOpen, setIsResidenceDetailOpen] = React.useState(false);
  const [currentResidence, setCurrentResidence] = React.useState(null);
  const [residenceLoading, setResidenceLoading] = React.useState(false);
  const [residenceSearchText, setResidenceSearchText] = React.useState("");

  // States for Temporary Absence
  const [absenceData, setAbsenceData] = React.useState([]);
  const [isAbsenceAddOpen, setIsAbsenceAddOpen] = React.useState(false);
  const [isAbsenceDetailOpen, setIsAbsenceDetailOpen] = React.useState(false);
  const [currentAbsence, setCurrentAbsence] = React.useState(null);
  const [absenceLoading, setAbsenceLoading] = React.useState(false);
  const [absenceSearchText, setAbsenceSearchText] = React.useState("");

  // Fetch data on mount
  React.useEffect(() => {
    fetchResidenceData();
    fetchAbsenceData();
  }, []);

  // Temporary Residence functions
  const fetchResidenceData = async (filters = {}) => {
    try {
      setResidenceLoading(true);
      const data = await temporaryResidenceAPI.getAll({
        pageSize: 100,
        pageIndex: 0,
        ...filters
      });
      setResidenceData(data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách tạm trú");
    } finally {
      setResidenceLoading(false);
    }
  };

  const handleResidenceSearch = (value) => {
    setResidenceSearchText(value);
    if (value.trim()) {
      fetchResidenceData({ name: value });
    } else {
      fetchResidenceData();
    }
  };

  const handleResidenceCreate = async (values) => {
    try {
      await temporaryResidenceAPI.create(values);
      await fetchResidenceData();
    } catch (error) {
      throw new Error(error.message || "Không thể tạo đăng ký tạm trú");
    }
  };

  const handleResidenceEnd = async (id, data) => {
    try {
      await temporaryResidenceAPI.end(id, data);
      await fetchResidenceData();
    } catch (error) {
      throw new Error(error.message || "Không thể kết thúc tạm trú");
    }
  };

  const handleResidenceDelete = async (id) => {
    try {
      await temporaryResidenceAPI.delete(id);
      await fetchResidenceData();
    } catch (error) {
      throw new Error(error.message || "Không thể xóa đăng ký tạm trú");
    }
  };

  // Temporary Absence functions
  const fetchAbsenceData = async (filters = {}) => {
    try {
      setAbsenceLoading(true);
      const data = await temporaryAbsenceAPI.getAll({
        pageSize: 100,
        pageIndex: 0,
        ...filters
      });
      setAbsenceData(data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách tạm vắng");
    } finally {
      setAbsenceLoading(false);
    }
  };

  const handleAbsenceSearch = (value) => {
    setAbsenceSearchText(value);
    if (value.trim()) {
      fetchAbsenceData({ name: value });
    } else {
      fetchAbsenceData();
    }
  };

  const handleAbsenceCreate = async (values) => {
    try {
      await temporaryAbsenceAPI.create(values);
      await fetchAbsenceData();
    } catch (error) {
      throw new Error(error.message || "Không thể tạo đăng ký tạm vắng");
    }
  };

  const handleAbsenceEnd = async (id, data) => {
    try {
      await temporaryAbsenceAPI.end(id, data);
      await fetchAbsenceData();
    } catch (error) {
      throw new Error(error.message || "Không thể kết thúc tạm vắng");
    }
  };

  const handleAbsenceDelete = async (id) => {
    try {
      await temporaryAbsenceAPI.delete(id);
      await fetchAbsenceData();
    } catch (error) {
      throw new Error(error.message || "Không thể xóa đăng ký tạm vắng");
    }
  };

  // Table columns for Temporary Residence
  const columnsTamTru = [
    {
      title: "Họ và tên",
      dataIndex: "personName",
      key: "personName",
    },
    {
      title: "CMND/CCCD",
      dataIndex: "personIdNumber",
      key: "personIdNumber",
      width: 140,
    },
    {
      title: "Địa chỉ tạm trú",
      key: "address",
      render: (_, record) => 
        `${record.tempAddressDetails}, ${record.tempAddressWardName}`,
    },
    {
      title: "Từ ngày",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '—',
    },
    {
      title: "Đến ngày",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '—',
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_, record) => {
        const isActive = !record.endDate || dayjs(record.endDate).isAfter(dayjs());
        return (
          <Tag color={isActive ? "blue" : "default"}>
            {isActive ? "Đang tạm trú" : "Đã kết thúc"}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            setCurrentResidence(record);
            setIsResidenceDetailOpen(true);
          }}
        >
          Xem
        </Button>
      ),
    },
  ];

  // Table columns for Temporary Absence
  const columnsTamVang = [
    {
      title: "Họ và tên",
      dataIndex: "personName",
      key: "personName",
    },
    {
      title: "CMND/CCCD",
      dataIndex: "personIdNumber",
      key: "personIdNumber",
      width: 140,
    },
    {
      title: "Nơi đến",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Từ ngày",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '—',
    },
    {
      title: "Đến ngày",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '—',
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_, record) => {
        const isActive = !record.endDate || dayjs(record.endDate).isAfter(dayjs());
        return (
          <Tag color={isActive ? "orange" : "default"}>
            {isActive ? "Đang tạm vắng" : "Đã trở về"}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            setCurrentAbsence(record);
            setIsAbsenceDetailOpen(true);
          }}
        >
          Xem
        </Button>
      ),
    },
  ];

  const tabItems = [
    {
      key: "tamtru",
      label: "Tạm trú",
      children: (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Search
              placeholder="Tìm theo tên, CCCD..."
              allowClear
              enterButton={<SearchOutlined />}
              style={{ width: 400 }}
              onSearch={handleResidenceSearch}
            />
            <Button 
              icon={<PlusOutlined />} 
              type="primary"
              onClick={() => setIsResidenceAddOpen(true)}
            >
              Đăng ký tạm trú
            </Button>
          </div>
          <Table
            columns={columnsTamTru}
            dataSource={residenceData}
            rowKey="id"
            loading={residenceLoading}
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
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Search
              placeholder="Tìm theo tên, CCCD..."
              allowClear
              enterButton={<SearchOutlined />}
              style={{ width: 400 }}
              onSearch={handleAbsenceSearch}
            />
            <Button 
              icon={<PlusOutlined />} 
              type="primary"
              onClick={() => setIsAbsenceAddOpen(true)}
            >
              Đăng ký tạm vắng
            </Button>
          </div>
          <Table
            columns={columnsTamVang}
            dataSource={absenceData}
            rowKey="id"
            loading={absenceLoading}
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

      {/* Modals for Temporary Residence */}
      <TemporaryResidenceAddModal
        open={isResidenceAddOpen}
        onClose={() => setIsResidenceAddOpen(false)}
        onSubmit={handleResidenceCreate}
      />

      <TemporaryResidenceDetailModal
        open={isResidenceDetailOpen}
        onClose={() => {
          setIsResidenceDetailOpen(false);
          setCurrentResidence(null);
        }}
        residence={currentResidence}
        onEnd={handleResidenceEnd}
        onDelete={handleResidenceDelete}
      />

      {/* Modals for Temporary Absence */}
      <TemporaryAbsenceAddModal
        open={isAbsenceAddOpen}
        onClose={() => setIsAbsenceAddOpen(false)}
        onSubmit={handleAbsenceCreate}
      />

      <TemporaryAbsenceDetailModal
        open={isAbsenceDetailOpen}
        onClose={() => {
          setIsAbsenceDetailOpen(false);
          setCurrentAbsence(null);
        }}
        absence={currentAbsence}
        onEnd={handleAbsenceEnd}
        onDelete={handleAbsenceDelete}
      />
    </div>
  );
}