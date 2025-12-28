"use client";

import React from "react";
import { Modal, Button, Tag, message, DatePicker } from "antd";
import dayjs from "dayjs";

const TemporaryResidenceDetailModal = ({ open, onClose, residence, onEnd, onDelete }) => {
  const [endDate, setEndDate] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const isActive = !residence?.endDate || dayjs(residence.endDate).isAfter(dayjs());

  const handleEnd = async () => {
    if (!endDate) {
      message.error("Vui lòng chọn ngày kết thúc");
      return;
    }

    try {
      setLoading(true);
      await onEnd(residence.id, {
        endDate: endDate.format("YYYY-MM-DD"),
        details: "Đã kết thúc tạm trú"
      });
      message.success("Kết thúc tạm trú thành công!");
      onClose();
    } catch (error) {
      message.error(error.message || "Kết thúc thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa đăng ký tạm trú này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await onDelete(residence.id);
          message.success("Xóa thành công!");
          onClose();
        } catch (error) {
          message.error(error.message || "Xóa thất bại!");
        }
      },
    });
  };

  const ReadOnlyField = ({ label, value }) => (
    <div className="mb-4">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-base font-medium">{value || "—"}</div>
    </div>
  );

  return (
    <Modal
      title="Thông tin tạm trú"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      destroyOnClose
    >
      <div className="mt-4">
        <div className="mb-4">
          <Tag color={isActive ? "blue" : "default"} className="text-sm">
            {isActive ? "Đang tạm trú" : "Đã kết thúc"}
          </Tag>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ReadOnlyField label="Họ và tên" value={residence?.personName} />
          <ReadOnlyField label="Số CCCD" value={residence?.personIdNumber} />
          <ReadOnlyField label="Mã hộ khẩu" value={residence?.currentHouseholdCode} />
          <ReadOnlyField 
            label="Từ ngày" 
            value={residence?.startDate ? dayjs(residence.startDate).format('DD/MM/YYYY') : null} 
          />
          <ReadOnlyField 
            label="Đến ngày" 
            value={residence?.endDate ? dayjs(residence.endDate).format('DD/MM/YYYY') : "Chưa xác định"} 
          />
        </div>

        <ReadOnlyField 
          label="Địa chỉ tạm trú" 
          value={`${residence?.tempAddressDetails}, ${residence?.tempAddressWardName}`} 
        />

        <ReadOnlyField label="Ghi chú" value={residence?.details} />

        {isActive && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold mb-3">Kết thúc tạm trú</h4>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm mb-1">Ngày kết thúc</label>
                <DatePicker
                  className="w-full"
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày kết thúc"
                  value={endDate}
                  onChange={setEndDate}
                  disabledDate={(current) => {
                    return current && current < dayjs(residence?.startDate);
                  }}
                />
              </div>
              <Button 
                type="primary" 
                onClick={handleEnd}
                loading={loading}
              >
                Kết thúc
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button danger onClick={handleDelete}>
            Xóa
          </Button>
          <Button onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TemporaryResidenceDetailModal;