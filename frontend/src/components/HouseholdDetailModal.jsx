"use client";

import React, { useState, useMemo } from "react";
import { Modal, Table, Tag, Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import HouseholdSplitModal from "./HouseholdSplitModal";

import { householdsAPI } from "@/services/householdsAPI";

const HouseholdDetailModal = ({ open, onClose, household, members, refresh }) => {
  const [mode, setMode] = useState(null); // "remove", "split", "changeHead" or null
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState(""); 

  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [splitMembers, setSplitMembers] = useState([]);

  const filteredMembers = useMemo(() => {
    if (!searchText) return members;
    return members.filter((m) =>
      m.fullName.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, members]);

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 120,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 90,
    },
    {
      title: "Số CCCD",
      dataIndex: "idNumber",
      key: "idNumber",
      width: 140,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 140,
    },
    {
      title: "Vai trò",
      key: "isHouseholdHead",
      width: 100,
      render: (_, r) => (r.isHouseholdHead ? "Chủ hộ" : r.relationToHead || "-"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "blue" : "orange"}>{status}</Tag>
      ),
    },
  ];

  const rowSelection =
    mode !== null
      ? {
          type: mode === "changeHead" ? "radio" : "checkbox",
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }
      : undefined;
  
  const handleConfirm = async () => {
    console.log("Confirmed action:", mode, "on members:", selectedRowKeys);

    if (mode === "split") {
      const membersToSplit = members.filter((m) =>
        selectedRowKeys.includes(m.membershipId)
      );
      setSplitMembers(membersToSplit);
      setSplitModalOpen(true);
    } else if (mode === "remove") {
      // Implement remove logic here
    } else if (mode === "changeHead") {
      try {
        const newHeadId = selectedRowKeys[0];
        await householdsAPI.headChange(household.id, newHeadId);
        refresh(household.id);
        setMode(null);
        setSelectedRowKeys([]);
        onClose();
      }
      catch (error) {
        console.error("Error changing household head:", error);
      }
    }
  }

  const handleCancel = () => {
    setMode(null);
    setSelectedRowKeys([]);
  }

  return (
    <Modal
      title="Thông tin hộ khẩu"
      open={open}
      onCancel={() => {
        setMode(null);
        setSelectedRowKeys([]);
        onClose();
      }}
      footer={null}
      width={900}
      centered
      destroyOnHidden={true}
    >
      {/* Household info */}
      <div className="mb-4">
        <p><strong>Mã hộ khẩu:</strong> {household.code}</p>
        <p>
          <strong>Địa chỉ:</strong> {household.houseAddressDetails}, {" "}
          {household.wardName}, {household.provinceName}
        </p>
        <p><strong>Ghi chú:</strong> {household.notes || "—"}</p>
      </div>

      {/* Search bar */}
      <Input
        placeholder="Tìm kiếm theo tên..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-3"
      />

      <Table
        columns={columns}
        dataSource={filteredMembers}
        rowKey="membershipId"
        pagination={false}
        size="small"
        scroll={{ y: 250, x: undefined }}
        rowSelection={rowSelection}
      />

      {/* Action bar */}
      {mode === null ? (
        <div className="mt-3 flex justify-end gap-2">
          <Button onClick={() => setMode("changeHead")}>Đổi chủ hộ</Button>
          <Button onClick={() => setMode("remove")}>Thay đổi thành viên</Button>
          <Button onClick={() => setMode("split")}>Tách hộ khẩu</Button>
        </div>
      ) : (
        <div className="mt-3 flex justify-end gap-2">
          <Button onClick={handleCancel}>Hủy bỏ</Button>
          <Button onClick={handleConfirm} type="primary">Xác nhận</Button>
        </div>
      )}

      <HouseholdSplitModal
        open={splitModalOpen}
        onClose={() => { setSplitModalOpen(false); handleCancel(); }}
        household={household}
        selectedMembers={splitMembers}
      />
    </Modal>
  );
};

export default HouseholdDetailModal;