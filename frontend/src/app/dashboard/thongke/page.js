"use client";

import React from "react";
import { Card, Row, Col, Select, Input, Button, Typography, Space, Statistic } from "antd";
import { SearchOutlined, UserOutlined, TeamOutlined, RiseOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function ThongKePage() {
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
            <Input placeholder="Họ và tên" style={{ width: 200 }} />
            <Select placeholder="Giới tính" style={{ width: 150 }}>
              <Select.Option value="male">Nam</Select.Option>
              <Select.Option value="female">Nữ</Select.Option>
            </Select>
            <Select placeholder="Độ tuổi" style={{ width: 150 }}>
              <Select.Option value="0-18">0-18</Select.Option>
              <Select.Option value="19-60">19-60</Select.Option>
              <Select.Option value="60+">60+</Select.Option>
            </Select>
            <Select placeholder="Trạng thái" style={{ width: 180 }}>
              <Select.Option value="living">Đang sinh sống</Select.Option>
              <Select.Option value="temp">Tạm trú</Select.Option>
              <Select.Option value="absent">Tạm vắng</Select.Option>
            </Select>
            <Button type="primary" icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng dân số"
              value={4567}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nam"
              value={2345}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nữ"
              value={2222}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tăng trưởng"
              value={9.3}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Age Distribution */}
      <Card title="Phân bố theo độ tuổi" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Statistic title="0-18 tuổi" value={1234} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="19-60 tuổi" value={2890} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Trên 60 tuổi" value={443} />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Temporary Status */}
      <Card title="Tình trạng tạm trú/tạm vắng" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card>
              <Statistic title="Người tạm trú" value={89} valueStyle={{ color: "#1890ff" }} />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic title="Người tạm vắng" value={45} valueStyle={{ color: "#faad14" }} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}