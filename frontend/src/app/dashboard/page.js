"use client";

import React from "react";
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
  message 
} from "antd";
import { 
  SearchOutlined, 
  UserOutlined, 
  TeamOutlined, 
  RiseOutlined,
  HomeOutlined,
  ManOutlined,
  WomanOutlined
} from "@ant-design/icons";

const { Title } = Typography;

export default function DashboardPage() {
  const [searchParams, setSearchParams] = React.useState({
    name: "",
    gender: undefined,
    ageGroup: undefined,
    status: undefined
  });
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Mock statistics data
  const statsData = {
    totalPopulation: 4567,
    male: 2345,
    female: 2222,
    growthRate: 9.3,
    age0to18: 1234,
    age19to60: 2890,
    ageOver60: 443,
    tempResidents: 89,
    tempAbsent: 45,
    totalHouseholds: 1234
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // TODO: Call API with searchParams
      // const results = await personAPI.search(searchParams);
      // setSearchResults(results);
      
      // Mock data for now
      setTimeout(() => {
        setSearchResults([
          {
            id: 1,
            fullName: "Nguyễn Văn A",
            idNumber: "001234567890",
            gender: "M",
            dateOfBirth: "1990-01-01",
            address: "123 Nguyễn Huệ, Phường 1",
            status: "ALIVE"
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error(error);
      message.error("Không thể tìm kiếm");
      setLoading(false);
    }
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
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={status === "ALIVE" ? "green" : "orange"}>
          {status === "ALIVE" ? "Đang sinh sống" : "Khác"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: () => (
        <Button type="link" size="small">
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Thống kê & Tìm kiếm
      </Title>

      {/* Search Panel */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Title level={5}>Tìm kiếm nâng cao</Title>
          <Space size="middle" wrap>
            <Input 
              placeholder="Họ và tên" 
              style={{ width: 200 }}
              value={searchParams.name}
              onChange={(e) => setSearchParams({...searchParams, name: e.target.value})}
            />
            <Select 
              placeholder="Giới tính" 
              style={{ width: 150 }}
              value={searchParams.gender}
              onChange={(value) => setSearchParams({...searchParams, gender: value})}
              allowClear
            >
              <Select.Option value="M">Nam</Select.Option>
              <Select.Option value="F">Nữ</Select.Option>
            </Select>
            <Select 
              placeholder="Độ tuổi" 
              style={{ width: 150 }}
              value={searchParams.ageGroup}
              onChange={(value) => setSearchParams({...searchParams, ageGroup: value})}
              allowClear
            >
              <Select.Option value="0-18">0-18</Select.Option>
              <Select.Option value="19-60">19-60</Select.Option>
              <Select.Option value="60+">60+</Select.Option>
            </Select>
            <Select 
              placeholder="Trạng thái" 
              style={{ width: 180 }}
              value={searchParams.status}
              onChange={(value) => setSearchParams({...searchParams, status: value})}
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
              loading={loading}
            >
              Tìm kiếm
            </Button>
          </Space>
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
      <Title level={4} style={{ marginBottom: 16 }}>Tổng quan thống kê</Title>
      
      {/* Main Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Tổng dân số"
              value={statsData.totalPopulation}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Nam"
              value={statsData.male}
              prefix={<ManOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Nữ"
              value={statsData.female}
              prefix={<WomanOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Tăng trưởng"
              value={statsData.growthRate}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: "#cf1322" }}
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
                value={statsData.age0to18}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Statistic 
                title="19-60 tuổi" 
                value={statsData.age19to60}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Statistic 
                title="Trên 60 tuổi" 
                value={statsData.ageOver60}
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
                value={statsData.totalHouseholds}
                prefix={<HomeOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable>
              <Statistic 
                title="Trung bình người/hộ" 
                value={(statsData.totalPopulation / statsData.totalHouseholds).toFixed(2)}
                valueStyle={{ color: "#13c2c2" }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Temporary Status */}
      <Card title="Tình trạng tạm trú/tạm vắng">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card hoverable>
              <Statistic 
                title="Người tạm trú" 
                value={statsData.tempResidents} 
                valueStyle={{ color: "#1890ff" }} 
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable>
              <Statistic 
                title="Người tạm vắng" 
                value={statsData.tempAbsent} 
                valueStyle={{ color: "#faad14" }} 
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}