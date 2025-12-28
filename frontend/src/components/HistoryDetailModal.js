"use client";

import React from "react";
import { Modal, Descriptions, Tag, Divider } from "antd";
import dayjs from "dayjs";

export default function HistoryDetailModal({ visible, onClose, data, type }) {
  if (!data) return null;

  const renderContent = () => {
    switch (type) {
      case "HEAD_CHANGE":
        return (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Mã hộ khẩu">
              {data.householdCode}
            </Descriptions.Item>
            <Descriptions.Item label="Chủ hộ cũ">
              {data.fromPersonName} ({data.fromPersonIdNumber})
            </Descriptions.Item>
            <Descriptions.Item label="Chủ hộ mới">
              {data.toPersonName} ({data.toPersonIdNumber})
            </Descriptions.Item>
            <Descriptions.Item label="Ngày thay đổi">
              {dayjs(data.changeDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do">
              {data.reason || "Không có"}
            </Descriptions.Item>
          </Descriptions>
        );

      case "ADDRESS_CHANGE":
        return (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Mã hộ khẩu">
              {data.householdCode}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ cũ">
              {data.fromAddressWardName}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ mới">
              {data.toAddressWardName}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày thay đổi">
              {dayjs(data.changeDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do">
              {data.reason || "Không có"}
            </Descriptions.Item>
          </Descriptions>
        );

      case "SPLIT":
        return (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Hộ khẩu gốc">
              {data.fromHouseholdCode}
            </Descriptions.Item>
            <Descriptions.Item label="Hộ khẩu mới">
              {data.toHouseholdCode}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tách">
              {dayjs(data.splitDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Số thành viên tách">
              {data.members?.length || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do">
              {data.reason || "Không có"}
            </Descriptions.Item>
          </Descriptions>
        );

      case "BIRTH":
        return (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Họ tên">
              {data.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {dayjs(data.dateOfBirth).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {data.gender === "MALE" ? "Nam" : "Nữ"}
            </Descriptions.Item>
            <Descriptions.Item label="Người khai sinh">
              {data.declarerName} ({data.declarerIdNumber})
            </Descriptions.Item>
            <Descriptions.Item label="Ngày khai">
              {dayjs(data.declareDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Phường/Xã">
              {data.wardName}
            </Descriptions.Item>
          </Descriptions>
        );

      case "DEATH":
        return (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Họ tên">
              {data.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="CCCD/CMND">
              {data.idNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày mất">
              {dayjs(data.dateOfDeath).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Người khai tử">
              {data.declarerName} ({data.declarerIdNumber})
            </Descriptions.Item>
            <Descriptions.Item label="Ngày khai">
              {dayjs(data.declareDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do tử vong">
              {data.deathReason || "Không có"}
            </Descriptions.Item>
          </Descriptions>
        );

      case "TEMP_RESIDENCE":
        return (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Họ tên">
              {data.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="CCCD/CMND">
              {data.idNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Mã hộ tạm trú">
              {data.householdNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Từ ngày">
              {dayjs(data.startDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Đến ngày">
              {data.endDate ? dayjs(data.endDate).format("DD/MM/YYYY") : "Chưa xác định"}
            </Descriptions.Item>
            <Descriptions.Item label="Phường/Xã">
              {data.wardName}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do">
              {data.reason || "Không có"}
            </Descriptions.Item>
          </Descriptions>
        );

      case "TEMP_ABSENCE":
        return (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Họ tên">
              {data.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="CCCD/CMND">
              {data.idNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ thường trú">
              {data.permAddressWardName}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ tạm vắng">
              {data.tempAddressWardName}
            </Descriptions.Item>
            <Descriptions.Item label="Từ ngày">
              {dayjs(data.startDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Đến ngày">
              {data.endDate ? dayjs(data.endDate).format("DD/MM/YYYY") : "Chưa xác định"}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do">
              {data.reason || "Không có"}
            </Descriptions.Item>
          </Descriptions>
        );

      case "PERM_RESIDENCE":
        return (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Họ tên">
              {data.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="CCCD/CMND">
              {data.idNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Mã hộ khẩu">
              {data.householdNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ cũ">
              {data.prevAddressWardName}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ mới">
              {data.addressWardName}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày thay đổi">
              {dayjs(data.changeDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do">
              {data.reason || "Không có"}
            </Descriptions.Item>
          </Descriptions>
        );

      default:
        return <p>Không có thông tin chi tiết</p>;
    }
  };

  const getTitle = () => {
    const titles = {
      HEAD_CHANGE: "Chi tiết Thay đổi Chủ hộ",
      ADDRESS_CHANGE: "Chi tiết Thay đổi Địa chỉ",
      SPLIT: "Chi tiết Tách hộ",
      BIRTH: "Chi tiết Khai sinh",
      DEATH: "Chi tiết Khai tử",
      TEMP_RESIDENCE: "Chi tiết Tạm trú",
      TEMP_ABSENCE: "Chi tiết Tạm vắng",
      PERM_RESIDENCE: "Chi tiết Đổi nơi thường trú",
    };
    return titles[type] || "Chi tiết";
  };

  return (
    <Modal
      title={getTitle()}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {renderContent()}
    </Modal>
  );
}