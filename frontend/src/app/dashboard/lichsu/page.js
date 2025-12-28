"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Statistic,
  Row,
  Col,
  Tabs,
  message,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  EyeOutlined,
  HomeOutlined,
  UserOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { historyAPI } from "@/services/api";
import HistoryDetailModal from "@/components/HistoryDetailModal";
import * as XLSX from "xlsx";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function LichSuPage() {
  const [loading, setLoading] = useState(false);
  const [allHistory, setAllHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  
  // Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [dateRange, setDateRange] = useState(null);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRecordType, setSelectedRecordType] = useState(null);
  
  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    household: 0,
    person: 0,
    thisWeek: 0,
    today: 0,
    birth: 0,
  });

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    fetchAllHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchText, selectedType, dateRange, activeTab, allHistory]);

  const fetchAllHistory = async () => {
    try {
      setLoading(true);
      
      const params = { size: 1000, sort: "changeDate,desc" }; // Lấy nhiều records
      
      // Fetch all APIs in parallel
      const [
        headChanges,
        addressChanges,
        splits,
        birthDeclares,
        deathDeclares,
        tempResidences,
        tempAbsences,
        permResidences,
      ] = await Promise.all([
        historyAPI.getHeadChanges(params).catch(() => ({ content: [] })),
        historyAPI.getAddressChanges(params).catch(() => ({ content: [] })),
        historyAPI.getSplits(params).catch(() => ({ content: [] })),
        historyAPI.getBirthDeclares(params).catch(() => ({ content: [] })),
        historyAPI.getDeathDeclares(params).catch(() => ({ content: [] })),
        historyAPI.getTemporaryResidences(params).catch(() => ({ content: [] })),
        historyAPI.getTemporaryAbsences(params).catch(() => ({ content: [] })),
        historyAPI.getPermanentResidenceChanges(params).catch(() => ({ content: [] })),
      ]);

      // Merge all data với type và metadata
      const merged = [
        ...(headChanges.content || []).map((item) => ({
          ...item,
          type: "HEAD_CHANGE",
          category: "HOUSEHOLD",
          icon: "👑",
          color: "blue",
          label: "Đổi chủ hộ",
          date: item.changeDate,
          description: `Đổi chủ hộ #${item.householdCode}: ${item.fromPersonName} → ${item.toPersonName}`,
          searchableText: `${item.householdCode} ${item.fromPersonName} ${item.toPersonName} ${item.fromPersonIdNumber} ${item.toPersonIdNumber}`,
        })),
        ...(addressChanges.content || []).map((item) => ({
          ...item,
          type: "ADDRESS_CHANGE",
          category: "HOUSEHOLD",
          icon: "📍",
          color: "green",
          label: "Đổi địa chỉ",
          date: item.changeDate,
          description: `Đổi địa chỉ hộ #${item.householdCode}`,
          searchableText: `${item.householdCode} ${item.fromAddressWardName} ${item.toAddressWardName}`,
        })),
        ...(splits.content || []).map((item) => ({
          ...item,
          type: "SPLIT",
          category: "HOUSEHOLD",
          icon: "✂️",
          color: "orange",
          label: "Tách hộ",
          date: item.splitDate,
          description: `Tách hộ: #${item.fromHouseholdCode} → #${item.toHouseholdCode}`,
          searchableText: `${item.fromHouseholdCode} ${item.toHouseholdCode}`,
        })),
        ...(birthDeclares.content || []).map((item) => ({
          ...item,
          type: "BIRTH",
          category: "PERSON",
          icon: "👶",
          color: "cyan",
          label: "Khai sinh",
          date: item.declareDate,
          description: `Khai sinh: ${item.fullName}`,
          searchableText: `${item.fullName} ${item.declarerName} ${item.declarerIdNumber}`,
        })),
        ...(deathDeclares.content || []).map((item) => ({
          ...item,
          type: "DEATH",
          category: "PERSON",
          icon: "🕊️",
          color: "red",
          label: "Khai tử",
          date: item.declareDate,
          description: `Khai tử: ${item.fullName}`,
          searchableText: `${item.fullName} ${item.idNumber} ${item.declarerName}`,
        })),
        ...(tempResidences.content || []).map((item) => ({
          ...item,
          type: "TEMP_RESIDENCE",
          category: "PERSON",
          icon: "🏨",
          color: "purple",
          label: "Tạm trú",
          date: item.startDate,
          description: `Tạm trú: ${item.fullName}`,
          searchableText: `${item.fullName} ${item.idNumber} ${item.householdNumber}`,
        })),
        ...(tempAbsences.content || []).map((item) => ({
          ...item,
          type: "TEMP_ABSENCE",
          category: "PERSON",
          icon: "✈️",
          color: "magenta",
          label: "Tạm vắng",
          date: item.startDate,
          description: `Tạm vắng: ${item.fullName}`,
          searchableText: `${item.fullName} ${item.idNumber} ${item.householdNumber}`,
        })),
        ...(permResidences.content || []).map((item) => ({
          ...item,
          type: "PERM_RESIDENCE",
          category: "PERSON",
          icon: "🏠",
          color: "geekblue",
          label: "Đổi nơi thường trú",
          date: item.changeDate,
          description: `Đổi nơi thường trú: ${item.fullName}`,
          searchableText: `${item.fullName} ${item.idNumber} ${item.householdNumber}`,
        })),
      ];

      // Sort by date descending
      merged.sort((a, b) => new Date(b.date) - new Date(a.date));

      setAllHistory(merged);
      calculateStats(merged);
      
      message.success(`Đã tải ${merged.length} bản ghi lịch sử`);
    } catch (error) {
      console.error("Error fetching history:", error);
      message.error("Lỗi khi tải lịch sử");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const now = dayjs();
    const startOfWeek = now.startOf("week");
    const startOfDay = now.startOf("day");

    setStats({
      total: data.length,
      household: data.filter((d) => d.category === "HOUSEHOLD").length,
      person: data.filter((d) => d.category === "PERSON").length,
      thisWeek: data.filter((d) => dayjs(d.date).isAfter(startOfWeek)).length,
      today: data.filter((d) => dayjs(d.date).isAfter(startOfDay)).length,
      birth: data.filter((d) => d.type === "BIRTH").length,
    });
  };

  const applyFilters = () => {
    let filtered = [...allHistory];

    // Filter by tab
    if (activeTab !== "ALL") {
      if (activeTab === "HOUSEHOLD") {
        filtered = filtered.filter((item) => item.category === "HOUSEHOLD");
      } else if (activeTab === "PERSON") {
        filtered = filtered.filter((item) => item.category === "PERSON");
      } else if (activeTab === "BIRTH_DEATH") {
        filtered = filtered.filter((item) => 
          item.type === "BIRTH" || item.type === "DEATH"
        );
      }
    }

    // Filter by type
    if (selectedType !== "ALL") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    // Filter by search text
    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter((item) =>
        item.searchableText.toLowerCase().includes(search)
      );
    }

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].startOf("day");
      const end = dateRange[1].endOf("day");
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.date);
        return itemDate.isAfter(start) && itemDate.isBefore(end);
      });
    }

    setFilteredHistory(filtered);
    setPagination({ ...pagination, total: filtered.length, current: 1 });
  };

  const handleReset = () => {
    setSearchText("");
    setSelectedType("ALL");
    setDateRange(null);
    setActiveTab("ALL");
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setSelectedRecordType(record.type);
    setModalVisible(true);
  };

  const handleExportExcel = () => {
    const exportData = filteredHistory.map((item, index) => ({
      STT: index + 1,
      Loại: item.label,
      "Mô tả": item.description,
      "Ngày thực hiện": dayjs(item.date).format("DD/MM/YYYY"),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lịch sử");
    XLSX.writeFile(wb, `lich_su_thay_doi_${dayjs().format("DDMMYYYY")}.xlsx`);
    message.success("Đã xuất file Excel");
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => 
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Loại",
      key: "type",
      width: 150,
      render: (_, record) => (
        <Tag color={record.color}>
          {record.icon} {record.label}
        </Tag>
      ),
    },
    {
      title: "Mô tả",
      key: "description",
      ellipsis: true,
      render: (_, record) => record.description,
    },
    {
      title: "Ngày thực hiện",
      key: "date",
      width: 150,
      render: (_, record) => dayjs(record.date).format("DD/MM/YYYY"),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const tabItems = [
    { key: "ALL", label: "Tất cả", icon: <SearchOutlined /> },
    { key: "HOUSEHOLD", label: "Hộ khẩu", icon: <HomeOutlined /> },
    { key: "PERSON", label: "Nhân khẩu", icon: <UserOutlined /> },
    { key: "BIRTH_DEATH", label: "Khai sinh/tử", icon: <HeartOutlined /> },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <h2 style={{ marginBottom: 24 }}>📋 Lịch sử Thay đổi</h2>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Card>
              <Statistic
                title="Tổng thay đổi"
                value={stats.total}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Hộ khẩu"
                value={stats.household}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Nhân khẩu"
                value={stats.person}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Tuần này"
                value={stats.thisWeek}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Hôm nay"
                value={stats.today}
                valueStyle={{ color: "#eb2f96" }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Khai sinh"
                value={stats.birth}
                valueStyle={{ color: "#13c2c2" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <Input
              placeholder="🔍 Tìm kiếm theo mã hộ, tên, CCCD..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Space wrap>
              <Select
                style={{ width: 200 }}
                placeholder="Chọn loại"
                value={selectedType}
                onChange={setSelectedType}
              >
                <Option value="ALL">Tất cả loại</Option>
                <Option value="HEAD_CHANGE">👑 Đổi chủ hộ</Option>
                <Option value="ADDRESS_CHANGE">📍 Đổi địa chỉ</Option>
                <Option value="SPLIT">✂️ Tách hộ</Option>
                <Option value="BIRTH">👶 Khai sinh</Option>
                <Option value="DEATH">🕊️ Khai tử</Option>
                <Option value="TEMP_RESIDENCE">🏨 Tạm trú</Option>
                <Option value="TEMP_ABSENCE">✈️ Tạm vắng</Option>
                <Option value="PERM_RESIDENCE">🏠 Đổi nơi thường trú</Option>
              </Select>
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                format="DD/MM/YYYY"
                placeholder={["Từ ngày", "Đến ngày"]}
              />
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Đặt lại
              </Button>
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={handleExportExcel}
              >
                Xuất Excel
              </Button>
            </Space>
          </Space>
        </Card>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ marginBottom: 16 }}
        />

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredHistory}
          loading={loading}
          rowKey={(record) => `${record.type}-${record.id}`}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bản ghi`,
            onChange: (page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize });
            },
          }}
        />
      </Card>

      {/* Detail Modal */}
      <HistoryDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={selectedRecord}
        type={selectedRecordType}
      />
    </div>
  );
}