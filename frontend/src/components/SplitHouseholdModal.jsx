import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import ConfirmModal from "./ConfirmModal";

const SplitHouseholdModal = ({ open, onClose, household, selectedMembers }) => {
  const [form] = Form.useForm();
  const [members, setMembers] = useState([]);

  // Confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmContext, setConfirmContext] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const openConfirm = (context, action) => {
    setConfirmContext(context);
    setPendingAction(() => action);
    setConfirmOpen(true);
  };
  const handleConfirmYes = () => {
    if (pendingAction) pendingAction();
    setConfirmOpen(false);
  };
  const handleConfirmNo = () => setConfirmOpen(false);

  // INITIAL LOAD – copy data from household + selected members
  useEffect(() => {
    if (open && household) {
      form.setFieldsValue({
        code: household.code + "_TACH",
        wardId: household.wardId,
        houseAddressDetails: household.houseAddressDetails,
        notes: household.notes,
      });

      // map selected members
      console.log("Selected members for split:", selectedMembers);
      setMembers(
        selectedMembers.map((m) => ({
          personId: m.personId,
          fullName: m.fullName,
          idNumber: m.idNumber,
          dateOfBirth: m.dateOfBirth,
          isHead: false,
          relationWithHead: m.relationToHead || "",
        }))
      );
    }
  }, [open, household, selectedMembers]);

  const setMemberHead = (personId, isHead) => {
    setMembers((prev) =>
      prev.map((m) => ({
        ...m,
        isHead: m.personId === personId,
        relationWithHead:
          m.personId === personId ? "" : m.relationWithHead,
      }))
    );
  };

  const setMemberRelation = (personId, value) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.personId === personId ? { ...m, relationWithHead: value } : m
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const headCount = members.filter((m) => m.isHead).length;
      if (headCount !== 1) {
        message.error("Phải có đúng 1 chủ hộ trước khi gửi");
        return;
      }

      const payload = {
        code: values.code,
        wardId: values.wardId,
        houseAddressDetails: values.houseAddressDetails,
        notes: values.notes,
        members: members.map((m) => ({
          personId: m.personId,
          isHead: m.isHead,
          relationWithHead: m.relationWithHead,
        })),
      };

      openConfirm("submit", async () => {
        // await onSubmit(payload);

        message.success("Tách hộ khẩu thành công!");
        onClose();
      });
    } catch (e) {
      message.error("Vui lòng kiểm tra lại thông tin");
    }
  };

  const handleClose = () => {
    openConfirm("close", () => {
      form.resetFields();
      onClose();
    });
  };

  return (
    <>
      <Modal
        title="Tách hộ khẩu"
        open={open}
        onCancel={handleClose}
        footer={null}
        width={900}
        centered
        destroyOnHidden={true}
      >
        <Form form={form} layout="vertical">
          <h3 className="font-semibold text-lg border-b pb-1 mb-3">Thông tin chung</h3>

          <div className="grid grid-cols-2 gap-8 mb-4">
            <div className="col-span-1">
              <Form.Item
                label="Mã hộ khẩu mới"
                name="code"
                rules={[{ required: true, message: "Nhập mã hộ khẩu" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Ghi chú" name="notes">
                <Input.TextArea rows={2} />
              </Form.Item>
            </div>

            <div className="col-span-1">
              <Form.Item label="ID Phường/Xã" name="wardId">
                <Input disabled />
              </Form.Item>

              <Form.Item label="Chi tiết địa chỉ" name="houseAddressDetails">
                <Input.TextArea />
              </Form.Item>
            </div>
          </div>
        </Form>

        <h3 className="font-semibold text-lg border-b pb-1 mt-6 mb-3">Danh sách thành viên tách ra</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {members.map((m) => (
            <div
              key={m.personId}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 220px",
                gap: 8,
                alignItems: "center",
                border: "1px solid #f0f0f0",
                padding: 8,
                borderRadius: 6,
              }}
            >
              <div style={{ fontWeight: 600 }}>{m.fullName}</div>
              <div>{m.idNumber}</div>
              <div>{m.dateOfBirth}</div>

              <div style={{ display: "flex", gap: 8 }}>
                <Select
                  value={m.isHead}
                  style={{ width: 140 }}
                  onChange={(v) => setMemberHead(m.personId, v)}
                >
                  <Select.Option value={true}>Chủ hộ</Select.Option>
                  <Select.Option value={false}>Khác</Select.Option>
                </Select>

                {!m.isHead && (
                  <Input
                    placeholder="Quan hệ với chủ hộ"
                    value={m.relationWithHead}
                    onChange={(e) => setMemberRelation(m.personId, e.target.value)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Xác nhận
          </Button>
        </div>
      </Modal>

      <ConfirmModal
        open={confirmOpen}
        onCancel={handleConfirmNo}
        onConfirm={handleConfirmYes}
        message={
          confirmContext === "submit"
            ? "Bạn có chắc muốn tạo hộ khẩu mới từ thông tin đã chọn?"
            : "Bạn có chắc muốn đóng? Dữ liệu sẽ không được lưu."
        }
      />
    </>
  );
};

export default SplitHouseholdModal;
