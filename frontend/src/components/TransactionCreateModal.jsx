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

const TYPE_OPTIONS = [
  { label: "Thu phí", value: "PAYMENT" },
  { label: "Chi tiêu", value: "EXPENSE" },
  { label: "Chuyển quỹ", value: "TRANSFER" },
  { label: "Phát thưởng", value: "REWARD" },
];

const TRANSACTION_TYPE_OPTIONS = [
  { label: "Thu ", value: "INFLOW" },
  { label: "Chuyển đến", value: "TRANSFER_IN" },
  { label: "Chi ", value: "OUTFLOW" },
  { label: "Chuyển đi", value: "TRANSFER_OUT" },
];
export default function TransactionCreateModal({
  visible,
  onClose,
  onCreated,
  onUpdated,
  onSwitchToEdit,
  onSwitchToView,
  transaction, // object when viewing/editing
  transactionMode, // "VIEW" | "EDIT"
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [funds, setFunds] = useState([]);

  const isViewMode = transactionMode === "VIEW";
  const isEditMode = transactionMode === "EDIT";

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
    if (transaction) {
      form.setFieldsValue({
        fundId: transaction.fundId || transaction.fund?.id || null,
        amount:
          transaction.amount != null ? Number(transaction.amount) : undefined,
        transactionDate: transaction.transactionDate
          ? dayjs(transaction.transactionDate)
          : null,
        referenceType: transaction.referenceType || "DEPOSIT",
        transactionType: transaction.transactionType || "INFLOW",
        notes: transaction.notes || "",
      });
    } else {
      form.resetFields();
    }
  }, [visible, transaction, form]);

  const handleOk = async () => {
    try {
      if (isViewMode) {
        onSwitchToView && onSwitchToView();
        return;
      }

      const values = await form.validateFields();
      const payload = {
        fundId: values.fundId || null,
        amount: values.amount != null ? Number(values.amount) : 0,
        transactionDate: values.transactionDate
          ? dayjs(values.transactionDate).format("YYYY-MM-DD")
          : null,
        referenceType: values.referenceType || "DEPOSIT",
        transactionType: values.transactionType || "INFLOW",
        notes: values.notes || "",
      };

      setLoading(true);

      if (isEditMode && transaction?.id) {
        await fundManagementAPI.updateTransaction(transaction.id, payload);
        message.success("Cập nhật giao dịch thành công");
        onUpdated && onUpdated();
      } else {
        const created = await fundManagementAPI.createTransaction(payload);
        message.success("Tạo giao dịch thành công");
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
    if (isViewMode) return "Chi tiết giao dịch";
    if (isEditMode) return "Cập nhật giao dịch";
    return "Tạo giao dịch mới";
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
  console.log("OK", transaction);
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
                <h6>Quỹ</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {funds.find(
                    (f) =>
                      f.id === (transaction?.fundId || transaction?.fund?.id)
                  )?.name || "-"}
                </p>
              </div>
            ) : (
              <Form.Item
                name="fundId"
                label="Quỹ"
                rules={[{ required: true, message: "Vui lòng nhập quỹ" }]}
              >
                <Select placeholder="Chọn quỹ" disabled={isViewMode} allowClear>
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
                <h6>Số tiền</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {transaction?.amount?.toLocaleString("vi-VN") || 0}
                </p>
              </div>
            ) : (
              <Form.Item
                name="amount"
                label="Số tiền"
                rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  disabled={isViewMode}
                  placeholder="Nhập số tiền"
                />
              </Form.Item>
            )}
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {isViewMode ? (
              <div>
                <h6>Mục</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {
                    TYPE_OPTIONS.find(
                      (opt) => opt.value === transaction?.referenceType
                    )?.label
                  }
                </p>
              </div>
            ) : (
              <Form.Item name="referenceType" label="Mục">
                <Select disabled={isViewMode} placeholder="Chọn mục giao dịch">
                  {TYPE_OPTIONS.map((opt) => (
                    <Select.Option value={opt.value}>{opt.label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {isViewMode ? (
              <div>
                <h6>Loại giao dịch</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {
                    TRANSACTION_TYPE_OPTIONS.find(
                      (opt) => opt.value === transaction?.transactionType
                    )?.label
                  }
                </p>
              </div>
            ) : (
              <Form.Item
                name="transactionType"
                label="Loại giao dịch"
                rules={[
                  { required: true, message: "Vui lòng chọn loại giao dịch" },
                ]}
              >
                <Select disabled={isViewMode} placeholder="Chọn loại giao dịch">
                  {TRANSACTION_TYPE_OPTIONS.map((opt) => (
                    <Select.Option value={opt.value}>{opt.label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>

          {isViewMode ? (
            <div>
              <h6>Ngày giao dịch</h6>
              <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {transaction?.transactionDate || "-"}
              </p>
            </div>
          ) : (
            <Form.Item
              name="transactionDate"
              label="Ngày giao dịch"
              rules={[
                { required: true, message: "Vui lòng chọn ngày giao dịch" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabled={isViewMode}
                placeholder="Chọn ngày giao dịch"
              />
            </Form.Item>
          )}

          {isViewMode ? (
            <div>
              <h6>Ghi chú</h6>
              <p className="h-[76px] px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {transaction?.notes || "-"}
              </p>
            </div>
          ) : (
            <Form.Item name="notes" label="Ghi chú">
              <TextArea
                rows={3}
                disabled={isViewMode}
                placeholder="Nhập ghi chú ..."
              />
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
}
