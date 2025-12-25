import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  message,
  Spin,
  Button,
} from "antd";
import dayjs from "dayjs";
import { fundManagementAPI } from "../services/api";

const { TextArea } = Input;

export default function TransferCreateModal({
  visible,
  onClose,
  onCreated,
  onUpdated,
  onSwitchToEdit,
  onSwitchToView,
  transfer, // object when viewing/editing
  transferMode, // "VIEW" | "EDIT"
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [funds, setFunds] = useState([]);

  const isViewMode = transferMode === "VIEW";
  const isEditMode = transferMode === "EDIT";

  useEffect(() => {
    if (!visible) return;
    const loadMeta = async () => {
      setLoadingMeta(true);
      try {
        const f = await fundManagementAPI.getFunds();
        setFunds(Array.isArray(f) ? f : []);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải dữ liệu quỹ");
      } finally {
        setLoadingMeta(false);
      }
    };
    loadMeta();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    if (transfer) {
      form.setFieldsValue({
        sourceFundId: transfer.sourceFundId || transfer.sourceFund?.id || null,
        destFundId: transfer.destFundId || transfer.destFund?.id || null,
        amount: transfer.amount != null ? Number(transfer.amount) : undefined,
        transferDate: transfer.transferDate
          ? dayjs(transfer.transferDate)
          : null,
        reason: transfer.reason || "",
      });
    } else {
      form.resetFields();
    }
  }, [visible, transfer, form]);

  const handleOk = async () => {
    try {
      if (isViewMode) {
        onSwitchToView && onSwitchToView();
        return;
      }

      const values = await form.validateFields();
      const payload = {
        sourceFundId: values.sourceFundId || 0,
        destFundId: values.destFundId || 0,
        amount: values.amount != null ? Number(values.amount) : 0,
        transferDate: values.transferDate
          ? dayjs(values.transferDate).format("YYYY-MM-DD")
          : null,
        reason: values.reason || "",
      };

      setLoading(true);

      if (isEditMode && transfer?.id) {
        await fundManagementAPI.updateTransfer(transfer.id, payload);
        message.success("Cập nhật chuyển quỹ thành công");
        onUpdated && onUpdated();
      } else {
        const created = await fundManagementAPI.createTransfer(payload);
        message.success("Tạo chuyển quỹ thành công");
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
    if (isViewMode) return "Chi tiết chuyển quỹ";
    if (isEditMode) return "Cập nhật chuyển quỹ";
    return "Tạo chuyển quỹ mới";
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
      <Button
        key="cancel"
        onClick={() => {
          if (isEditMode) {
            onSwitchToView && onSwitchToView();
            return;
          } else {
            handleCancel();
          }
        }}
      >
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
                <h6>Quỹ nguồn</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {funds.find(
                    (f) =>
                      f.id ===
                      (transfer?.sourceFundId || transfer?.sourceFund?.id)
                  )?.name || "-"}
                </p>
              </div>
            ) : (
              <Form.Item
                name="sourceFundId"
                label="Quỹ nguồn"
                rules={[{ required: true, message: "Chọn quỹ nguồn" }]}
              >
                <Select
                  placeholder="Chọn quỹ nguồn"
                  disabled={isViewMode}
                  allowClear
                >
                  {funds.map((f) => (
                    <Select.Option key={f.id} value={f.id}>
                      {f.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {isViewMode ? (
              <div>
                <h6>Quỹ đích</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {funds.find(
                    (f) =>
                      f.id === (transfer?.destFundId || transfer?.destFund?.id)
                  )?.name || "-"}
                </p>
              </div>
            ) : (
              <Form.Item
                name="destFundId"
                label="Quỹ đích"
                rules={[{ required: true, message: "Chọn quỹ đích" }]}
              >
                <Select
                  placeholder="Chọn quỹ đích"
                  disabled={isViewMode}
                  allowClear
                >
                  {funds.map((f) => (
                    <Select.Option key={f.id} value={f.id}>
                      {f.name}
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
                <h6>Số tiền</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {transfer?.amount?.toLocaleString("vi-VN") || 0}
                </p>
              </div>
            ) : (
              <Form.Item
                name="amount"
                label="Số tiền"
                rules={[{ required: true, message: "Nhập số tiền" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  disabled={isViewMode}
                  placeholder="Nhập số tiền"
                />
              </Form.Item>
            )}

            {isViewMode ? (
              <div>
                <h6>Ngày chuyển</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {transfer?.transferDate || "-"}
                </p>
              </div>
            ) : (
              <Form.Item
                name="transferDate"
                label="Ngày chuyển"
                rules={[{ required: true, message: "Chọn ngày chuyển" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  disabled={isViewMode}
                  placeholder="Chọn ngày chuyển"
                />
              </Form.Item>
            )}
          </div>

          {isViewMode ? (
            <div>
              <h6>Lý do</h6>
              <p className="h-[76px] px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {transfer?.reason || "-"}
              </p>
            </div>
          ) : (
            <Form.Item name="reason" label="Lý do">
              <TextArea
                rows={3}
                disabled={isViewMode}
                placeholder="Nhập lý do chuyển quỹ ..."
              />
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
}
