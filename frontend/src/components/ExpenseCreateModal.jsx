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
import { fundManagementAPI, userManagementAPI } from "../services/api";

const { TextArea } = Input;

const STATUS_OPTIONS = [
  { label: "Đã duyệt", value: "APPROVED" },
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã hủy", value: "REJECTED" },
];
export default function ExpenseCreateModal({
  visible,
  onClose,
  onCreated,
  onUpdated,
  onSwitchToEdit,
  onSwitchToView,
  expense, // object when viewing/editing
  expenseMode, // "VIEW" | "EDIT"
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [funds, setFunds] = useState([]);
  const [approverUsers, setApproverUsers] = useState([]);

  const isViewMode = expenseMode === "VIEW";
  const isEditMode = expenseMode === "EDIT";

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

    const loadApproverUsers = async () => {
      try {
        const _approverUsers = await userManagementAPI.getUsers({
          page: 0,
          size: 1000,
          sort: "id",
          roleId: 3,
        });
        setApproverUsers(_approverUsers?.content || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadMeta();
    loadApproverUsers();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    if (expense) {
      form.setFieldsValue({
        fundId: expense.fundId || expense.fund?.id || null,
        expenseDate: expense.expenseDate ? dayjs(expense.expenseDate) : null,
        amount: expense.amount != null ? Number(expense.amount) : undefined,
        description: expense.description || "",
        approverUserId:
          expense.approverUserId != null
            ? Number(expense.approverUserId)
            : undefined,
        recipient: expense.recipient || "",
        proof: expense.proof || "",
        status: expense.status || "",
        notes: expense.notes || "",
      });
    } else {
      form.resetFields();
    }
  }, [visible, expense, form]);

  const handleOk = async () => {
    try {
      if (isViewMode) {
        onSwitchToView && onSwitchToView();
        return;
      }

      const values = await form.validateFields();
      const payload = {
        fundId: values.fundId || 0,
        expenseDate: values.expenseDate
          ? dayjs(values.expenseDate).format("YYYY-MM-DD")
          : null,
        amount: values.amount != null ? Number(values.amount) : 0,
        description: values.description || "",
        approverUserId:
          values.approverUserId != null ? Number(values.approverUserId) : null,
        recipient: values.recipient || "",
        proof: values.proof || "",
        status: values.status || "PENDING",
        notes: values.notes || "",
      };

      setLoading(true);

      if (isEditMode && expense?.id) {
        await fundManagementAPI.updateExpense(expense.id, payload);
        message.success("Cập nhật phiếu chi thành công");
        onUpdated && onUpdated();
      } else {
        const created = await fundManagementAPI.createExpense(payload);
        message.success("Tạo phiếu chi thành công");
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
    if (isViewMode) return "Chi tiết phiếu chi";
    if (isEditMode) return "Cập nhật phiếu chi";
    return "Tạo phiếu chi mới";
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
          {isViewMode ? (
            <div>
              <h6>Quỹ</h6>
              <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {funds.find(
                  (f) => f.id === (expense?.fundId || expense?.fund?.id)
                )?.name || "-"}
              </p>
            </div>
          ) : (
            <Form.Item
              name="fundId"
              label="Quỹ"
              rules={[{ required: true, message: "Chọn quỹ" }]}
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

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {isViewMode ? (
              <div>
                <h6>Ngày chi</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {expense?.expenseDate || "-"}
                </p>
              </div>
            ) : (
              <Form.Item
                name="expenseDate"
                label="Ngày chi"
                rules={[{ required: true, message: "Chọn ngày chi" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  disabled={isViewMode}
                  placeholder="Chọn ngày chi"
                />
              </Form.Item>
            )}

            {isViewMode ? (
              <div>
                <h6>Số tiền</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {expense?.amount?.toLocaleString("vi-VN") || 0}
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
          </div>

          {isViewMode ? (
            <div>
              <h6>Người nhận</h6>
              <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {expense?.recipient || "-"}
              </p>
            </div>
          ) : (
            <Form.Item name="recipient" label="Người nhận">
              <Input disabled={isViewMode} />
            </Form.Item>
          )}

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {isViewMode ? (
              <div>
                <h6>Người duyệt</h6>

                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {approverUsers.find((a) => a.id === expense?.approverUserId)
                    ?.username || "Chưa có thông tin "}
                </p>
              </div>
            ) : (
              <Form.Item name="approverUserId" label="Người duyệt">
                <Select placeholder="Chọn người xác thực" disabled={isViewMode}>
                  {approverUsers.map((a) => (
                    <Select.Option key={a.id} value={a.id}>
                      {a.username || `#${a.id}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {isViewMode ? (
              <div>
                <h6>Tình trạng</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {STATUS_OPTIONS.find((s) => s.value === expense?.status)
                    ?.label || "—"}
                </p>
              </div>
            ) : (
              <Form.Item name="status" label="Tình trạng">
                <Select
                  disabled={isViewMode}
                  allowClear
                  placeholder="Chọn tình trạng"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <Select.Option key={s.value} value={s.value}>
                      {s.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>

          {isViewMode ? (
            <div>
              <h6>Chứng từ</h6>
              <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {expense?.proof || "-"}
              </p>
            </div>
          ) : (
            <Form.Item name="proof" label="Chứng từ">
              <Input disabled={isViewMode} />
            </Form.Item>
          )}

          {isViewMode ? (
            <div>
              <h6>Ghi chú</h6>
              <p className="h-[76px] px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {expense?.description || "-"}
              </p>
            </div>
          ) : (
            <Form.Item name="description" label="Ghi chú">
              <TextArea rows={3} disabled={isViewMode} />
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
}
