import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  message,
  Spin,
  Button,
} from "antd";
import { feeManagementAPI } from "../services/api";

const { TextArea } = Input;

const FREQUENCY_OPTIONS = {
  ONE_TIME: "Một lần",
  MONTHLY: "Hàng tháng",
  YEARLY: "Hàng năm",
};

export default function FeeTypeCreateModal({
  visible,
  onClose,
  onCreated,
  onUpdated,
  onSwitchToEdit,
  onSwitchToView,
  feeType, // data when viewing/editing
  feeTypeMode, // "VIEW" | "EDIT"
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);

  const isViewMode = feeTypeMode === "VIEW";
  const isEditMode = feeTypeMode === "EDIT";

  // Load feeType data into form when provided
  useEffect(() => {
    if (!visible) return;
    if (feeType) {
      form.setFieldsValue({
        name: feeType.name,
        description: feeType.description,
        unit: feeType.unit,
        defaultAmount: feeType.defaultAmount,
        frequency: feeType.frequency,
        isMandatory: feeType.isMandatory,
      });
    } else {
      form.resetFields();
    }
  }, [visible, feeType, form]);

  const handleOk = async () => {
    try {
      if (isViewMode) {
        onSwitchToView && onSwitchToView();
        return;
      }

      const values = await form.validateFields();
      const payload = {
        name: values.name || "",
        description: values.description || "",
        unit: values.unit || "",
        defaultAmount:
          values.defaultAmount != null ? Number(values.defaultAmount) : 0,
        frequency: values.frequency || "",
        isMandatory: values.isMandatory === true,
      };

      setLoading(true);

      if (isEditMode && feeType?.id) {
        await feeManagementAPI.updateFeeType(feeType.id, payload);
        message.success("Cập nhật loại phí thành công");
        onUpdated && onUpdated();
      } else {
        const created = await feeManagementAPI.createFeeType(payload);
        message.success("Tạo loại phí thành công");
        onCreated && onCreated(created);
        form.resetFields();
      }

      onClose && onClose();
    } catch (err) {
      if (err.errorFields) return;
      console.error(err);
      message.error(err.message || "Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose && onClose();
  };

  const getModalTitle = () => {
    if (isViewMode) return "Chi tiết loại phí";
    if (isEditMode) return "Cập nhật loại phí";
    return "Thêm loại phí mới";
  };

  const renderFooter = () => {
    if (loadingMeta) return null;

    if (isViewMode) {
      return [
        <Button key="close" onClick={handleCancel}>
          Đóng
        </Button>,
        <Button
          key="edit"
          type="primary"
          onClick={() => onSwitchToEdit && onSwitchToEdit()}
        >
          Chỉnh sửa
        </Button>,
      ];
    }

    return [
      <Button key="cancel" onClick={handleCancel}>
        Hủy
      </Button>,
      <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
        {isEditMode ? "Lưu thay đổi" : "Tạo mới"}
      </Button>,
    ];
  };

  return (
    <Modal
      title={getModalTitle()}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={renderFooter()}
      destroyOnClose
    >
      {loadingMeta ? (
        <div style={{ textAlign: "center", padding: 30 }}>
          <Spin />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            {isViewMode ? (
              <div>
                <h6>Tên loại phí</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {feeType?.name || ""}
                </p>
              </div>
            ) : (
              <Form.Item
                name="name"
                label="Tên loại phí"
                rules={[
                  { required: true, message: "Vui lòng nhập tên loại phí" },
                ]}
              >
                <Input placeholder="Nhập tên loại phí" disabled={isViewMode} />
              </Form.Item>
            )}

            {isViewMode ? (
              <div>
                <h6>Đơn vị</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {feeType?.unit || ""}
                </p>
              </div>
            ) : (
              <Form.Item name="unit" label="Đơn vị">
                <Input placeholder="Ví dụ: hộ, người" disabled={isViewMode} />
              </Form.Item>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isViewMode ? (
              <div>
                <h6>Số tiền mặc định</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {feeType?.defaultAmount?.toLocaleString("vi-VN") || "0"}
                </p>
              </div>
            ) : (
              <Form.Item name="defaultAmount" label="Số tiền mặc định (VNĐ)">
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  disabled={isViewMode}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Nhập số tiền mặc định"
                />
              </Form.Item>
            )}

            {isViewMode ? (
              <div>
                <h6>Tần suất</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {FREQUENCY_OPTIONS[feeType?.frequency] ||
                    feeType?.frequency ||
                    ""}
                </p>
              </div>
            ) : (
              <Form.Item name="frequency" label="Tần suất">
                <Select placeholder="Chọn tần suất" disabled={isViewMode}>
                  {Object.entries(FREQUENCY_OPTIONS).map(([key, label]) => (
                    <Select.Option key={key} value={key}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>

          {isViewMode ? (
            <div>
              <h6>Mô tả</h6>
              <p className="h-[76px] px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {feeType?.description || "Chưa có mô tả"}
              </p>
            </div>
          ) : (
            <Form.Item name="description" label="Mô tả">
              <TextArea rows={3} disabled={isViewMode} />
            </Form.Item>
          )}

          {isViewMode ? (
            <div>
              <h6>Bắt buộc</h6>
              <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {feeType?.isMandatory ? "Có" : "Không"}
              </p>
            </div>
          ) : (
            <Form.Item name="isMandatory" valuePropName="checked">
              <Checkbox disabled={isViewMode}>Bắt buộc thu</Checkbox>
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
}
