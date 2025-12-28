"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Modal, Table, Tag, Button, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import HouseholdSplitModal from "./HouseholdSplitModal";
import HouseholdMemberManageModal from "./HouseholdMemberManageModal";

import { householdsAPI } from "@/services/householdsAPI";
import { useAuth } from "@/contexts/AuthContext";

const HouseholdDetailModal = ({ open, onClose, household, members, refresh, refreshMember }) => {
  const [mode, setMode] = useState(null); // "manage", "split", "changeHead" or null
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [editNote, setEditNote] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

  const [noteValue, setNoteValue] = useState(household.notes || "");
  const [addressValue, setAddressValue] = useState(household.houseAddressDetails || "");
  const [wardValue, setWardValue] = useState(household.wardName || "");
  const [provinceValue, setProvinceValue] = useState(household.provinceName || "");

  //state for sub-modals
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [splitMembers, setSplitMembers] = useState([]);

  const [manageModalOpen, setManageModalOpen] = useState(false);

  //for utility functions
  const { util } = useAuth();

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (util && util.provincesData.length > 0) {
      setProvinces(util.provincesData.map((p) => ({ id: p.id, name: p.name })));
    }
  }, [util]);

  const handleProvinceChange = (value) => {
    if (!util) return;
    setProvinceValue(value);
    const wards = util.provincesData.find((p) => p.id.toString() === value)?.wards || [];

    setWards(wards);
  };

  const onSubmitAddressChange = async () => {
    try {
      await householdsAPI.addressChange({
        householdId: household.id,
        toAddressDetails: addressValue,
        toAddressWardId: wardValue,
      });
      message.success("Cập nhật địa chỉ thành công!");
      setEditAddress(false);
      await refresh();
    } catch (error) {
      console.error("Error updating address:", error);
      message.error(error.message || "Không thể cập nhật địa chỉ");
    }
  };

  const onSubmitNoteChange = async () => {
    try {
      await householdsAPI.inforChange(household.id, {
        wardId: household.wardId,
        houseAddressDetails: household.houseAddressDetails,
        notes: noteValue,
      });
      message.success("Cập nhật ghi chú thành công!");
      setEditNote(false);
      await refresh();
    } catch (error) {
      console.error("Error updating note:", error);
      message.error(error.message || "Không thể cập nhật ghi chú");
    }
  };

  const handleClose = () => {
    setMode(null);
    setSelectedRowKeys([]);
    setEditAddress(false);
    setEditNote(false);
    onClose();
  }

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
        handleClose();
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
        onCancel={handleClose}
        footer={null}
        width={900}
        centered
        destroyOnHidden={true}
      >
        {/* Household info */}
        <div className="mb-4 space-y-3">
          {/* Code */}
          <p>
            <strong>Mã hộ khẩu:</strong> {household.code}
          </p>

          {/* Address */}
          <div className="relative bg-white">
            <div className="absolute right-2 top-0 flex gap-1">
              {!editAddress ? (
                <button
                  onClick={() => {
                    setAddressValue(household.houseAddressDetails || "");
                    handleProvinceChange(util.provincesData.find((p) => p.name === household.provinceName).id.toString() || "");
                    setWardValue(household.wardId || "");
                    setEditAddress(true);
                  }}
                  className="text-gray-500 hover:text-blue-600 px-4 py-1 border rounded-sm border-blue-600 bg-blue-100 hover:cursor-pointer hover:bg-blue-200"
                >
                  ✎
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setEditAddress(false)}
                    className="text-red-500 hover:text-red-600 px-4 py-1 border rounded-sm border-red-600 bg-red-100 hover:cursor-pointer hover:bg-red-200"
                  >
                    ✕
                  </button>
                  <button
                    onClick={onSubmitAddressChange}
                    className="text-green-600 hover:text-green-700 px-4 py-1 border rounded-sm border-green-600 bg-green-100 hover:cursor-pointer hover:bg-green-200"
                  >
                    ✓
                  </button>
                </>
              )}
            </div>

            <p className="mb-1 font-semibold">Địa chỉ</p>

            {!editAddress ? (
              <p className="text-sm text-gray-700 p-2">
                {household.houseAddressDetails},{" "}
                <span className="mx-1">{household.wardName}</span>
                <span className="mx-1">{household.provinceName}</span>
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  value={addressValue}
                  onChange={(e) => setAddressValue(e.target.value)}
                  className="w-full rounded border px-2 py-1 text-sm"
                  placeholder="Địa chỉ chi tiết"
                />

                <div className="flex gap-2">
                  <select
                    value={wardValue}
                    onChange={(e) => setWardValue(e.target.value)}
                    className="w-1/2 rounded border px-2 py-1 text-sm"
                  >
                    {wards.map((ward) => (
                      <option key={ward.id} value={ward.id}>
                        {ward.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={provinceValue}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-1/2 rounded border px-2 py-1 text-sm"
                  >
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="relative">
            <div className="absolute right-2 top-0 flex gap-1">
              {!editNote ? (
                <button
                  onClick={() => {
                    setNoteValue(household.notes || "");
                    setEditNote(true);
                  }}
                  className="text-gray-500 hover:text-blue-600 px-4 py-1 border rounded-sm border-blue-600 bg-blue-100 hover:cursor-pointer hover:bg-blue-200"
                >
                  ✎
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setNoteValue(household.notes || "");
                      setEditNote(false);
                    }}
                    className="text-red-500 hover:text-red-600 px-4 py-1 border rounded-sm border-red-600 bg-red-100 hover:cursor-pointer hover:bg-red-200"
                  >
                    ✕
                  </button>
                  <button
                    onClick={onSubmitNoteChange}
                    className="text-green-600 hover:text-green-700 px-4 py-1 border rounded-sm border-green-600 bg-green-100 hover:cursor-pointer hover:bg-green-200"
                  >
                    ✓
                  </button>
                </>
              )}
            </div>

            <p className="mb-1 font-semibold">Ghi chú</p>

            {!editNote ? (
              <div className="min-h-[4.5rem] whitespace-pre-wrap text-sm text-gray-700 rounded border bg-white px-2 py-1">
                {household.notes || "—"}
              </div>
            ) : (
              <textarea
                rows={3}
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                className="w-full resize-none rounded border px-2 py-1 text-sm"
                placeholder="Nhập ghi chú..."
              />
            )}
          </div>
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