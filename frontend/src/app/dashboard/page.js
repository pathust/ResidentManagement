"use client";

import React, { useState, useEffect } from "react";
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
  Spin,
  Divider,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  HomeOutlined,
  ManOutlined,
  WomanOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { statsAPI, locationAPI, personAPI } from "@/services/api";

const { Title } = Typography;

export default function DashboardPage() {
  // Loading states
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  // Stats data
  const [personStats, setPersonStats] = useState(null);
  const [householdStats, setHouseholdStats] = useState(null);
  const [wardStats, setWardStats] = useState(null);

  // Filter data
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  // Search states
  const [searchParams, setSearchParams] = useState({
    name: "",
    gender: undefined,
    ageGroup: undefined,
    status: undefined,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [allPersons, setAllPersons] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch ward stats when ward is selected
  useEffect(() => {
    if (selectedWard) {
      fetchWardStats(selectedWard);
    } else {
      setWardStats(null);
    }
  }, [selectedWard]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [personStatsData, householdStatsData, provincesData, personsData] =
        await Promise.all([
          statsAPI.getPersonOverview(),
          statsAPI.getHouseholdOverview(),
          locationAPI.getAllProvinces(),
          personAPI.getAll(),
        ]);

      console.log("Person Stats:", personStatsData);
      console.log("Household Stats:", householdStatsData);

      setPersonStats(personStatsData);
      setHouseholdStats(householdStatsData);
      setProvinces(provincesData);
      setAllPersons(personsData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      message.error("Không thể tải dữ liệu thống kê: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWardStats = async (wardId) => {
    try {
      const [wardPersonStats, wardHouseholdStats] = await Promise.all([
        statsAPI.getWardPersonStats(wardId),
        statsAPI.getWardHouseholdStats(wardId),
      ]);

      console.log("Ward Person Stats:", wardPersonStats);
      console.log("Ward Household Stats:", wardHouseholdStats);

      setWardStats({
        persons: wardPersonStats,
        households: wardHouseholdStats,
      });
    } catch (error) {
      console.error("Error fetching ward stats:", error);
      message.error("Không thể tải thống kê phường/xã");
    }
  };

  const handleProvinceChange = async (provinceId) => {
    setSelectedProvince(provinceId);
    setSelectedWard(null);
    setWardStats(null);

    if (provinceId) {
      try {
        const wardsData = await locationAPI.getWardsByProvince(provinceId);
        setWards(wardsData);
      } catch (error) {
        console.error("Error fetching wards:", error);
        message.error("Không thể tải danh sách phường/xã");
      }
    } else {
      setWards([]);
    }
  };

  const handleWardChange = (wardId) => {
    setSelectedWard(wardId);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filterPersons = () => {
    let filtered = [...allPersons];

    // Filter by name
    if (searchParams.name) {
      filtered = filtered.filter((person) =>
        person.fullName.toLowerCase().includes(searchParams.name.toLowerCase())
      );
    }

    // Filter by gender
    if (searchParams.gender) {
      filtered = filtered.filter((person) => person.gender === searchParams.gender);
    }

    // Filter by age group
    if (searchParams.ageGroup) {
      filtered = filtered.filter((person) => {
        const age = calculateAge(person.dateOfBirth);
        if (age === null) return false;

        switch (searchParams.ageGroup) {
          case "0-18":
            return age >= 0 && age <= 18;
          case "19-60":
            return age >= 19 && age <= 60;
          case "60+":
            return age > 60;
          default:
            return true;
        }
      });
    }

    // Filter by status
    if (searchParams.status) {
      filtered = filtered.filter((person) => {
        switch (searchParams.status) {
          case "living":
            return person.status === "ALIVE";
          case "temp":
            return person.tempAddressWardId !== null;
          case "absent":
            return false;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const handleSearch = () => {
    setSearchLoading(true);
    try {
      const results = filterPersons();
      setSearchResults(results);
    } catch (error) {
      console.error(error);
      message.error("Không thể tìm kiếm");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearchParams({
      name: "",
      gender: undefined,
      ageGroup: undefined,
      status: undefined,
    });
    setSearchResults([]);
  };

  const searchColumns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
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
      render: (gender) => (
        <Tag color={gender === "M" ? "blue" : "pink"}>
          {gender === "M" ? "Nam" : "Nữ"}
        </Tag>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 120,
    },
    {
      title: "Địa chỉ",
      key: "address",
      render: (_, record) =>
        record.permAddressDetails && record.permAddressWardName
          ? `${record.permAddressDetails}, ${record.permAddressWardName}`
          : "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={status === "ALIVE" ? "green" : "orange"}>
          {status === "ALIVE" ? "Đang sinh sống" : "Đã mất"}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu thống kê...</div>
      </div>
    );
  }

  // ===== FIX: Correct field names based on actual API response =====
  const getPersonTotal = () => {
    if (wardStats?.persons) {
      return wardStats.persons.totalInWard || wardStats.persons.totalPersons || 0;
    }
    // Backend returns: totalPersons (not total)
    return personStats?.totalPersons || 0;
  };

  const getPersonAlive = () => {
    if (wardStats?.persons) {
      return wardStats.persons.aliveInWard || wardStats.persons.alivePersons || 0;
    }
    // Backend returns: alivePersons (not alive)
    return personStats?.alivePersons || 0;
  };

  const getMaleCount = () => {
    if (wardStats?.persons?.genderStats) {
      return wardStats.persons.genderStats.male || 0;
    }
    return personStats?.genderStats?.male || 0;
  };

  const getFemaleCount = () => {
    if (wardStats?.persons?.genderStats) {
      return wardStats.persons.genderStats.female || 0;
    }
    return personStats?.genderStats?.female || 0;
  };

  const getAge0To17 = () => {
    if (wardStats?.persons?.ageGroupStats) {
      return wardStats.persons.ageGroupStats.age0To17 || 0;
    }
    return personStats?.ageGroupStats?.age0To17 || 0;
  };

  const getAge18To60 = () => {
    if (wardStats?.persons?.ageGroupStats) {
      return wardStats.persons.ageGroupStats.age18To60 || 0;
    }
    return personStats?.ageGroupStats?.age18To60 || 0;
  };

  const getAgeOver60 = () => {
    if (wardStats?.persons?.ageGroupStats) {
      return wardStats.persons.ageGroupStats.ageOver60 || 0;
    }
    return personStats?.ageGroupStats?.ageOver60 || 0;
  };

  const getHouseholdCount = () => {
    if (wardStats?.households) {
      return wardStats.households.numActiveHousehold || wardStats.households.totalHousehold || 0;
    }
    // Backend returns: totalHousehold (not numActiveHousehold)
    return householdStats?.totalHousehold || householdStats?.numActiveHousehold || 0;
  };

  const getTempResidents = () => {
    return wardStats?.persons?.tempResidents || 0;
  };

  const getTempAbsences = () => {
    return wardStats?.persons?.tempAbsences || 0;
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Tổng quan & Thống kê
      </Title>

      {/* Filter Section */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div>
            <Title level={5} style={{ marginBottom: 16 }}>
              Lọc theo địa phương
            </Title>
            <Space size="middle">
              <Select
                placeholder="Chọn Tỉnh/Thành phố"
                style={{ width: 250 }}
                value={selectedProvince}
                onChange={handleProvinceChange}
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {provinces.map((province) => (
                  <Select.Option key={province.id} value={province.id}>
                    {province.name}
                  </Select.Option>
                ))}
              </Select>
              <Select
                placeholder="Chọn Phường/Xã"
                style={{ width: 250 }}
                value={selectedWard}
                onChange={handleWardChange}
                disabled={!selectedProvince}
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {wards.map((ward) => (
                  <Select.Option key={ward.id} value={ward.id}>
                    {ward.name}
                  </Select.Option>
                ))}
              </Select>
              {selectedWard && (
                <Tag color="blue">
                  Đang xem thống kê phường/xã: {wards.find((w) => w.id === selectedWard)?.name}
                </Tag>
              )}
            </Space>
          </div>

          <Divider />

          <div>
            <Title level={5} style={{ marginBottom: 16 }}>
              Tìm kiếm nâng cao
            </Title>
            <Space size="middle" wrap>
              <Input
                placeholder="Họ và tên"
                style={{ width: 200 }}
                value={searchParams.name}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, name: e.target.value })
                }
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
                <Select.Option value="living">Đang sinh sống</Select.Option>
                <Select.Option value="temp">Tạm trú</Select.Option>
                <Select.Option value="absent">Tạm vắng</Select.Option>
              </Select>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                loading={searchLoading}
              >
                Tìm kiếm
              </Button>
              <Button onClick={handleResetSearch}>Xóa bộ lọc</Button>
            </Space>
          </div>
        </Space>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={5}>Kết quả tìm kiếm ({searchResults.length})</Title>
            <Table
              columns={searchColumns}
              dataSource={searchResults}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng ${total} kết quả`,
              }}
            />
          </div>
        )}
      </Card>

      {/* Statistics Overview */}
      <Title level={4} style={{ marginBottom: 16 }}>
        {selectedWard
          ? `Thống kê - ${wards.find((w) => w.id === selectedWard)?.name}`
          : "Tổng quan thống kê toàn hệ thống"}
      </Title>

      {/* Main Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Tổng dân số"
              value={getPersonTotal()}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Đang sinh sống"
              value={getPersonAlive()}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Nam"
              value={getMaleCount()}
              prefix={<ManOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Nữ"
              value={getFemaleCount()}
              prefix={<WomanOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Age Distribution */}
      <Card title="Phân bố theo độ tuổi" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Statistic
                title="0-18 tuổi"
                value={getAge0To17()}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Statistic
                title="19-60 tuổi"
                value={getAge18To60()}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Statistic
                title="Trên 60 tuổi"
                value={getAgeOver60()}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Household Statistics */}
      <Card title="Thống kê hộ khẩu" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card hoverable>
              <Statistic
                title="Tổng số hộ khẩu"
                value={getHouseholdCount()}
                prefix={<HomeOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable>
              <Statistic
                title="Trung bình người/hộ"
                value={
                  getHouseholdCount() > 0
                    ? (getPersonAlive() / getHouseholdCount()).toFixed(2)
                    : 0
                }
                valueStyle={{ color: "#13c2c2" }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Temporary Status - Only show if ward stats available */}
      {selectedWard && wardStats && (
        <Card title="Tình trạng tạm trú/tạm vắng">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card hoverable>
                <Statistic
                  title="Người tạm trú"
                  value={getTempResidents()}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card hoverable>
                <Statistic
                  title="Người tạm vắng"
                  value={getTempAbsences()}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
}