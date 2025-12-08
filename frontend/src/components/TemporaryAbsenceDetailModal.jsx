"use client";

import React from "react";
import { Modal, Button, Tag, message, DatePicker } from "antd";
import dayjs from "dayjs";

const TemporaryAbsenceDetailModal = ({ open, onClose, absence, onEnd, onDelete }) => {
  const [endDate, setEndDate] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const isActive = !absence?.endDate || dayjs(absence.endDate).isAfter(dayjs());

  const handleEnd = async () => {
    if (!endDate) {
      message.error("Vui lòng chọn ngày kết thúc");
      return;
    }

    try {
      setLoading(true);
      await onEnd(absence.id, {
        endDate: endDate.format("YYYY-MM-DD"),
        reason: "Đã trở về",
        destination: absence.destination,
        permAddressDetails: absence.permAddressDetails,
        tempAddressDetails: absence.tempAddressDetails,
        tempAddressWardId: absence.tempAddressWardId
      });
      message.success("Kết thúc tạm vắng thành công!");
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
      content: "Bạn có chắc chắn muốn xóa đăng ký tạm vắng này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await onDelete(absence.id);
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
      title="Thông tin tạm vắng"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      destroyOnClose
    >
      <div className="mt-4">
        <div className="mb-4">
          <Tag color={isActive ? "orange" : "default"} className="text-sm">
            {isActive ? "Đang tạm vắng" : "Đã trở về"}
          </Tag>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ReadOnlyField label="Họ và tên" value={absence?.personName} />
          <ReadOnlyField label="Số CCCD" value={absence?.personIdNumber} />
          <ReadOnlyField label="Mã hộ khẩu" value={absence?.householdCode} />
          <ReadOnlyField 
            label="Từ ngày" 
            value={absence?.startDate ? dayjs(absence.startDate).format('DD/MM/YYYY') : null} 
          />
          <ReadOnlyField 
            label="Đến ngày" 
            value={absence?.endDate ? dayjs(absence.endDate).format('DD/MM/YYYY') : "Chưa xác định"} 
          />
          <ReadOnlyField label="Nơi đến" value={absence?.destination} />
          <ReadOnlyField label="Lý do" value={absence?.reason} />
        </div>

        <ReadOnlyField 
          label="Địa chỉ thường trú" 
          value={absence?.permAddressDetails && absence?.permAddressWardName 
            ? `${absence.permAddressDetails}, ${absence.permAddressWardName}`
            : "—"
          } 
        />

        <ReadOnlyField 
          label="Địa chỉ tạm vắng" 
          value={absence?.tempAddressDetails && absence?.tempAddressWardName
            ? `${absence.tempAddressDetails}, ${absence.tempAddressWardName}`
            : "—"
          } 
        />

        {isActive && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold mb-3">Kết thúc tạm vắng</h4>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm mb-1">Ngày trở về</label>
                <DatePicker
                  className="w-full"
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày trở về"
                  value={endDate}
                  onChange={setEndDate}
                  disabledDate={(current) => {
                    return current && current < dayjs(absence?.startDate);
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

export default TemporaryAbsenceDetailModal;