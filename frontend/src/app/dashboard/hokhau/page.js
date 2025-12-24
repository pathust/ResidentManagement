"use client";

import React from "react";
import { Button, Table, Space, Typography, Tag, message } from "antd";
import { PlusOutlined, EditOutlined, ScissorOutlined } from "@ant-design/icons";

import { householdsAPI } from "@/services/householdsAPI";
import HouseholdDetailModal from "@/components/HouseholdDetailModal";
import HouseholdAddModal from "@/components/HouseholdAddModal";

const { Title } = Typography;

export default function HoKhauPage() {
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [currentHousehold, setCurrentHousehold] = React.useState(0);

  const [householdData, setHouseholdData] = React.useState([]);
  const [memberCache, setMemberCache] = React.useState({}); // map: { householdId → members[] }

  const [isAddOpen, setIsAddOpen] = React.useState(false);

  React.useEffect(() => {
    fetchHouseholdList();
  }, []);

  const fetchHouseholdList = async () => {
    try {
      const data = await householdsAPI.getAll();
      setHouseholdData(data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách hộ khẩu");
    }
  };

  const fetchMembersByHousehold = async (householdId) => {
    try {
      const members = await householdsAPI.getMembers(householdId);

      setMemberCache((prev) => ({
        ...prev,
        [householdId]: members,
      }));

      return members;
    } catch (error) {
      console.error(error);
      message.error("Không thể tải thông tin thành viên hộ khẩu");
      return [];
    }
  };

  const refreshMemberCache = async (householdId) => {
    console.log("Refreshing cache for household:", householdId);
    
    // Clear old cache
    setMemberCache((prev) => {
      const updated = { ...prev };
      delete updated[householdId];
      return updated;
    });

    // Fetch fresh data
    await fetchMembersByHousehold(householdId);
  };

  const onAddNewHousehold = async (values) => {
    try {
      await householdsAPI.addOne(values);
      await fetchHouseholdList();
    } catch (error) {
      throw new Error(error.message || "Không thể thêm hộ khẩu mới");
    }
  };

  const columns = [
    {
      title: "Mã hộ khẩu",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Địa chỉ",
      key: "address",
      render: (_, record) =>
        `${record.houseAddressDetails}, ${record.wardName}, ${record.provinceName}`,
    },
    {
      title: "Số thành viên",
      dataIndex: "memberCount",
      key: "memberCount",
      width: 120,
      align: "center",
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
            onClick={async () => {
              setCurrentHousehold(index);

              // preload members
              await fetchMembersByHousehold(record.id);

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
          Danh sách Hộ khẩu
        </Title>

        <Space>
          <Button
            icon={<PlusOutlined />} type="primary"
            onClick={() => setIsAddOpen(true)}
          >
            Thêm hộ khẩu
          </Button>
          <Button icon={<EditOutlined />}>Sửa hộ khẩu</Button>
          <Button icon={<ScissorOutlined />}>Tách hộ khẩu</Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={householdData}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} hộ khẩu`,
        }}
      />

      {/* Modal chi tiết */}
      <HouseholdDetailModal
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        household={householdData[currentHousehold] || {}}
        members={memberCache[householdData[currentHousehold]?.id] || []}
        refresh={refreshMemberCache}
      />

      {/* Modal thêm hộ khẩu */}
      <HouseholdAddModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={onAddNewHousehold}
      />
    </div>
  );
}