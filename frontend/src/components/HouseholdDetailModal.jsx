"use client";

import React, { useState, useMemo } from "react";
import { Modal, Table, Tag, Button, Input, Space, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import HouseholdSplitModal from "./HouseholdSplitModal";
import HouseholdMemberManageModal from "./HouseholdMemberManageModal";

import { householdsAPI } from "@/services/householdsAPI";

const HouseholdDetailModal = ({ open, onClose, household, members, refresh, refreshMember }) => {
  const [mode, setMode] = useState(null); // "manage", "split", "changeHead" or null
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState(""); 

  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [splitMembers, setSplitMembers] = useState([]);

  const [manageModalOpen, setManageModalOpen] = useState(false);

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
    mode === "changeHead" || mode === "split"
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
    } else if (mode === "changeHead") {
      try {
        const selectedMembership = members.find(m => m.membershipId === selectedRowKeys[0]);
        
        if (!selectedMembership) {
          message.error("Không tìm thấy thông tin thành viên");
          return;
        }

        await householdsAPI.headChange({
          householdId: household.id,
          toPersonId: selectedMembership.personId,
          changeDate: new Date().toISOString().split('T')[0]
        });
        
        message.success("Đổi chủ hộ thành công!");
        
        // Refresh cache and close
        await refreshMember(household.id);
        setMode(null);
        setSelectedRowKeys([]);
        onClose();
      } catch (error) {
        console.error("Error changing household head:", error);
        message.error(error.message || "Không thể đổi chủ hộ");
      }
    }
  }

  const handleCancel = () => {
    setMode(null);
    setSelectedRowKeys([]);
  }

  const handleAddMember = async (memberData) => {
    await householdsAPI.addMember(household.id, memberData);
  };

  const handleRemoveMember = async (membershipId) => {
    await householdsAPI.removeMember(household.id, membershipId);
  };

  const handleMemberUpdateSuccess = async () => {
    // Refresh cache after member updates
    await refreshMember(household.id);
  };

  const refreshOnSplit = async () => {
    try {
      await refresh();
      await refreshMember(household.id);
    } catch (error) {
      console.error("Error refreshing members after split:", error);
    }
  };

  return (
    <>
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
            <Button onClick={() => setManageModalOpen(true)}>Thay đổi thành viên</Button>
            <Button onClick={() => setMode("split")}>Tách hộ khẩu</Button>
          </div>
        ) : (
          <div className="mt-3 flex justify-end gap-2">
            <Button onClick={handleCancel}>Hủy bỏ</Button>
            <Button onClick={handleConfirm} type="primary">Xác nhận</Button>
          </div>
        )}
      </Modal>

      <HouseholdSplitModal
        open={splitModalOpen}
        onClose={() => { 
          setSplitModalOpen(false); 
          handleCancel(); 
        }}
        household={household}
        selectedMembers={splitMembers}
        refresh={refreshOnSplit}
      />

      <HouseholdMemberManageModal
        open={manageModalOpen}
        onClose={() => {
          setManageModalOpen(false);
        }}
        household={household}
        currentMembers={members}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        onSuccess={handleMemberUpdateSuccess}
      />
    </>
  );
};

export default HouseholdDetailModal;