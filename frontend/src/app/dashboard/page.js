"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  Input,
  Button,
  Typography,
  Space,
  Statistic,
  Table,
  Tag,
  message,
  Skeleton,
  Empty,
  Alert
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  HomeOutlined,
  ManOutlined,
  WomanOutlined,
  ReloadOutlined,
  FilterOutlined
} from "@ant-design/icons";
import { statsAPI, personAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const { Title, Text } = Typography;

export default function DashboardPage() {
  // ============ STATE MANAGEMENT ============
  
  // Filter states
  const [selectedWard, setSelectedWard] = useState(null);
  const [wardsData, setWardsData] = useState([]);
  const [loadingWards, setLoadingWards] = useState(false);

  // Search states
  const [searchParams, setSearchParams] = useState({
    name: "",
    gender: undefined,
    ageGroup: undefined,
    status: undefined,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPagination, setSearchPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [hasSearched, setHasSearched] = useState(false);

  // Statistics states
  const [overviewStats, setOverviewStats] = useState(null);
  const [householdStats, setHouseholdStats] = useState(null);
  const [wardPersonStats, setWardPersonStats] = useState(null);
  const [wardHouseholdStats, setWardHouseholdStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const { util } = useAuth();

  // ============ UTILITY FUNCTIONS ============

  // Tính tuổi từ ngày sinh
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Filter theo nhóm tuổi (client-side)
  const filterByAgeGroup = (data, ageGroup) => {
    if (!ageGroup) return data;

    return data.filter((person) => {
      const age = calculateAge(person.dateOfBirth);
      if (age === null) return false;

      if (ageGroup === "0-18") return age <= 18;
      if (ageGroup === "19-60") return age >= 19 && age <= 60;
      if (ageGroup === "60+") return age > 60;
      return true;
    });
  };

  // ============ DATA FETCHING ============

  // Fetch danh sách phường/xã
  const fetchWards = async () => {
    if (!util || !util.provincesData || util.provincesData.length === 0) return;

    setLoadingWards(true);
    try {
      const data = util.provincesData.flatMap(item => item.wards);
      setWardsData(data);
    } catch (error) {
      console.error("Error fetching wards:", error);
      message.error(error.message);
    } finally {
      setLoadingWards(false);
    }
  };

  // Fetch thống kê tổng quan
  const fetchOverviewStats = async () => {
    setStatsLoading(true);
    try {
      const [personStats, householdData] = await Promise.all([
        statsAPI.getOverviewPersons(),
        statsAPI.getOverviewHouseholds()
      ]);
      setOverviewStats(personStats);
      setHouseholdStats(householdData);

      console.log("Overview person stats:", personStats, "household stats:", householdData);
    } catch (error) {
      console.error("Error fetching overview stats:", error);
      message.error(error.message);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch thống kê theo phường/xã
  const fetchWardStats = async (wardId) => {
    setStatsLoading(true);
    try {
      const [personStats, householdData] = await Promise.all([
        statsAPI.getWardPersons(wardId),
        statsAPI.getWardHouseholds(wardId)
      ]);
      setWardPersonStats(personStats);
      setWardHouseholdStats(householdData);
    } catch (error) {
      console.error("Error fetching ward stats:", error);
      message.error(error.message);
    } finally {
      setStatsLoading(false);
    }
  };

  // Tìm kiếm nhân khẩu
  const handleSearch = async (page = 1, pageSize = 10) => {
    // Validate: ít nhất 1 field
    const hasSearchCriteria = 
      searchParams.name.trim() ||
      searchParams.gender ||
      searchParams.ageGroup ||
      searchParams.status ||
      selectedWard;

    if (!hasSearchCriteria) {
      message.warning("Vui lòng nhập ít nhất một tiêu chí tìm kiếm");
      return;
    }

    setSearchLoading(true);
    setHasSearched(true);

    try {
      const response = await personAPI.getAll();
      // ({
      //   search: searchParams.name.trim() || undefined,
      //   wardId: selectedWard || undefined,
      //   status: searchParams.status || undefined,
      //   page: page - 1, // Backend uses 0-based indexing
      //   size: pageSize
      // });

      // Filter theo age group (client-side)
      let filteredData = response.content || [];
      if (searchParams.ageGroup) {
        filteredData = filterByAgeGroup(filteredData, searchParams.ageGroup);
      }

      // Filter theo gender (client-side nếu backend không hỗ trợ)
      if (searchParams.gender) {
        filteredData = filteredData.filter(
          (person) => person.gender === searchParams.gender
        );
      }

      setSearchResults(filteredData);
      setSearchPagination({
        current: page,
        pageSize: pageSize,
        total: response.totalElements || filteredData.length
      });
    } catch (error) {
      console.error("Error searching:", error);
      message.error(error.message);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Reset tìm kiếm
  const handleResetSearch = () => {
    setSearchParams({
      name: "",
      gender: undefined,
      ageGroup: undefined,
      status: undefined
    });
    setSearchResults([]);
    setHasSearched(false);
    setSearchPagination({
      current: 1,
      pageSize: 10,
      total: 0
    });
  };

  // ============ EFFECTS ============

  // Load initial data
  useEffect(() => {
    fetchOverviewStats();
  }, []);

  useEffect(() => {
    fetchWards();
  }, [util]);

  // Load ward stats when ward is selected
  useEffect(() => {
    if (selectedWard) {
      fetchWardStats(selectedWard);
    } else {
      setWardPersonStats(null);
      setWardHouseholdStats(null);
    }
  }, [selectedWard]);

  // ============ COMPUTED VALUES ============

  // Dữ liệu hiển thị (ưu tiên ward stats nếu có)
  const displayStats = useMemo(() => {
    if (wardPersonStats) {
      return {
        total: wardPersonStats.totalInWard,
        alive: wardPersonStats.aliveInWard,
        male: wardPersonStats.genderStats?.male || 0,
        female: wardPersonStats.genderStats?.female || 0,
        age0To18: wardPersonStats.ageGroupStats?.age0To17 || 0,
        age19To60: wardPersonStats.ageGroupStats?.age18To60 || 0,
        ageOver60: wardPersonStats.ageGroupStats?.ageOver60 || 0,
        tempResidents: wardPersonStats.tempResidents || 0,
        tempAbsences: wardPersonStats.tempAbsences || 0
      };
    }

    if (overviewStats) {
      return {
        total: overviewStats.total,
        alive: overviewStats.alive,
        male: overviewStats.genderStats?.male || 0,
        female: overviewStats.genderStats?.female || 0,
        age0To18: overviewStats.ageGroupStats?.age0To17 || 0,
        age19To60: overviewStats.ageGroupStats?.age18To60 || 0,
        ageOver60: overviewStats.ageGroupStats?.ageOver60 || 0,
        tempResidents: 0,
        tempAbsences: 0
      };
    }

    return null;
  }, [overviewStats, wardPersonStats]);

  const displayHouseholdStats = useMemo(() => {
    if (wardHouseholdStats) {
      return {
        totalHouseholds: wardHouseholdStats.numActiveHousehold,
        avgPerHousehold:
          wardPersonStats?.aliveInWard && wardHouseholdStats.numActiveHousehold
            ? (wardPersonStats.aliveInWard / wardHouseholdStats.numActiveHousehold).toFixed(2)
            : 0
      };
    }

    if (householdStats) {
      return {
        totalHouseholds: householdStats.numActiveHousehold,
        avgPerHousehold:
          overviewStats?.alive && householdStats.numActiveHousehold
            ? (overviewStats.alive / householdStats.numActiveHousehold).toFixed(2)
            : 0
      };
    }

    return null;
  }, [householdStats, wardHouseholdStats, overviewStats, wardPersonStats]);

  // ============ TABLE COLUMNS ============

  const searchColumns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 180,
    },
    {
      title: "CMND/CCCD",
      dataIndex: "idNumber",
      key: "idNumber",
      width: 140,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (gender) => {
        const genderMap = {
          M: { color: "blue", icon: <ManOutlined />, text: "Nam" },
          F: { color: "pink", icon: <WomanOutlined />, text: "Nữ" },
          X: { color: "default", text: "Khác" }
        };
        const config = genderMap[gender] || { color: "default", text: "N/A" };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 120,
    },
    {
      title: "Độ tuổi",
      key: "age",
      width: 100,
      render: (_, record) => {
        const age = calculateAge(record.dateOfBirth);
        return age !== null ? `${age} tuổi` : "N/A";
      },
    },
    {
      title: "Địa chỉ",
      key: "address",
      ellipsis: true,
      render: (_, record) => {
        const parts = [
          record.permAddressDetails,
          record.permAddressWardName,
          record.permAddressProvinceName
        ].filter(Boolean);
        return parts.join(", ") || "Chưa cập nhật";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const statusMap = {
          ALIVE: { color: "green", text: "Còn sống" },
          DEAD: { color: "red", text: "Đã mất" }
        };
        const config = statusMap[status] || { color: "default", text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            // Navigate to person detail page
            window.location.href = `/dashboard/nhankhau?id=${record.id}`;
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  // ============ RENDER ============

  return (
    <div>
      {/* Header with Ward Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Thống kê & Tìm kiếm
        </Title>
        <Space>
          <Text strong>Lọc theo:</Text>
          <Select
            placeholder="Tất cả phường/xã"
            style={{ width: 250 }}
            value={selectedWard}
            onChange={setSelectedWard}
            allowClear
            loading={loadingWards}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              { value: null, label: "Tất cả phường/xã" },
              ...wardsData.map((ward) => ({
                value: ward.id,
                label: `${ward.name} - ${ward.provinceName}`,
              })),
            ]}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              if (selectedWard) {
                fetchWardStats(selectedWard);
              } else {
                fetchOverviewStats();
              }
            }}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      {/* Alert khi chọn ward */}
      {selectedWard && (
        <Alert
          message={`Đang hiển thị thống kê của: ${
            wardsData.find((w) => w.id === selectedWard)?.name || ""
          }`}
          type="info"
          showIcon
          closable
          onClose={() => setSelectedWard(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* ============ SECTION 1: SEARCH PANEL ============ */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title level={5} style={{ margin: 0 }}>
              <FilterOutlined /> Tìm kiếm nâng cao
            </Title>
            {hasSearched && (
              <Button onClick={handleResetSearch} size="small">
                Xóa bộ lọc
              </Button>
            )}
          </div>

          <Space size="middle" wrap>
            <Input
              placeholder="Họ và tên"
              style={{ width: 200 }}
              value={searchParams.name}
              onChange={(e) =>
                setSearchParams({ ...searchParams, name: e.target.value })
              }
              onPressEnter={() => handleSearch()}
            />

            <Select
              placeholder="Giới tính"
              style={{ width: 150 }}
              value={searchParams.gender}
              onChange={(value) =>
                setSearchParams({ ...searchParams, gender: value })
              }
              allowClear
            >
              <Select.Option value="M">Nam</Select.Option>
              <Select.Option value="F">Nữ</Select.Option>
              <Select.Option value="X">Khác</Select.Option>
            </Select>

            <Select
              placeholder="Độ tuổi"
              style={{ width: 150 }}
              value={searchParams.ageGroup}
              onChange={(value) =>
                setSearchParams({ ...searchParams, ageGroup: value })
              }
              allowClear
            >
              <Select.Option value="0-18">0-18 tuổi</Select.Option>
              <Select.Option value="19-60">19-60 tuổi</Select.Option>
              <Select.Option value="60+">Trên 60 tuổi</Select.Option>
            </Select>

            <Select
              placeholder="Trạng thái"
              style={{ width: 180 }}
              value={searchParams.status}
              onChange={(value) =>
                setSearchParams({ ...searchParams, status: value })
              }
              allowClear
            >
              <Select.Option value="ALIVE">Còn sống</Select.Option>
              <Select.Option value="DEAD">Đã mất</Select.Option>
            </Select>

            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleSearch()}
              loading={searchLoading}
            >
              Tìm kiếm
            </Button>
          </Space>
        </Space>

        {/* Search Results Table */}
        {hasSearched && (
          <div style={{ marginTop: 24 }}>
            <Title level={5}>
              Kết quả tìm kiếm ({searchPagination.total || 0})
            </Title>
            {searchLoading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : searchResults.length > 0 ? (
              <Table
                columns={searchColumns}
                dataSource={searchResults}
                rowKey="id"
                scroll={{ x: 1200 }}
                pagination={{
                  ...searchPagination,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng ${total} kết quả`,
                  onChange: (page, pageSize) => {
                    handleSearch(page, pageSize);
                  },
                }}
              />
            ) : (
              <Empty description="Không tìm thấy kết quả phù hợp" />
            )}
          </div>
        )}
      </Card>

      {/* ============ SECTION 2: MAIN STATISTICS ============ */}
      <Title level={4} style={{ marginBottom: 16 }}>
        Tổng quan thống kê
        {selectedWard && <Text type="secondary" style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 8 }}>
          (theo phường/xã đã chọn)
        </Text>}
      </Title>

      {statsLoading ? (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {[1, 2, 3, 4].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card>
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : displayStats ? (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Tổng dân số"
                value={displayStats.total}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Nam"
                value={displayStats.male}
                prefix={<ManOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Nữ"
                value={displayStats.female}
                prefix={<WomanOutlined />}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Đang sinh sống"
                value={displayStats.alive}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
        </Row>
      ) : (
        <Alert
          message="Không có dữ liệu thống kê"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* ============ SECTION 3: AGE DISTRIBUTION ============ */}
      {displayStats && (
        <Card title="Phân bố theo độ tuổi" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card hoverable>
                <Statistic
                  title="0-18 tuổi"
                  value={displayStats.age0To18}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card hoverable>
                <Statistic
                  title="19-60 tuổi"
                  value={displayStats.age19To60}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card hoverable>
                <Statistic
                  title="Trên 60 tuổi"
                  value={displayStats.ageOver60}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      )}

      {/* ============ SECTION 4: HOUSEHOLD STATISTICS ============ */}
      {displayHouseholdStats && (
        <Card title="Thống kê hộ khẩu" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card hoverable>
                <Statistic
                  title="Tổng số hộ khẩu"
                  value={displayHouseholdStats.totalHouseholds}
                  prefix={<HomeOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card hoverable>
                <Statistic
                  title="Trung bình người/hộ"
                  value={displayHouseholdStats.avgPerHousehold}
                  valueStyle={{ color: "#13c2c2" }}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      )}

      {/* ============ SECTION 5: TEMPORARY STATUS ============ */}
      {selectedWard && wardPersonStats && (
        <Card title="Tình trạng tạm trú/tạm vắng">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card hoverable>
                <Statistic
                  title="Người tạm trú"
                  value={displayStats.tempResidents}
                  valueStyle={{ color: "#1890ff" }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Người từ nơi khác đến tạm trú tại phường/xã này
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card hoverable>
                <Statistic
                  title="Người tạm vắng"
                  value={displayStats.tempAbsences}
                  valueStyle={{ color: "#faad14" }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Người thuộc phường/xã này đi tạm vắng
                </Text>
              </Card>
            </Col>
          </Row>
        </Card>
      )}

      {!selectedWard && (
        <Alert
          message="Chọn phường/xã để xem thống kê tạm trú/tạm vắng"
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
}