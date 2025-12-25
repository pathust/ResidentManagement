import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Spin,
  Button,
} from "antd";
import { fundManagementAPI } from "../services/api";

const { TextArea } = Input;

const FUND_TYPE_OPTIONS = [
  { label: "Quỹ bắt buộc", value: "RESTRICTED" },
  { label: "Quỹ không bắt buộc", value: "UNRESTRICTED" },
];
const CURRENCY_OPTIONS = ["VND", "USD"];

export default function FundCreateModal({
  visible,
  onClose,
  onCreated,
  onUpdated,
  onSwitchToEdit,
  onSwitchToView,
  fund, // object when viewing/editing
  fundMode, // "VIEW" | "EDIT"
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);

  const isViewMode = fundMode === "VIEW";
  const isEditMode = fundMode === "EDIT";

  useEffect(() => {
    if (!visible) return;
    if (fund) {
      form.setFieldsValue({
        name: fund.name,
        description: fund.description,
        type: fund.type,
        currency: fund.currency,
        restrictedTo: fund.restrictedTo,
        balance: fund.balance,
      });
    } else {
      form.resetFields();
    }
  }, [visible, fund, form]);

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
        type: values.type || "RESTRICTED",
        currency: values.currency || "VND",
        restrictedTo: values.restrictedTo || "",
        balance: values.balance != null ? Number(values.balance) : 0,
      };

      setLoading(true);

      if (isEditMode && fund?.id) {
        await fundManagementAPI.updateFund(fund.id, payload);
        message.success("Cập nhật quỹ thành công");
        onUpdated && onUpdated();
      } else {
        const created = await fundManagementAPI.createFund(payload);
        message.success("Tạo quỹ thành công");
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
    if (isViewMode) return "Chi tiết quỹ";
    if (isEditMode) return "Cập nhật quỹ";
    return "Tạo quỹ mới";
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
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {isViewMode ? (
              <div>
                <h6>Tên quỹ</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {fund?.name || ""}
                </p>
              </div>
            ) : (
              <Form.Item
                name="name"
                label="Tên quỹ"
                rules={[{ required: true, message: "Vui lòng nhập tên quỹ" }]}
              >
                <Input placeholder="Tên quỹ" disabled={isViewMode} />
              </Form.Item>
            )}

            {isViewMode ? (
              <div>
                <h6>Loại</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {FUND_TYPE_OPTIONS.find((t) => t.value === fund?.type || "")
                    ?.label || ""}
                </p>
              </div>
            ) : (
              <Form.Item name="type" label="Loại">
                <Select placeholder="Chọn loại" disabled={isViewMode}>
                  {FUND_TYPE_OPTIONS.map((t) => (
                    <Select.Option key={t.value} value={t.value}>
                      {t.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {isViewMode ? (
              <div>
                <h6>Tiền tệ</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {fund?.currency || ""}
                </p>
              </div>
            ) : (
              <Form.Item name="currency" label="Tiền tệ">
                <Select placeholder="Chọn tiền tệ" disabled={isViewMode}>
                  {CURRENCY_OPTIONS.map((c) => (
                    <Select.Option key={c} value={c}>
                      {c}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {isViewMode ? (
              <div>
                <h6>Mục đích</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {fund?.restrictedTo || "Chưa có thông tin"}
                </p>
              </div>
            ) : (
              <Form.Item name="restrictedTo" label="Mục đích">
                <Input
                  placeholder="Ví dụ: Bảo vệ môi trường, gây quỹ bão lũ, ..."
                  disabled={isViewMode}
                />
              </Form.Item>
            )}
          </div>

          {isViewMode ? (
            <div>
              <h6>Số dư</h6>
              <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {fund?.balance?.toLocaleString("vi-VN") || 0}
              </p>
            </div>
          ) : (
            <Form.Item name="balance" label="Số dư">
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                disabled={isViewMode}
              />
            </Form.Item>
          )}

          {isViewMode ? (
            <div>
              <h6>Mô tả</h6>
              <p className="h-[76px] px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {fund?.description || "Chưa có mô tả"}
              </p>
            </div>
          ) : (
            <Form.Item name="description" label="Mô tả">
              <TextArea rows={3} disabled={isViewMode} />
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
}
