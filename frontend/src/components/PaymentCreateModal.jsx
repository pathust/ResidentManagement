import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  message,
  Spin,
  Button,
} from "antd";
import dayjs from "dayjs";
import {
  feeManagementAPI,
  fundManagementAPI,
  personAPI,
} from "../services/api";
import { householdsAPI } from "../services/householdsAPI";

const { TextArea } = Input;

const STATUS_LABELS = {
  PENDING: "Chưa nộp",
  PARTIAL: "Đã đóng một phần",
  COMPLETED: "Đã đóng",
};

export default function PaymentCreateModal({
  visible,
  onClose,
  onCreated,
  onUpdated,
  onSwitchToEdit,
  onSwitchToView,
  payment, // data when viewing/editing
  paymentMode, // "VIEW" | "EDIT"
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [events, setEvents] = useState([]);
  const [funds, setFunds] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [persons, setPersons] = useState([]);

  const isViewMode = paymentMode === "VIEW";
  const isEditMode = paymentMode === "EDIT";

  useEffect(() => {
    if (!visible) return;
    setLoadingMeta(true);
    Promise.all([
      feeManagementAPI.getEvents(),
      fundManagementAPI.getFunds(),
      householdsAPI.getAll(),
      personAPI.getAll(),
    ])
      .then(([evt, f, hh, ps]) => {
        setEvents(evt || []);
        setFunds(f || []);
        setHouseholds(hh || []);
        setPersons(ps || []);
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể tải dữ liệu phụ trợ");
      })
      .finally(() => setLoadingMeta(false));
  }, [visible]);

  // Load payment data into form when provided
  useEffect(() => {
    if (!visible) return;
    if (payment) {
      form.setFieldsValue({
        collectionEventId: payment.collectionEventId,
        householdId: payment.householdId,
        personId: payment.personId,
        expectedAmount: payment.expectedAmount,
        amountPaid: payment.amountPaid,
        paymentDate: payment.paymentDate ? dayjs(payment.paymentDate) : null,
        method: payment.method,
        status: payment.status,
        notes: payment.notes,
        fundId: payment.fundId,
      });
    } else {
      form.resetFields();
    }
  }, [visible, payment, form]);

  const handleOk = async () => {
    try {
      if (isViewMode) {
        onSwitchToView && onSwitchToView();
        return;
      }

      const values = await form.validateFields();
      const payload = {
        collectionEventId: Number(values.collectionEventId),
        householdId:
          values.householdId != null ? Number(values.householdId) : 0,
        personId: values.personId != null ? Number(values.personId) : 0,
        expectedAmount:
          values.expectedAmount != null ? Number(values.expectedAmount) : 0,
        amountPaid: values.amountPaid != null ? Number(values.amountPaid) : 0,
        paymentDate: values.paymentDate
          ? dayjs(values.paymentDate).format("YYYY-MM-DD")
          : null,
        method: values.method || "",
        status: values.status || "",
        notes: values.notes || "",
        fundId: values.fundId != null ? Number(values.fundId) : 0,
      };

      setLoading(true);

      if (isEditMode && payment?.id) {
        await feeManagementAPI.updatePayment(payment.id, payload);
        message.success("Cập nhật giao dịch thành công");
        onUpdated && onUpdated();
      } else {
        const created = await feeManagementAPI.createPayment(payload);
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
    return "Ghi nhận thanh toán";
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
  console.log("OK", households, payment);
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
            {isViewMode || isEditMode ? (
              <div>
                <h6 className={`${isEditMode && "font-normal!"}`}>Đợt thu</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {events.find((e) => e.id === payment?.collectionEventId)
                    ?.feeTypeName || ""}{" "}
                  {payment?.eventDate ? `— ${payment?.paymentDate || ""}` : ""}
                </p>
              </div>
            ) : (
              <Form.Item
                name="collectionEventId"
                label="Đợt thu"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn đợt thu" disabled={isViewMode}>
                  {events.map((e) => (
                    <Select.Option key={e.id} value={e.id}>
                      {e.feeTypeName
                        ? `${e.feeTypeName} — ${e.eventDate}`
                        : `#${e.id} — ${e.eventDate}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {isViewMode || isEditMode ? (
              <div>
                <h6 className={`${isEditMode && "font-normal!"}`}>Mã hộ</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {households.find((h) => h.id === payment?.householdId)
                    ?.code || ""}
                </p>
              </div>
            ) : (
              <Form.Item name="householdId" label="Mã hộ">
                <Select placeholder="Chọn hộ" allowClear disabled={isViewMode}>
                  {households.map((h) => (
                    <Select.Option key={h.id} value={h.id}>
                      {h.code || `#${h.id}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isViewMode || isEditMode ? (
              <div>
                <h6 className={`${isEditMode && "font-normal!"}`}>Người nộp</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {persons.find((p) => p.id === payment?.personId)?.fullName ||
                    "Chưa có thông tin"}
                </p>
              </div>
            ) : (
              <Form.Item name="personId" label="Người nộp">
                <Select
                  placeholder="Chọn người"
                  allowClear
                  disabled={isViewMode}
                >
                  {persons.map((p) => (
                    <Select.Option key={p.id} value={p.id}>
                      {p.fullName ||
                        `${p.firstName || ""} ${p.lastName || ""}`.trim() ||
                        `#${p.id}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {isViewMode || isEditMode ? (
              <div>
                <h6 className={`${isEditMode && "font-normal!"}`}>
                  Số tiền dự kiến
                </h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {payment?.expectedAmount?.toLocaleString("vi-VN") || ""}
                </p>
              </div>
            ) : (
              <Form.Item name="expectedAmount" label="Số tiền dự kiến">
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  disabled={isViewMode || isEditMode}
                  placeholder="Nhập số tiền dự kiến"
                />
              </Form.Item>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isViewMode ? (
              <div>
                <h6>Số tiền đã nộp</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {payment?.amountPaid?.toLocaleString("vi-VN") || ""}
                </p>
              </div>
            ) : (
              <Form.Item name="amountPaid" label="Số tiền đã nộp">
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  disabled={isViewMode}
                  rules={[{ required: true }]}
                  placeholder="Nhập số tiền đã nộp"
                />
              </Form.Item>
            )}

            {isViewMode ? (
              <div>
                <h6>Ngày nộp</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {payment?.paymentDate || ""}
                </p>
              </div>
            ) : (
              <Form.Item
                name="paymentDate"
                label="Ngày nộp"
                rules={[{ required: true }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  disabled={isViewMode}
                  placeholder="Chọn ngày nộp"
                />
              </Form.Item>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isViewMode ? (
              <div>
                <h6>Phương thức</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {payment?.method || ""}
                </p>
              </div>
            ) : (
              <Form.Item name="method" label="Phương thức">
                <Input
                  disabled={isViewMode}
                  placeholder="Nhập phương thức thanh toán"
                />
              </Form.Item>
            )}

            {isViewMode ? (
              <div>
                <h6>Trạng thái</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {STATUS_LABELS[payment?.status] || payment?.status || ""}
                </p>
              </div>
            ) : (
              <Form.Item name="status" label="Trạng thái">
                <Select placeholder="Chọn trạng thái" disabled={isViewMode}>
                  <Select.Option value="PENDING">Đang xử lý</Select.Option>
                  <Select.Option value="PARTIAL">
                    Đã đóng một phần
                  </Select.Option>
                  <Select.Option value="COMPLETED">Đã đóng</Select.Option>
                </Select>
              </Form.Item>
            )}
          </div>

          {isViewMode || isEditMode ? (
            <div>
              <h6 className={`${isEditMode && "font-normal!"}`}>Quỹ</h6>
              <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {funds.find((f) => f.id === payment?.fundId)?.name || ""}
              </p>
            </div>
          ) : (
            <Form.Item name="fundId" label="Quỹ">
              <Select
                placeholder="Chọn quỹ (nếu có)"
                allowClear
                disabled={isViewMode}
              >
                {funds.map((f) => (
                  <Select.Option key={f.id} value={f.id}>
                    {f.name || `#${f.id}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {isViewMode ? (
            <div className="flex flex-col">
              <h6>Ghi chú</h6>
              <p className="h-[76px] px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-gray-900 ">
                {payment?.notes || "Chưa có ghi chú"}
              </p>
            </div>
          ) : (
            <Form.Item name="notes" label="Ghi chú">
              <TextArea rows={3} disabled={isViewMode} />
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
}
