"use client";

import React from "react";
import { Modal, Table, Tag } from "antd";

const HouseholdDetailModal = ({ open, onClose, household, members }) => {
  const memberColumns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
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
      width: 120,
      render: (_, r) =>
        r.isHouseholdHead ? (
          <Tag color="green">Chủ hộ</Tag>
        ) : (
          r.relationToHead || "-"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "blue" : "orange"}>{status}</Tag>
      ),
    },
  ];

  return (
    <Modal
      title="Thông tin hộ khẩu"
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnHidden={true}
    >
      <div className="mb-4">
        <p><strong>Mã hộ khẩu:</strong> {household.code}</p>
        <p>
          <strong>Địa chỉ:</strong>{" "}
          {household.houseAddressDetails}, {household.wardName},{" "}
          {household.provinceName}
        </p>
        <p><strong>Ghi chú:</strong> {household.notes || "—"}</p>
      </div>

      <h3 className="font-semibold text-lg mb-3">Danh sách thành viên</h3>

      <Table
        columns={memberColumns}
        dataSource={members}
        rowKey="membershipId"
        pagination={false}
        size="small"
      />
    </Modal>
  );
};

export default HouseholdDetailModal;
