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
  userManagementAPI,
} from "../services/api";

const STATUS_LABELS = {
  OPEN: "Đang mở",
  CANCELED: "Đã hủy",
  CLOSED: "Đã đóng",
};

const { TextArea } = Input;

export default function FeesEventCreateModal({
  visible,
  onClose,
  onCreated,
  onUpdated, // Callback khi update thành công
  onSwitchToEdit, // Callback để chuyển mode từ VIEW sang EDIT
  onSwitchToView,
  feesEvent, // Dữ liệu sự kiện cần xem/sửa
  feesEventMode, // "VIEW" hoặc "EDIT"
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);

  // State cho các select option
  const [feeTypes, setFeeTypes] = useState([]);
  const [funds, setFunds] = useState([]);
  const [collectorUsers, setCollectorUsers] = useState([]);
  const [approverUsers, setApproverUsers] = useState([]);

  // Xác định mode hiện tại
  const isViewMode = feesEventMode === "VIEW";
  const isEditMode = feesEventMode === "EDIT";

  // Load dữ liệu phụ trợ (Types, Funds, Users)
  useEffect(() => {
    if (!visible) return;
    setLoadingMeta(true);
    Promise.all([
      feeManagementAPI.getFeeTypes(),
      fundManagementAPI.getFunds(),
      userManagementAPI.getUsers({
        page: 0,
        size: 1000,
        sort: "id",
        roleId: 3,
      }),
    ])
      .then(([types, fetchedFunds, collectorUsersData]) => {
        setFeeTypes(types || []);
        setFunds(fetchedFunds || []);
        setCollectorUsers(collectorUsersData?.content || []);
        setApproverUsers(collectorUsersData?.content || []);
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể tải dữ liệu phụ trợ");
      })
      .finally(() => setLoadingMeta(false));
  }, [visible]);

  // Load dữ liệu của feesEvent vào Form khi mở modal
  useEffect(() => {
    if (visible) {
      if (feesEvent) {
        // Mode VIEW hoặc EDIT: Fill data
        form.setFieldsValue({
          feeTypeId: feesEvent?.feeTypeId,
          fundId: feesEvent?.fundId,
          eventDate: feesEvent?.eventDate ? dayjs(feesEvent?.eventDate) : null,
          dueDate: feesEvent?.dueDate ? dayjs(feesEvent?.dueDate) : null,
          collectorUserId: feesEvent?.collectorUserId,
          approverUserId: feesEvent?.approverUserId,
          totalExpected: feesEvent?.totalExpected,
          status: feesEvent?.status,
          description: feesEvent?.description,
        });
      } else {
        // Mode CREATE: Reset form
        form.resetFields();
      }
    }
  }, [visible, feesEvent, form]);

  const handleOk = async () => {
    // Nếu đang ở chế độ VIEW thì nút OK đóng vai trò như nút Cancel hoặc không làm gì (đã xử lý ở footer)
    if (isViewMode) {
      onSwitchToView && onSwitchToView();
      return;
    }

    try {
      const values = await form.validateFields();
      const payload = {
        feeTypeId: Number(values.feeTypeId),
        eventDate: values.eventDate
          ? dayjs(values.eventDate).format("YYYY-MM-DD")
          : null,
        dueDate: values.dueDate
          ? dayjs(values.dueDate).format("YYYY-MM-DD")
          : null,
        description: values.description || "",
        collectorUserId:
          values.collectorUserId != null ? Number(values.collectorUserId) : 0,
        approverUserId:
          values.approverUserId != null ? Number(values.approverUserId) : 0,
        totalExpected:
          values.totalExpected != null ? Number(values.totalExpected) : 0,
        status: values.status || "",
        fundId: values.fundId != null ? Number(values.fundId) : 0,
      };

      setLoading(true);

      if (isEditMode && feesEvent?.id) {
        // --- LOGIC UPDATE ---
        // Giả sử feeManagementAPI đã có hàm updateEvent như yêu cầu,
        // hoặc bạn có thể gọi trực tiếp fetch ở đây nếu chưa có trong service.
        await feeManagementAPI.updateEvent(feesEvent?.id, payload);
        message.success("Cập nhật đợt thu thành công");
        onUpdated && onUpdated();
      } else {
        // --- LOGIC CREATE ---
        const created = await feeManagementAPI.createEvent(payload);
        message.success("Tạo đợt thu thành công");
        onCreated && onCreated(created);
        form.resetFields();
      }

      onClose && onClose();
    } catch (err) {
      if (err.errorFields) return; // validation error
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

  // Xác định Tiêu đề Modal
  const getModalTitle = () => {
    if (isViewMode) return "Chi tiết đợt thu";
    if (isEditMode) return "Cập nhật đợt thu";
    return "Tạo đợt thu mới";
  };

  // Custom Footer cho Modal
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
      footer={renderFooter()} // Sử dụng footer tùy chỉnh
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
              <div className="">
                <h6>Loại phí</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded text-gray-900">
                  {feeTypes.find((t) => t.id === feesEvent?.feeTypeId)?.name ||
                    ""}
                </p>
              </div>
            ) : (
              <Form.Item
                name="feeTypeId"
                label="Loại phí"
                rules={[{ required: isViewMode ? false : true }]}
              >
                <Select placeholder="Chọn loại phí" disabled={isViewMode}>
                  {feeTypes.map((t) => (
                    <Select.Option key={t.id} value={t.id}>
                      {t.name || t.description || `#${t.id}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {isViewMode ? (
              <div className="">
                <h6>Quỹ</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {funds.find((f) => f.id === feesEvent?.fundId)?.name || ""}
                </p>
              </div>
            ) : (
              <Form.Item
                name="fundId"
                label="Quỹ"
                rules={[{ required: isViewMode ? false : true }]}
              >
                <Select placeholder="Chọn quỹ" disabled={isViewMode}>
                  {funds.map((f) => (
                    <Select.Option key={f.id} value={f.id}>
                      {f.name || `#${f.id}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isViewMode ? (
              <div className="">
                <h6>Ngày bắt đầu</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {feesEvent?.eventDate || ""}
                </p>
              </div>
            ) : (
              <Form.Item
                name="eventDate"
                label="Ngày bắt đầu"
                rules={[{ required: isViewMode ? false : true }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày"
                  disabled={isViewMode}
                />
              </Form.Item>
            )}
            {isViewMode ? (
              <div className="">
                <h6>Hạn nộp</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {feesEvent?.dueDate || ""}
                </p>
              </div>
            ) : (
              <Form.Item
                name="dueDate"
                label="Hạn nộp"
                rules={[{ required: isViewMode ? false : true }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày"
                  disabled={isViewMode}
                />
              </Form.Item>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isViewMode ? (
              <div className="">
                <h6>Người thu</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {collectorUsers.find(
                    (c) => c.id === feesEvent?.collectorUserId
                  )?.username || ""}
                </p>
              </div>
            ) : (
              <Form.Item
                name="collectorUserId"
                label="Người thu"
                rules={[{ required: isViewMode ? false : true }]}
              >
                <Select placeholder="Chọn người thu" disabled={isViewMode}>
                  {collectorUsers.map((c) => (
                    <Select.Option key={c.id} value={c.id}>
                      {c.username || `#${c.id}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {isViewMode ? (
              <div className="">
                <h6>Người xác thực</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {approverUsers.find((a) => a.id === feesEvent?.approverUserId)
                    ?.username || "Chưa có thông tin "}
                </p>
              </div>
            ) : (
              <Form.Item name="approverUserId" label="Người xác thực">
                <Select placeholder="Chọn người xác thực" disabled={isViewMode}>
                  {approverUsers.map((a) => (
                    <Select.Option key={a.id} value={a.id}>
                      {a.username || `#${a.id}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isViewMode ? (
              <div className="">
                <h6>Tổng dự kiến</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {feesEvent?.totalExpected?.toLocaleString("vi-VN") || ""}
                </p>
              </div>
            ) : (
              <Form.Item name="totalExpected" label="Tổng dự kiến">
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  disabled={isViewMode}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            )}

            {isViewMode ? (
              <div>
                <h6>Trạng thái</h6>
                <p className="h-8 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {STATUS_LABELS[feesEvent?.status] || ""}
                </p>
              </div>
            ) : (
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: isViewMode ? false : true }]}
              >
                <Select placeholder="Chọn trạng thái" disabled={isViewMode}>
                  <Select.Option value="OPEN">Đang mở</Select.Option>
                  <Select.Option value="CANCELED">Đã hủy</Select.Option>
                  <Select.Option value="CLOSED">Đã đóng</Select.Option>
                </Select>
              </Form.Item>
            )}
          </div>

          {isViewMode ? (
            <div className="flex flex-col">
              <h6>Mô tả </h6>
              <p className="h-[76px] px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-gray-900 ">
                {feesEvent?.description || "Chưa có mô tả "}
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
